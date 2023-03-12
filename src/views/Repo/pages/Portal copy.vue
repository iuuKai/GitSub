<!--
 * @Author: iuukai
 * @Date: 2023-03-03 03:44:46
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-04 20:09:14
 * @FilePath: \gitsub\src\views\Repo\pages\Portal copy.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<a-card :bodyStyle="{ padding: 0 }">
			<template #title>
				<a-row v-if="commit">
					<a-space>
						<a-avatar :src="commit?.author?.avatar_url" size="small">
							<template #icon><UserOutlined /></template>
						</a-avatar>
						<span>{{ commit?.author?.login }}</span>
						<!-- <router-link
									:title="commit?.commit?.message"
									:to="`${route.path}/commits/${commit?.sha}`"
								>
									{{ commit?.commit?.message }}
								</router-link> -->
						<!-- <a-typography-link
									:style="{ width: '100%' }"
									:ellipsis="{ tooltip: commit?.commit?.message }"
									:content="commit?.commit?.message"
								/> -->
						<a-typography-link
							@click="
								handleClick({
									params: {
										branch: commit.sha
									},
									name: 'Commits'
								})
							"
							:style="{ width: '300px' }"
							:ellipsis="true"
							:content="commit?.commit?.message"
						/>
						<time>{{ dayjs(commit?.commit?.author?.date).from() }}</time>
					</a-space>
				</a-row>
			</template>

			<a-list size="small" :data-source="contents">
				<template #header>
					<div class="list-header">
						<a-space>
							<a-avatar :src="commit?.author?.avatar_url" size="small">
								<template #icon><UserOutlined /></template>
							</a-avatar>
							<span>{{ commit?.author?.login }}</span>
							<a-typography-link
								@click="
									handleClick({
										params: {
											branch: commit.sha
										},
										name: 'Commits'
									})
								"
								:style="{ width: '300px' }"
								:ellipsis="true"
								:content="commit?.commit?.message ?? ''"
							/>
							<time>{{ dayjs(commit?.commit?.author?.date).from() }}</time>
						</a-space>
					</div>
				</template>
				<template #renderItem="{ item }">
					<a-list-item class="list-item">
						<a-space :size="5">
							<component :is="item.type === 'dir' ? FolderFilled : FileOutlined"></component>
							<a
								@click="
									handleClick({
										name: type === 'dir' ? 'Tree' : 'Blob',
										params: {
											branch: repoDetails.default_branch,
											path: item.path
										}
									})
								"
								:title="item.name"
							>
								{{ item.name }}
							</a>
						</a-space>
					</a-list-item>
				</template>
			</a-list>
		</a-card>

		<a-divider />

		<MarkDownPreview
			v-if="isHasReadme"
			:isDark="isDark"
			title="README.md"
			:content="readmeContent"
		/>
	</div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, onMounted, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDayjs } from '@/hooks/useDayjs'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import {
	UserOutlined,
	HddOutlined,
	FolderFilled,
	FolderOutlined,
	FileOutlined
} from '@ant-design/icons-vue'
import { toLower } from 'lodash-es'

import { Base64 } from '@/utils/crypto'
import { MarkDownPreview } from '@/components/basic/markdown'

const basePath = computed(() => `/${route.params.type}`)

const routes = ref([
	{
		path: computed(() => route.params.owner),
		breadcrumbName: computed(() => route.params.owner),
		children: [
			{
				path: '',
				breadcrumbName: 'Overview'
			},
			{
				path: '?tab=repositories',
				breadcrumbName: 'Repositories'
			},
			{
				path: '?tab=stars',
				breadcrumbName: 'Stars'
			}
		]
	},
	{
		path: 'second',
		breadcrumbName: computed(() => route.params.repo)
	}
])

const dayjs = useDayjs()
const route = useRoute()
const router = useRouter()
const repoStore = useRepoStore()
const themeStore = useThemeStore()

const state = reactive({
	isDark: computed(() => themeStore.getTheme === 'dark'),
	isHasReadme: false,
	isLoaded: false,
	repoDetails: null,
	commit: null,
	contents: []
})
const { isDark, isHasReadme, isLoaded, repoDetails, commit, contents } = toRefs(state)

const readmeContent = ref('')

// 当访问 fork 仓库时，route 会被监听，但 setup 不会再次执行，所以要用 watch 响应获取数据
// watch(
// 	route,
// 	(newVal, oldVal) => {
// 		if (!newVal.params.repo) return
// 		state.repoDetails = null
// 		getRepo()
// 		// if (!oldVal || newVal.path !== oldVal) getRepo()
// 	},
// 	{ immediate: true }
// )

getRepo()
async function getRepo() {
	try {
		const { type, owner, repo } = route.params
		state.repoDetails = await repoStore.apiGetRepo({ owner, repo })
		const sha = state.repoDetails.default_branch

		// const { tree } = await repoStore.apiGetRepoTree({ owner, repo, sha, recursive: '1' })

		state.contents = (
			await repoStore.apiGetRepoPathContentList({
				owner,
				repo
				// path: 'src',
				// ref: 'dev'
			})
		).sort((a, b) => a.type.localeCompare(b.type))

		state.isHasReadme = state.contents.findIndex(item => toLower(item.name) === 'readme.md') > -1
		console.log(state.isHasReadme)

		/**
		 * 注意，在 contents 里应当对 readme 进行判断有无
		 */
		if (state.isHasReadme) {
			const readme = await repoStore.apiGetRepoReadme({ owner, repo })
			readmeContent.value = Base64.dec(
				readme[true ? 'content' : 'readmeContent'].replaceAll('\n', '')
			)
		}

		// const contributors = await repoStore.apiGetRepoContributorList({ owner, repo })

		// const branches = await repoStore.apiGetRepoBrancheList({ owner, repo })

		// const tags = await repoStore.apiGetRepoTagList({ owner, repo })

		// const commits = await repoStore.apiGetRepoCommitList({ owner, repo, page: '1', per_page: '1' })

		state.commit = await repoStore.apiGetRepoCommit({
			owner,
			repo,
			sha
			// page: '1',
			// per_page: '1'
		})

		// const collaborators = await repoStore.apiGetRepoCollaboratorList({ owner, repo })

		// const networksEvents = await repoStore.apiGetRepoNetworksEventList({ owner, repo })

		// console.log('[ staredList ] >', staredList)

		state.isLoaded = true
	} catch (error) {
		// 如果不存在仓库，则跳 404
		console.log(error)
		return Promise.reject(error)
	}
}

function handleClick({ name, params }) {
	const { owner, repo } = route.params
	router.push({
		name,
		params
	})
	// const { type } = route.params
	// router.push(`/${type}/${path}`)
}

function handleClickDir(item) {
	const { type, path } = item
	router.push({
		name: type === 'dir' ? 'Tree' : 'Blob',
		params: {
			branch: state.repoDetails.default_branch,
			path
		}
	})
}
</script>

<style lang="less" scoped>
.list-header {
	@apply px-4;
}

.list-item {
	@apply hover:(bg-gray-50 dark:bg-dark-500);
}
</style>
