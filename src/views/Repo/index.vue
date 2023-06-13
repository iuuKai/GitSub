<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:16:23
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-13 09:31:33
 * @FilePath: \gitsub\src\views\Repo\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="repo_main">
		<RepoHeader @breadcrumb-click="handleClick" />
		<router-view></router-view>
	</div>
</template>

<script>
import { RepoHeader } from './components'

import { defineComponent } from 'vue'
import { useRepoStore } from '@/store/modules/repo'
import { isArray } from 'lodash-es'

const getRepoDetails = async _to => {
	try {
		const repoStore = useRepoStore()
		const { owner, repo } = _to.params
		if (repo && repo !== repoStore.getRepoName) {
			// 仓库详情信息
			const details = await repoStore.apiGetRepo({ owner, repo })
			await repoStore.setDetails(details)
		}
	} catch (err) {
		return { err, msg: '获取仓库详情失败' }
	}
}

const getRepoContents = async _to => {
	try {
		const repoStore = useRepoStore()
		const cachePath = repoStore.getPath
		const { owner, repo, path, contentType, branch } = _to.params
		const params = {
			owner,
			repo,
			path: isArray(path) ? path.join('/') : ''
		}
		const p = Object.values(params).join('/')
		if (_to.name !== 'Content' || cachePath === p) return
		if (branch) params.ref = branch
		// 仓库内容
		const contents = await repoStore.apiGetRepoPathContents(params)
		if (isArray(contents)) contents.sort((a, b) => a.type.localeCompare(b.type))
		if (isArray(contents) && !contents.length) throw new Error('404')
		const curType = isArray(contents) ? 'tree' : 'blob'
		await repoStore.setPath(p)
		await repoStore.setContents(contents)
		if (contentType && contentType !== curType)
			return {
				..._to,
				params: {
					..._to.params,
					contentType: curType
				}
			}
	} catch (err) {
		return { err, msg: '获取仓库内容失败' }
	}
}

const getCurPathCommit = async _to => {
	try {
		const repoStore = useRepoStore()
		const { owner, repo, path } = _to.params
		const [curCommit] = await repoStore.apiGetRepoCommitList({
			owner,
			repo,
			path: isArray(path) ? path.join('/') : '',
			per_page: '1'
		})
		repoStore.setCurPathCommit(curCommit)
	} catch (err) {
		return { err, msg: '获取当前路径commit失败' }
	}
}

const beforeRoute = async (to, from, next) => {
	try {
		const _toList = await Promise.all([
			getRepoDetails(to),
			getRepoContents(to),
			getCurPathCommit(to)
		])
		const _to = _toList.filter(Boolean)[0]
		next(_to)
	} catch (err) {
		console.log(err)
		next({ name: 'Error', query: { redirect: to.fullPath } })
	}
}

export default defineComponent({
	beforeRouteEnter: beforeRoute,
	beforeRouteUpdate: beforeRoute,
	setup() {
		const handleClick = value => {
			console.log('%c [ value ]-49', 'font-size:13px; background:pink; color:#bf2c9f;', value)
		}
		return {
			handleClick
		}
	},
	components: {
		RepoHeader
	}
})
</script>

<style lang="less" scoped></style>
