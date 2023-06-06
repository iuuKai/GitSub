<!--
 * @Author: iuukai
 * @Date: 2023-04-20 23:37:22
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-22 22:01:04
 * @FilePath: \gitsub\src\views\FullScreen\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div ref="containerRef" class="fullscreen_wrapper">
		<MarkDownPreview :isDark="isDark" :content="mdContent" @link-before="handleClickLink" />

		<BackTop :target="targetScroll" />
	</div>
</template>

<script setup>
import { h, ref, defineComponent, computed, onMounted } from 'vue'
import { BackTop, Modal } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { useDomStore } from '@/store/modules/dom'
import { useThemeStore } from '@/store/modules/theme'
import { unrefElement } from '@vueuse/core'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { MarkDownPreview } from '@/components/basic/markdown'

const mdContent = computed(() => localStorage.getItem('demo') || '')
const route = useRoute()
const domStore = useDomStore()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.getTheme === 'dark')
const containerRef = ref(null)
const targetScroll = () => unrefElement(containerRef)

onMounted(() => {
	const container = unrefElement(containerRef)
	domStore.setScrollContainer(container)
})

// md 链接
function handleClickLink(url) {
	// console.log(url)
	// console.log(route.path, window.parent.origin)
	// window.parent.postMessage(
	// 	{
	// 		origin: route.path,
	// 		routeName: route.name,
	// 		data: {
	// 			url
	// 		}
	// 	},
	// 	window.parent.origin
	// )
	if (!url || /^\/?#/.test(url)) return
	if (/^\.\.\/|^\.\//.test(url)) {
		const { path } = route.params
		const curPathList = (path || []).map(item => item)
		const targetPathList = url.split('/')
		const { countBySibling, countByParent } = targetPathList.reduce(
			(res, cur) => {
				cur == '.' ? res['countBySibling']++ : cur == '..' ? res['countByParent']++ : null
				return res
			},
			{ countBySibling: 0, countByParent: 0 }
		)

		const pathList = curPathList
			.slice(
				0,
				curPathList.length -
					1 -
					(countBySibling ? countBySibling : countByParent ? countByParent : 0)
			)
			.concat(targetPathList.filter(item => !['.', '..'].includes(item)))

		router.replace({
			...route,
			params: {
				...route.params,
				path: pathList
			},
			hash: ''
		})
	} else {
		Modal.confirm({
			title: 'Are you sure delete this task?',
			icon: h(ExclamationCircleOutlined),
			content: 'Some descriptions',
			getContainer: () => unrefElement(containerRef),
			okText: 'Yes',
			okType: 'danger',
			okButtonProps: {
				disabled: true
			},
			cancelText: 'No',
			onOk() {
				console.log('OK')
			},
			onCancel() {
				console.log('Cancel')
			}
		})
	}
}
</script>

<style lang="less" scoped>
.fullscreen_wrapper {
	@apply h-screen overflow-x-hidden overflow-y-auto;
}
</style>
