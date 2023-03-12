/*
 * @Author: iuukai
 * @Date: 2023-01-08 00:52:53
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-09 09:23:30
 * @FilePath: \gitsub\src\utils\crypto.js
 * @Description:
 * @QQ/微信: 790331286
 */
import _Base64 from 'crypto-js/enc-base64'
import _encUTF8 from 'crypto-js/enc-utf8'
import _MD5 from 'crypto-js/md5'

export class Base64 {
	// 编码
	static enc(content) {
		return _Base64.stringify(_encUTF8.parse(content))
	}

	// 解码
	static dec(content) {
		try {
			// 普通文本
			return _Base64.parse(content.replaceAll('\n', '')).toString(_encUTF8)
		} catch (err) {
			// 无法解析为 utf8
			return _Base64.parse(content.replaceAll('\n', ''))
		}
	}
}

export class MD5 {
	static enc(content) {
		return _MD5(content).toString()
	}
}
