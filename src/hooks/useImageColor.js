/*
 * @Author: iuukai
 * @Date: 2022-10-29 08:56:57
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-30 01:18:53
 * @FilePath: \gitsub\src\hooks\useImageColor.js
 * @Description:
 * @QQ/微信: 790331286
 */
function getImageColor($imgEl, $imgElwidth = 10, $imgElheight = 10) {
	const canvas = document.createElement('canvas')
	canvas.width = $imgElwidth
	canvas.height = $imgElheight

	const context = canvas.getContext('2d')
	$imgEl.crossOrigin = 'Anonymous'
	context.drawImage($imgEl, 0, 0, canvas.width, canvas.height)

	// 获取像素数据
	const data = context.getImageData(0, 0, $imgElwidth, $imgElheight).data

	let r = 1,
		g = 1,
		b = 1
	// 取所有像素的平均值
	for (var row = 0; row < $imgElheight; row++) {
		for (var col = 0; col < $imgElwidth; col++) {
			if (row == 0) {
				r += data[$imgElwidth * row + col]
				g += data[$imgElwidth * row + col + 1]
				b += data[$imgElwidth * row + col + 2]
			} else {
				r += data[($imgElwidth * row + col) * 4]
				g += data[($imgElwidth * row + col) * 4 + 1]
				b += data[($imgElwidth * row + col) * 4 + 2]
			}
		}
	}

	// 求取平均值
	r /= $imgElwidth * $imgElheight
	g /= $imgElwidth * $imgElheight
	b /= $imgElwidth * $imgElheight

	// 将最终的值取整
	r = Math.round(r)
	g = Math.round(g)
	b = Math.round(b)

	return [r, g, b]
}

// https://github.com/EastDesire/jscolor/blob/da93f238aead3e07409bea97083b03763cdbc5d8/jscolor.js#L2099
function isLight(r, g, b) {
	const toGrayscale = 0.213 * r + 0.715 * g + 0.072 * b
	return toGrayscale > 255 / 2
}

export function useImageColor() {
	return {
		getImageColor,
		isLight
	}
}
