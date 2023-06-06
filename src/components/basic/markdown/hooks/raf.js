/*
 * @Author: iuukai
 * @Date: 2023-04-20 04:07:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-20 04:19:45
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\raf.js
 * @Description:
 * @QQ/微信: 790331286
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

export default function wrapperRaf(callback, times = 1) {
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
