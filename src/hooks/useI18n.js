/*
 * @Author: iuukai
 * @Date: 2022-10-21 08:31:26
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-29 09:11:34
 * @FilePath: \gitsub\src\hooks\useI18n.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { i18n } from '@/locales'

function getKey(namespace, key) {
	if (!namespace) {
		return key
	}
	if (key.startsWith(namespace)) {
		return key
	}
	return `${namespace}.${key}`
}

export function useI18n(namespace) {
	const normalFn = {
		t: key => {
			return getKey(namespace, key)
		}
	}

	if (!i18n) {
		return normalFn
	}

	const { t } = i18n.global

	const tFn = (key, ...arg) => {
		if (!key) return ''
		if (!key.includes('.') && !namespace) return key
		return t(getKey(namespace, key), ...arg)
	}
	return Object.assign(i18n.global, { t: tFn })
}

/**
 * 国际化转换工具函数，主要用于处理动态路由的title
 * @param {string | Title18n} message message
 * @param isI18n  默认为true，获取对应的翻译文本,否则返回本身
 * @returns message
 */
export function transformI18n(message = '', isI18n = true) {
	console.log(typeof message)
	if (!message) {
		return ''
	}

	// 处理动态路由的title, 格式 {zh_CN:"",en_US:""}
	if (typeof message === 'object') {
		return message[i18n.global?.locale]
	}

	if (isI18n && typeof message === 'string') {
		return i18n.global.t(message)
	}
	return message
}

// 主要用于配合vscode i18nn ally插件的提示。此功能仅用于路由和菜单。请在其他地方使用 vue-i18n 的 useI18n
export const t = key => key
