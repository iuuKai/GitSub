/*
 * @Author: iuukai
 * @Date: 2022-10-23 05:03:27
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-23 05:03:28
 * @FilePath: \gitsub\src\hooks\useOnline.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { isBoolean } from 'lodash-es'

/**
 * @description 用户网络是否可用
 * */
export function useOnline() {
	const online = ref(true)

	const showStatus = val => {
		online.value = isBoolean(val) ? val : val.target.online
	}

	// 在页面加载后，设置正确的网络状态
	navigator.onLine ? showStatus(true) : showStatus(false)

	onMounted(() => {
		// 开始监听网络状态的变化
		window.addEventListener('online', showStatus)

		window.addEventListener('offline', showStatus)
	})
	onUnmounted(() => {
		// 移除监听网络状态的变化
		window.removeEventListener('online', showStatus)

		window.removeEventListener('offline', showStatus)
	})

	return { online }
}
