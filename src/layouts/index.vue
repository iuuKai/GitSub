<!--
 * @Author: iuukai
 * @Date: 2022-10-21 06:35:12
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-22 05:53:06
 * @FilePath: \gitsub\src\layouts\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<Layout class="layout">
		<Layout.Content ref="containerRef" class="layout-content">
			<Affix :style="{ width: '100%' }" :offset-top="0" :target="targetScroll">
				<transition name="fade-page" mode="out-in" appear>
					<PageHeader ref="headerRef" />
				</transition>
			</Affix>
			<router-view class="content-view" v-slot="{ Component }">
				<transition name="fade-page" mode="out-in" appear>
					<component :is="Component" :key="route.path" />
				</transition>
			</router-view>
			<transition name="fade-page" mode="out-in" appear>
				<PageFooter :key="route.path" />
			</transition>
		</Layout.Content>
		<BackTop :target="targetScroll" />
	</Layout>
</template>

<script setup>
import { Layout, Affix, BackTop } from 'ant-design-vue'
import PageHeader from './header/index.vue'
import PageFooter from './footer/index.vue'

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { unrefElement, useScroll, useDebounceFn } from '@vueuse/core'
import { useDomStore } from '@/store/modules/dom'

const route = useRoute()
const domStore = useDomStore()
const headerRef = ref(null)
const containerRef = ref(null)
const targetScroll = () => unrefElement(containerRef)

const { y: scrollY } = useScroll(containerRef)

watch(
	scrollY,
	useDebounceFn(val => {
		domStore.setScrollY(val)
	})
)

watch(route, val => {
	console.log(2222, { ...val })
})

onMounted(() => {
	const header = unrefElement(headerRef)
	const container = unrefElement(containerRef)
	domStore.setHeaderContainer(header)
	domStore.setScrollContainer(container)
})

onUnmounted(() => {
	domStore.setHeaderContainer(null)
	domStore.setScrollContainer(null)
})
</script>

<style lang="less" scoped>
.layout {
	@apply h-screen overflow-hidden;

	.layout-content {
		@apply overflow-y-auto;

		.content-view {
			@apply m-auto px-4 py-6 max-w-1240px;
		}
	}
}
</style>
