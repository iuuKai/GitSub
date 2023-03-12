/*
 * @Author: iuukai
 * @Date: 2022-10-21 08:30:06
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-30 11:59:07
 * @FilePath: \gitsub\src\hooks\useEventbus.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { onUnmounted } from 'vue'
import mitt from 'mitt'

const emitter = mitt()

// 自定义触发器
const customEmit = (eventName, params) => {
	emitter.emit(eventName, params)
}

// 自定义接收器
const customOn = (eventName, callback) => {
	emitter.on(eventName, e => callback(e))
}

export const useEventbus = () => {
	onUnmounted(() => {
		emitter.all.clear()
	})
	return {
		customEmit,
		customOn
	}
}
