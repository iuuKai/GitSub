<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:16:23
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-03 03:31:57
 * @FilePath: \gitsub\src\views\Repo\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div v-if="(isHasReadme && readmeContent) || (!isHasReadme && isLoaded)">
		<a-breadcrumb :routes="routes">
			<template #itemRender="{ route, paths }">
				<span v-if="routes.indexOf(route) === routes.length - 1">
					<HddOutlined />
					{{ route.breadcrumbName }}
				</span>
				<router-link v-else :to="`${basePath}/${paths.join('')}`">
					<UserOutlined />
					{{ route.breadcrumbName }}
				</router-link>
			</template>
		</a-breadcrumb>

		<a-row v-if="repoDetails.fork && repoDetails.parent">
			<span>
				Forked from
				<a @click="handleClick(repoDetails.parent.full_name)">
					{{ repoDetails.parent.full_name }}
				</a>
			</span>
		</a-row>

		<div v-if="repoDetails.description">简介: {{ repoDetails.description }}</div>
		<div v-else>暂无简介</div>
		<a-tag v-for="tag in repoDetails.topics" :color="isDark ? '#108ee9' : 'blue'">
			{{ tag }}
		</a-tag>

		<a-divider />

		<a-row :gutter="16">
			<a-col :span="18">
				<router-view></router-view>
			</a-col>
			<a-col :span="6"></a-col>
		</a-row>
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
