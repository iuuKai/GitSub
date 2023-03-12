/*
 * @Author: iuukai
 * @Date: 2022-10-23 05:02:56
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-23 05:02:56
 * @FilePath: \gitsub\src\hooks\useDomWidth.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'

/**
 * description: 获取页面宽度
 */

export function useDomWidth() {
	const domWidth = ref(window.innerWidth)

	function resize() {
		domWidth.value = document.body.clientWidth
	}

	onMounted(() => {
		window.addEventListener('resize', debounce(resize, 80))
	})
	onUnmounted(() => {
		window.removeEventListener('resize', resize)
	})

	return domWidth
}
