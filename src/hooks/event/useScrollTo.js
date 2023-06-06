/*
 * @Author: iuukai
 * @Date: 2023-04-20 04:07:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-20 06:55:22
 * @FilePath: \gitsub\src\hooks\event\useScrollTo.js
 * @Description:
 * @QQ/微信: 790331286
 */
/**
 * raf
 */
let raf = callback => setTimeout(callback, 16)
let caf = num => clearTimeout(num)

if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
	raf = callback => window.requestAnimationFrame(callback)
	caf = handle => window.cancelAnimationFrame(handle)
}

let rafUUID = 0
const rafIds = new Map()

function cleanup(id) {
	rafIds.delete(id)
}

function wrapperRaf(callback, times = 1) {
	rafUUID += 1
	const id = rafUUID

	function callRef(leftTimes) {
		if (leftTimes === 0) {
			// Clean up
			cleanup(id)

			// Trigger
			callback()
		} else {
			// Next raf
			const realId = raf(() => {
				callRef(leftTimes - 1)
			})

			// Bind real raf id
			rafIds.set(id, realId)
		}
	}

	callRef(times)

	return id
}

wrapperRaf.cancel = id => {
	const realId = rafIds.get(id)
	cleanup(realId)
	return caf(realId)
}
/** end **/

/**
 * getScroll
 */
export function isWindow(obj) {
	return obj !== null && obj !== undefined && obj === obj.window
}

export function getScroll(target, top) {
	if (typeof window === 'undefined') {
		return 0
	}
	const method = top ? 'scrollTop' : 'scrollLeft'
	let result = 0
	if (isWindow(target)) {
		result = target[top ? 'pageYOffset' : 'pageXOffset']
	} else if (target instanceof Document) {
		result = target.documentElement[method]
	} else if (target) {
		result = target[method]
	}
	if (target && !isWindow(target) && typeof result !== 'number') {
		result = (target.ownerDocument || target).documentElement?.[method]
	}
	return result
}
/** end **/

/**
 * easeInOutCubic
 */
export function easeInOutCubic(t, b, c, d) {
	const cc = c - b
	t /= d / 2
	if (t < 1) {
		return (cc / 2) * t * t * t + b
	}
	return (cc / 2) * ((t -= 2) * t * t + 2) + b
}
/** end **/

/**
 * useScrollTo
 */
export function useScrollTo(y, options = {}) {
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
			wrapperRaf(frameFunc)
		} else if (typeof callback === 'function') {
			callback()
		}
	}
	wrapperRaf(frameFunc)
}
/** end **/
