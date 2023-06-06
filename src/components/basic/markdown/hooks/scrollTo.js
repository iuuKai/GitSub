/*
 * @Author: iuukai
 * @Date: 2023-04-20 04:07:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-20 04:18:39
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\scrollTo.js
 * @Description:
 * @QQ/微信: 790331286
 */
import raf from './raf'
import getScroll, { isWindow } from './getScroll'
import { easeInOutCubic } from './easings'

export default function scrollTo(y, options = {}) {
	const { getContainer = () => window, callback, duration = 450 } = options
	const container = getContainer()
	const scrollTop = getScroll(container, true)
	const startTime = Date.now()

	const frameFunc = () => {
		const timestamp = Date.now()
		const time = timestamp - startTime
		const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
		if (isWindow(container)) {
			container.scrollTo(window.pageXOffset, nextScrollTop)
		} else if (container instanceof Document) {
			container.documentElement.scrollTop = nextScrollTop
		} else {
			container.scrollTop = nextScrollTop
		}
		if (time < duration) {
			raf(frameFunc)
		} else if (typeof callback === 'function') {
			callback()
		}
	}
	raf(frameFunc)
}
