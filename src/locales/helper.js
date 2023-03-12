/*
 * @Author: iuukai
 * @Date: 2022-10-25 13:36:21
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-26 00:28:38
 * @FilePath: \gitsub\src\locales\helper.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { set } from 'lodash-es'

export const loadLocalePool = []

export function setHtmlPageLang(locale) {
	document.querySelector('html')?.setAttribute('lang', locale)
}

export function setLoadLocalePool(cb) {
	cb(loadLocalePool)
}

export function genMessage(langs, prefix = 'lang') {
	const obj = {}

	Object.keys(langs).forEach(key => {
		const langFileModule = langs[key].default ?? langs[key]
		let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
		const lastIndex = fileName.lastIndexOf('.')
		fileName = fileName.substring(0, lastIndex)
		const keyList = fileName.split('/')
		const moduleName = keyList.shift()
		const objKey = keyList.join('.')

		if (moduleName) {
			if (objKey) {
				set(obj, moduleName, obj[moduleName] || {})
				set(obj[moduleName], objKey, langFileModule)
			} else {
				set(obj, moduleName, langFileModule || {})
			}
		}
	})
	return obj
}
