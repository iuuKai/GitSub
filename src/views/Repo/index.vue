<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:16:23
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-03 10:33:25
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
import getTasks from './script/repo-index'

const beforeRoute = async (to, from, next) => {
	try {
		if (decodeURIComponent(to.path) !== decodeURIComponent(from.path)) {
			const promiseList = getTasks(to)
			const _toList = await Promise.all(promiseList)
			const errorList = _toList.filter(Boolean)
			if (errorList.length) throw errorList
		}
		next()
	} catch (err) {
		console.log(err)
		const err404page = err.filter(item => item.type === '404' || !item.type)[0]
		const replacePage = err.filter(item => item.type === 'replace')[0]
		if (err404page) next({ name: 'Error', query: { redirect: to.fullPath } })
		else if (replacePage) next(replacePage.data)
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
