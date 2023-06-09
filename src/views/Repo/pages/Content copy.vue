<!--
 * @Author: iuukai
 * @Date: 2023-03-29 12:40:31
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-09 11:30:36
 * @FilePath: \gitsub\src\views\Repo\pages\Content.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div ref="contentRef" class="reop_body">
		<a-row :gutter="16">
			<a-col :span="isPortal ? 18 : 24">
				<div v-if="treeList && treeList.length" class="file-list_container">
					<Gradients type="border" />
					<FileList
						:list="treeList"
						@file-click="handleClickFile"
						@download-click="handleClickDownload"
					/>
				</div>
				<div v-if="fileContents" ref="mdCardRef" class="md_card_container">
					<Gradients type="border" />
					<a-card class="demo" :bodyStyle="{ padding: 0 }">
						<template #title>
							<a-space>
								<FileTextOutlined />
								<span id="readme">{{ title }}</span>
								<a-button @click="handleClickEdit">edit</a-button>
								<a-button @click="handleFullScreenToogle">click</a-button>
							</a-space>
						</template>
						<div
							ref="mdContainerRef"
							:class="{ 'is-fullscreen': isFullscreen }"
							:style="isFullscreen ? null : { overflow: 'unset' }"
						>
							<MarkDownPreview
								ref="mdRef"
								:isDark="isDark"
								:title="title"
								:content="fileContents"
								:is-fullscreen="isFullscreen"
								@copied="handleClickCopy"
								@link-before="handleClickLink"
							/>
							<a-back-top v-if="isFullscreen" :target="() => mdRef.$el" />
						</div>
					</a-card>
				</div>
			</a-col>
			<a-col :span="isPortal ? 6 : 0">
				<div v-if="repoDetails" :style="{ position: 'sticky', top: '80px' }">
					<Gradients type="border" />
					<a-card :bodyStyle="{ padding: '15px' }">
						<a-typography-title :level="3">简介</a-typography-title>
						<div v-if="repoDetails.description">
							<a-typography-text type="secondary">
								{{ repoDetails.description }}
							</a-typography-text>
						</div>
						<div v-if="repoDetails.homepage">
							<a-typography-link :href="repoDetails.homepage" target="_blank">
								{{ repoDetails.homepage }}
							</a-typography-link>
						</div>
						<div v-if="repoDetails.topics">
							<a-tag v-for="tag in repoDetails.topics" :key="tag" color="blue">
								{{ tag }}
							</a-tag>
						</div>
						<div v-if="isHasReadme" @click="handleScrollTo">Readme</div>
						<div v-if="repoDetails.size">Size: {{ repoDetails.size }}</div>
						<div v-if="repoDetails.license && isHasLicense">License</div>
						<div>Stars: {{ repoDetails.stargazers_count }}</div>
						<div>Watching: {{ repoDetails.subscribers_count }}</div>
						<div>Forks: {{ repoDetails.network_count }}</div>
						<a-divider />
						<a-typography-title :level="3">发行版</a-typography-title>
						<div v-if="latestReleases">
							{{ latestReleases.name }}
							<a-tag color="green">Latest</a-tag>
							<div>
								<time :datetime="latestReleases.published_at" :title="latestReleases.published_at">
									{{ latestReleases.published_at }}
								</time>
							</div>
						</div>
						<a-empty v-else />
						<a-divider />
						<a-typography-title :level="3">贡献者</a-typography-title>
						<a-divider />
						<a-typography-title :level="3">近期动态</a-typography-title>
						<a-divider />
						<a-typography-title :level="3">语言</a-typography-title>
					</a-card>
				</div>
			</a-col>
		</a-row>
		<!-- <iframe
			ref="mdContainerRef"
			:src="`/fullscreen/${title}`"
			:style="{ display: isFullscreen ? 'block' : 'none' }"
		></iframe> -->
	</div>
</template>

<script>
import { MarkDownPreview } from '@/components/basic/markdown'
import { FileList } from '../components'
import { Modal } from 'ant-design-vue'
import { message as $message } from 'ant-design-vue'
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

import { h, defineComponent, reactive, toRefs, computed, ref, unref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	useElementBounding,
	unrefElement,
	useScroll,
	useFullscreen,
	useDebounceFn
} from '@vueuse/core'
import { useDomStore } from '@/store/modules/dom'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import { Base64 } from '@/utils/crypto'
import { toLower, isArray, isPlainObject } from 'lodash-es'
import { fileDownload } from '@/utils/file-download'
import scrollTo from '../../../components/basic/markdown/hooks/scrollTo'

export default defineComponent({
	setup() {
		const route = useRoute()
		const router = useRouter()
		const domStore = useDomStore()
		const repoStore = useRepoStore()
		const themeStore = useThemeStore()

		// 非响应数据
		const repoDetails = repoStore.getDetails
		const blobData = isPlainObject(repoStore.getContents) ? repoStore.getContents : {}
		const treeList = isArray(repoStore.getContents) ? repoStore.getContents : []
		// readme
		const isHasReadme = treeList.findIndex(item => /^readme(?!\w)/.test(toLower(item.name))) > -1
		// 许可
		const isHasLicense = treeList.findIndex(item => /^license(?!\w)/.test(toLower(item.name))) > -1

		const state = reactive({
			isPortal: computed(() => {
				const { path } = route.params
				return !path || !path.length
			}),
			isDark: computed(() => themeStore.getTheme === 'dark'),
			targetScroll: computed(() => () => domStore.getScrollContainer),
			eventList: [],
			contributorList: [],
			commitList: [],
			title: '',
			fileContents: '',
			latestReleases: null
		})
		const contentRef = ref(null)
		const mdCardRef = ref(null)
		const mdContainerRef = ref(null)
		const mdRef = ref(null)
		const { isFullscreen, toggle: handleFullScreenToogle } = useFullscreen(mdContainerRef)

		// const demo = computed(() => domStore.getScrollContainer)
		// const { y: scrollY } = useScroll(demo, { behavior: 'smooth' })
		// watch(scrollY, val => {
		// 	// domStore.setScrollY(val)
		// 	console.log('[ val ] >', val)
		// })

		watch(isFullscreen, val => {
			if (!val) $message.reset()
			else
				$message.config({
					getContainer: () => unrefElement(mdContainerRef)
				})
		})

		watch(
			() => state.fileContents,
			content => {
				repoStore.setMdContent(content)
				// localStorage.setItem('demo', content)
			}
		)

		// let foo = false
		// onMounted(() => {
		// 	window.addEventListener(
		// 		'message',
		// 		e => {
		// 			const { routeName, data } = e.data
		// 			if (routeName !== 'FullScreen' || !data || foo) return
		// 			foo = true
		// 			console.log(e.origin, e.data, '>>>>>')
		// 			handleClickLink(data.url)
		// 			foo = false
		// 		},
		// 		false
		// 	)
		// })

		function handleScrollTo() {
			const { top: parentTop } = useElementBounding(contentRef)
			const { top: childTop } = useElementBounding(mdCardRef)
			// const { y } = domStore.getScroll
			console.log({ y: unref(parentTop), top: unref(childTop) })
			// if (unref(top) === 80) return

			// 64 + 24 + 21 - 80
			const toTop = Math.abs(parentTop.value - (childTop.value + 29))
			// y.value = toY

			// console.log({
			// 	a: Math.abs(unref(scrollY) - (unref(top) + 29)),
			// 	b: Math.abs(unref(scrollY) - unref(top) + 80)
			// })
			scrollTo(toTop, {
				getContainer: unref(state.targetScroll)
			})
		}

		getRepoData()
		async function getRepoData() {
			try {
				const { owner, repo } = route.params
				const params = { owner, repo }
				const portalRequestList = state.isPortal ? getPromiseList(params) : []
				const list = [getFileContent(params), ...getCommitList(params), ...portalRequestList]
				const responseList = await Promise.all(list)
				const errorList = responseList.filter(Boolean)

				// 请求错误集合
				if (errorList.length) console.log('获取数据错误: ', errorList)
			} catch (err) {
				// 执行错误
				console.log('代码错误: ', err)
			}
		}

		// 文件内容
		async function getFileContent({ owner, repo }) {
			try {
				if (isHasReadme) {
					// Readme
					const { name, content } = await repoStore.apiGetRepoReadme({ owner, repo })
					state.title = name
					state.fileContents = Base64.dec(content)
				} else if (blobData?.content) {
					state.title = blobData.name
					state.fileContents = Base64.dec(blobData.content)
				}
			} catch (err) {
				return Promise.resolve({ name: 'apiGetRepoReadme', err })
			}
		}

		// 仓库 commit
		function getCommitList({ owner, repo }) {
			try {
				const promiseList = treeList.map(async ({ path }) => {
					const [commit] = await repoStore.apiGetRepoCommitList({
						owner,
						repo,
						path,
						per_page: '1'
					})
					// return commit
					console.log(commit)
				})
				console.log(promiseList, 123)
				return promiseList
				// const commits = (await Promise.all(promiseList)).flat()
				// console.log(
				// 	'%c [ commits ]-266',
				// 	'font-size:13px; background:pink; color:#bf2c9f;',
				// 	commits
				// )
			} catch (err) {
				return Promise.resolve({ name: 'apiGetRepoCommitList', err })
			}
		}

		// 其他主页数据
		function getPromiseList(_params = {}) {
			const list = [
				{ model: 'eventList', bindAction: 'apiGetRepoNetworksEventList' },
				{
					model: 'contributorList',
					bindAction: 'apiGetRepoContributorList',
					bindParams: { type: 'authors', page: 1, per_page: 20 }
				},
				// { model: 'commitList', bindAction: 'apiGetRepoCommitList', },
				{ model: 'tagList', bindAction: 'apiGetRepoTagList' },
				{ model: 'latestReleases', bindAction: 'apiGetRepoLatestReleases' }
			]
			return list
				.map(item => async () => {
					const { bindAction, model, bindParams } = item
					try {
						const params = Object.assign({}, _params, bindParams)
						state[model] = await repoStore[bindAction](params)
					} catch (err) {
						return Promise.resolve({ name: bindAction, state: model, err })
					}
				})
				.map(item => item())
		}

		// 下载
		async function handleClickDownload(file) {
			try {
				const { owner, repo } = route.params
				const { sha, name } = file
				console.log(file)
				const { content } = await repoStore.apiGetRepoBlobs({ owner, repo, sha })
				const fileName = fileDownload(content, name)
				$message.success(`已下载: ${fileName}`)
			} catch (err) {
				console.error('下载文件失败:', err)
				$message.error('文件下载失败')
			}
		}

		// 访问文件
		function handleClickFile(file) {
			const { type, path } = file
			const { default_branch: branch } = repoStore.getDetails
			const isBack = type === 'back'
			router.push({
				// name: 'Content',
				...route,
				params: {
					...route.params,
					contentType: isBack || type === 'dir' ? 'tree' : 'blob',
					branch,
					path: path.split('/').filter(Boolean)
				},
				hash: ''
			})
		}

		// 前往编辑
		function handleClickEdit() {
			const { default_branch: branch } = repoStore.getDetails
			const { contentType, path, ...params } = route.params
			console.log(params)
			router.push({ name: 'Edit', params: { ...params, branch, path: path ? path : state.title } })
		}

		function handleClickCopy(copy) {
			$message.success('复制成功')
			// $message.destroy()
		}

		// md 链接
		function handleClickLink(url) {
			if (!url || /^\/?#/.test(url)) return
			if (/^\.\.\/|^\.\//.test(url) && !isFullscreen.value) {
				const { path } = route.params
				const { default_branch: branch } = repoStore.getDetails
				const curPathList = (path || []).map(item => item)
				const targetPathList = url.split('/')
				const { countBySibling, countByParent } = targetPathList.reduce(
					(res, cur) => {
						cur == '.' ? res['countBySibling']++ : cur == '..' ? res['countByParent']++ : null
						return res
					},
					{ countBySibling: 0, countByParent: 0 }
				)

				const pathList = curPathList
					.slice(
						0,
						curPathList.length -
							1 -
							(countBySibling ? countBySibling : countByParent ? countByParent : 0)
					)
					.concat(targetPathList.filter(item => !['.', '..'].includes(item)))

				router.push({
					...route,
					params: {
						...route.params,
						path: pathList,
						branch
					},
					hash: ''
				})
			} else {
				Modal.confirm({
					icon: h(ExclamationCircleOutlined),
					title: 'Are you sure delete this task?',
					getContainer: () => (isFullscreen.value ? unrefElement(mdContainerRef) : document.body),
					content: 'Some descriptions',
					centered: true,
					okType: 'primary',
					okText: 'Yes',
					// okButtonProps: {
					// 	disabled: true
					// },
					cancelText: 'No',
					onOk() {
						console.log('OK', url)
					},
					onCancel() {
						console.log('Cancel')
					}
				})
			}
		}

		return {
			mdContainerRef,
			contentRef,
			mdCardRef,
			mdRef,
			...toRefs(state),
			isFullscreen,
			isHasReadme,
			isHasLicense,
			repoDetails,
			blobData,
			treeList,
			handleClickFile,
			handleClickDownload,
			handleClickCopy,
			handleClickLink,
			handleClickEdit,
			handleScrollTo,
			handleFullScreenToogle
		}
	},
	components: {
		FileTextOutlined,
		MarkDownPreview,
		FileList
	}
})
</script>

<style lang="less" scoped>
.file-list_container {
	@apply mb-10px;
}
</style>
