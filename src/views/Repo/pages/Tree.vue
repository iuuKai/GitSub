<!--
 * @Author: iuukai
 * @Date: 2023-03-06 05:49:54
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-09 20:34:17
 * @FilePath: \gitsub\src\views\Repo\pages\Tree.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<div class="file-list_container">
			<Gradients type="border" />
			<FileList
				:list="contentList"
				@file-click="handleClickFile"
				@download-click="handleClickDownload"
			/>
		</div>
		<a-divider />
		<div class="markdown_container">
			<Gradients type="border" />
			<MarkDownPreview
				v-if="readmeContent"
				:isDark="isDark"
				:title="title"
				:content="readmeContent"
				@link-before="handleClickLink"
			/>
		</div>
	</div>
</template>

<script setup>
import { FileList } from '../components'
import { MarkDownPreview } from '@/components/basic/markdown'
import { message as $message } from 'ant-design-vue'
import { reactive, toRefs, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import { Base64 } from '@/utils/crypto'
import { toLower, isArray } from 'lodash-es'
import { fileDownload } from '@/utils/file-download'

const route = useRoute()
const router = useRouter()
const repoStore = useRepoStore()
const themeStore = useThemeStore()
const state = reactive({
	isDark: computed(() => themeStore.getTheme === 'dark'),
	contentList: [],
	eventList: [],
	contributorList: [],
	commitList: [],
	title: '',
	readmeContent: ''
})
const { isDark, contentList, eventList, contributorList, commitList, title, readmeContent } =
	toRefs(state)

watch(route, n => {
	/**
	 * !!!!!!!!!!!!!!!!!!!!!!! 退出登录会触发报错
	 */
	console.log(n)

	getRepoData()
})

getRepoData()
async function getRepoData() {
	try {
		const { owner, repo, path } = route.params
		console.log(path)
		// 仓库内容
		const p1 = repoStore.apiGetRepoPathContentList({
			owner,
			repo,
			path: isArray(path) ? path.join('/') : ''
		})
		// 仓库公开动态
		const p2 = repoStore.apiGetRepoNetworksEventList({ owner, repo })
		// 仓库贡献者
		const p3 = repoStore.apiGetRepoContributorList({
			owner,
			repo,
			// authors | committers
			type: 'authors',
			page: 1,
			per_page: 20
		})
		// 仓库所有提交
		const p4 = repoStore.apiGetRepoCommitList({ owner, repo })
		// 仓库tags
		const p5 = repoStore.apiGetRepoTagList({ owner, repo })

		const [contentList, eventList, contributorList, commitList] = await Promise.all([
			p1,
			p2,
			p3,
			p4,
			p5
		])
		state.contentList = contentList
		state.eventList = eventList
		state.contributorList = contributorList
		state.commitList = commitList

		const isHasReadme = contentList.findIndex(item => toLower(item.name) === 'readme.md') > -1
		if (isHasReadme) {
			const { name, content } = await repoStore.apiGetRepoReadme({ owner, repo })
			state.title = name
			state.readmeContent = Base64.dec(content)
		}
	} catch (err) {
		console.error(err)
	}
}

function handleClickFile(file) {
	const { type, path } = file
	const { default_branch: branch } = repoStore.getDetails
	const routeName = type === 'dir' ? 'Tree' : 'Blob'

	router.push({
		name: routeName,
		params: {
			branch,
			path: path.split('/')
		}
	})
}

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

function handleClickLink(url) {
	console.log(url)
}
</script>

<style lang="less" scoped></style>
