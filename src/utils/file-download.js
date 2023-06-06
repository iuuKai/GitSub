/*
 * @Author: iuukai
 * @Date: 2023-03-09 09:42:15
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-07 09:06:36
 * @FilePath: \gitsub\src\utils\file-download.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { saveAs } from 'file-saver'
import { Base64 } from './crypto'
// import JSZip from 'jszip'
import cryptoRandomString from 'crypto-random-string'

export function fileDownload(content, name) {
	const data = Base64.dec(content)
	let byteArray = null
	if (data?.words) {
		// 二进制内容
		byteArray = new Uint8Array(data.words.length * 4)
		data.words.forEach((word, i) => {
			byteArray[i * 4] = (word >> 24) & 0xff
			byteArray[i * 4 + 1] = (word >> 16) & 0xff
			byteArray[i * 4 + 2] = (word >> 8) & 0xff
			byteArray[i * 4 + 3] = word & 0xff
		})
	}

	const blob = new Blob([byteArray ?? data], {
		type: 'application/octet-stream'
	})
	const isHasName = /^[^.]/.test(name)
	const fileName = isHasName
		? name
		: `${cryptoRandomString({ length: 10, type: 'alphanumeric' }) + name}`
	saveAs(blob, fileName)
	return fileName
}
