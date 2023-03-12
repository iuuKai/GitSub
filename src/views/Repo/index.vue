<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:16:23
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-08 07:39:09
 * @FilePath: \gitsub\src\views\Repo\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="repo_main">
		<RepoHeader />
		<router-view></router-view>
	</div>
</template>

<script setup>
import { RepoHeader } from './components'

import { reactive, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepoStore } from '@/store/modules/repo'

const route = useRoute()
const router = useRouter()
const repoStore = useRepoStore()

getRepoDetails()
async function getRepoDetails() {
	try {
		console.log(route.params)
		const details = await repoStore.apiGetRepo(route.params)
		repoStore.setDetails(details)
	} catch (err) {
		console.error('details:', err)
	}
}
</script>

<style lang="less" scoped></style>
