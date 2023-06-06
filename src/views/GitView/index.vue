<!--
 * @Author: iuukai
 * @Date: 2023-04-04 10:27:04
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-24 07:48:37
 * @FilePath: \gitsub\src\views\GitView\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<!-- <h1>123</h1> -->
		<router-view></router-view>
	</div>
</template>

<script>
import { defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOwnerStore } from '@/store/modules/owner'

const beforeRoute = async (to, from, next) => {
	try {
		const ownerStore = useOwnerStore()
		const { owner } = to.params
		if (owner && owner !== ownerStore.getOwner) {
			await ownerStore.apiGetOwnerInfo({ owner })
		}
		next()
	} catch (err) {
		next({ name: 'Error', query: { redirect: to.fullPath } })
	}
}

export default defineComponent({
	beforeRouteEnter: beforeRoute,
	beforeRouteUpdate: beforeRoute,
	beforeRouteLeave: async (to, from, next) => {
		try {
			const ownerStore = useOwnerStore()
			// await ownerStore.apiGetOwnerInfo()
			ownerStore.setOwnerInfo()
			next()
		} catch (err) {
			next({ name: 'Error', query: { redirect: to.fullPath } })
		}
	}
})
</script>

<style lang="less" scoped></style>
