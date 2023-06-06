<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:16:23
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-05 15:47:45
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

import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepoStore } from '@/store/modules/repo'

const beforeRoute = async (to, from, next) => {
	try {
		const repoStore = useRepoStore()
		const { owner, repo } = to.params
		if (repo && repo !== repoStore.getRepoName) {
			const details = await repoStore.apiGetRepo({ owner, repo })
			repoStore.setDetails(details)
		}
		next()
	} catch (err) {
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
