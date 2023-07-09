<!--
 * @Author: iuukai
 * @Date: 2023-03-29 12:40:31
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-07 12:32:17
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
					<a-card :bodyStyle="{ padding: 0 }">
						<template #title>
							<template v-if="curPathCommit">
								<a-row align="middle" :style="{ fontSize: '14px' }">
									<a-col>
										<a-avatar :src="curPathCommit.author?.avatar_url" size="small">
											<template #icon><UserOutlined /></template>
										</a-avatar>
									</a-col>
									<!-- 溢出会换行 -->
									<a-col flex="1" :style="{ marginLeft: '12px' }">
										<a-row>
											<a-col>
												<a-space>
													<a>
														{{ curPathCommit.author?.login || curPathCommit.commit.author.name }}
													</a>
													<a-typography-link
														type="secondary"
														ellipsis
														:title="curPathCommit.commit.message"
														:content="curPathCommit.commit.message.match(/^[^\n]*/)?.[0]"
													></a-typography-link>
												</a-space>
											</a-col>
											<a-col
												flex="1"
												:style="{ display: 'flex', marginLeft: '16px', justifyContent: 'flex-end' }"
											>
												<a-space>
													<a-typography-link
														type="secondary"
														ellipsis
														:title="curPathCommit.sha"
														:content="curPathCommit.sha.substring(0, 7)"
													/>
													<a-typography-text
														type="secondary"
														:title="
															dayjs(curPathCommit.commit.author.date).format(
																'MMM D, YYYY[, ]h:mm A [GMT]ZZ'
															)
														"
													>
														{{ dayjs(curPathCommit.commit.author.date).from() }}
													</a-typography-text>
												</a-space>
											</a-col>
										</a-row>
									</a-col>
									<a-col :style="{ marginLeft: '16px' }">
										<a>
											<a-space :size="4">
												<HistoryOutlined :style="{ fontSize: '16px' }" />
												<span>
													<template v-if="curPathCommit.total">
														{{ curPathCommit.total }} commits
													</template>
													<template v-else>History</template>
												</span>
											</a-space>
										</a>
									</a-col>
								</a-row>
							</template>
						</template>
						<FileList
							:list="treeList"
							@file-click="handleClickFile"
							@download-click="handleClickDownload"
						/>
					</a-card>
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
								showAnchor
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
				<RepoProfile />
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
import { FileList, RepoProfile } from '../components'
import { Modal } from 'ant-design-vue'
import { message as $message } from 'ant-design-vue'
import {
	FileTextOutlined,
	ExclamationCircleOutlined,
	UserOutlined,
	HistoryOutlined
} from '@ant-design/icons-vue'

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
import { toLower, isArray, isPlainObject, isEmpty } from 'lodash-es'
import { fileDownload } from '@/utils/file-download'
import scrollTo from '../../../components/basic/markdown/hooks/scrollTo'
import { useDayjs } from '@/hooks/useDayjs'

export default defineComponent({
	setup() {
		const route = useRoute()
		const router = useRouter()
		const domStore = useDomStore()
		const repoStore = useRepoStore()
		const themeStore = useThemeStore()
		const dayjs = useDayjs()

		// 非响应数据
		const repoDetails = repoStore.getDetails
		const blobData = isPlainObject(repoStore.getContents) ? repoStore.getContents : {}
		// const treeList = isArray(repoStore.getContents) ? repoStore.getContents : []

		const state = reactive({
			isPortal: computed(() => {
				const { path } = route.params
				return !path || !path.length
			}),
			isDark: computed(() => themeStore.getTheme === 'dark'),
			curPathCommit: repoStore.getCurPathCommit,
			targetScroll: computed(() => () => domStore.getScrollContainer),
			treeList: isArray(repoStore.getContents) ? repoStore.getContents : [],
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

		// readme
		const isHasReadme =
			state.treeList.findIndex(item => /^readme(?!\w)/.test(toLower(item.name))) > -1 &&
			isEmpty(route.params.path)
		// 许可
		const isHasLicense =
			state.treeList.findIndex(item => /^license(?!\w)/.test(toLower(item.name))) > -1
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

		// watch(
		// 	() => state.fileContents,
		// 	content => {
		// 		repoStore.setTextContent(content)
		// 	}
		// )

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
				const list = [getFileContent(params), getCommitList(params)]
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
		async function getCommitList({ owner, repo }) {
			try {
				const promiseList = state.treeList.map(async (item, i) => {
					const { path } = item
					const [commit] = await repoStore.apiGetRepoCommitList({
						owner,
						repo,
						path
						// per_page: '1'
					})
					return {
						...item,
						demo: commit
					}
				})
				state.treeList = await Promise.all(promiseList)
			} catch (err) {
				return Promise.resolve({ name: 'apiGetRepoCommitList', err })
			}
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
		}

		// md 链接
		function handleClickLink(link) {
			const url = decodeURIComponent(link)
			if (!/^(http[s]?:)?\/\//i.test(url) && !isFullscreen.value) {
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
						contentType: route.params.contentType || 'blob',
						path: pathList,
						branch
					},
					hash: ''
				})
			} else {
				Modal.confirm({
					icon: h(ExclamationCircleOutlined),
					title: '即将跳转到外部网站, 是否继续?',
					content: () => h('a', link),
					width: '620px',
					getContainer: () => (isFullscreen.value ? unrefElement(mdContainerRef) : document.body),
					centered: true,
					okType: 'primary',
					okText: 'Yes',
					// okButtonProps: {
					// 	disabled: true
					// },
					cancelText: 'No',
					onOk() {
						console.log('OK', url)
						window.open(link, '_blank')
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
			// treeList,
			handleClickFile,
			handleClickDownload,
			handleClickCopy,
			handleClickLink,
			handleClickEdit,
			handleScrollTo,
			handleFullScreenToogle,
			dayjs
		}
	},
	components: {
		FileTextOutlined,
		MarkDownPreview,
		UserOutlined,
		HistoryOutlined,
		FileList,
		RepoProfile
	}
})
</script>

<style lang="less" scoped>
.file-list_container {
	@apply mb-10px;
}
</style>
