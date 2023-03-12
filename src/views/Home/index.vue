<!--
 * @Author: iuukai
 * @Date: 2022-11-10 13:24:27
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-03 15:33:41
 * @FilePath: \gitsub\src\views\Home\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<transition name="fade" mode="out-in">
		<!-- key 标识触发组件响应更新 -->
		<div class="home_wrapper" :key="route.params.owner">
			<a-row :gutter="16">
				<a-col :span="18">
					<a-space direction="vertical" style="width: 100%" :size="15">
						<a-affix :offset-top="80" :target="targetScroll">
							<NavBar v-model:active="curTabIndex" />
						</a-affix>
						<transition name="fade" mode="out-in">
							<component
								:is="tabs[curTabIndex].component"
								:key="tabs[curTabIndex].model"
							></component>
						</transition>
					</a-space>
				</a-col>
				<a-col :span="6">
					<a-space direction="vertical" style="width: 100%" :size="15">
						<SearchBar />
						<a-affix :offset-top="80" :target="targetScroll">
							<OwnerProfile />
						</a-affix>
					</a-space>
				</a-col>
			</a-row>
		</div>
	</transition>
</template>

<script setup>
import { SearchBar, NavBar, OwnerProfile } from './components'

import { computed, watch } from 'vue'
import { tabs } from './Tabs'
import { useRoute } from 'vue-router'
import { useUrlSearchParams } from '@vueuse/core'
import { useDomStore } from '@/store/modules/dom'

const route = useRoute()
const domStore = useDomStore()
// const router = useRouter()
const query = useUrlSearchParams('history')

const curTabIndex = computed({
	get() {
		const index = tabs.findIndex(item => item.model === query.tab)
		// const index = tabs.findIndex(item => item.model === (route.query.tab ?? 'repositories'))
		return index > -1 ? index : 0
	},
	set(val) {
		query.tab = val ? tabs[val].model : null
		// 避免残留其他页面参数
		Object.keys(query).forEach(k => k !== 'tab' && (query[k] = null))

		// router.replace({ query: { tab: tabs[val ?? 0].model } })
	}
})
const targetScroll = computed(() => () => domStore.getScrollContainer)

// 当回到主页时，初始当前下标
watch(route, val => {
	!val.query.tab && (curTabIndex.value = 0)
})
</script>

<style lang="less" scoped></style>
