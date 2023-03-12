/*
 * @Author: iuukai
 * @Date: 2022-10-26 21:54:26
 * @LastEditors: iuukai
 * @LastEditTime: 2023-02-02 07:08:46
 * @FilePath: \gitsub\src\store\modules\theme.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { useMutationObserver, useColorMode, usePreferredDark } from '@vueuse/core'
// import darkThemeCss from 'ant-design-vue/dist/antd.dark.less?inline'

// 本地 包300多kb
// const styleDom = document.createElement('style')
// styleDom.dataset.type = 'theme-dark'
// styleDom.textContent = darkThemeCss
// document.head.appendChild(styleDom)
// useMutationObserver(
// 	document.head,
// 	mutations => {
// 		const hasCustomStyleEl = mutations.some(n => Array.from(n.addedNodes).includes(styleDom))
// 		if (!hasCustomStyleEl) {
// 			document.head.appendChild(styleDom)
// 			styleDom.disabled = !document.documentElement.classList.contains('dark')
// 		}
// 	},
// 	{
// 		childList: true
// 	}
// )

// cdn
const stylesheets = document.head.querySelectorAll('link[rel="stylesheet"]')
const styleDom = Array.from(stylesheets).find(item => /antd.dark(\.min)?.css/.test(item.href))
useMutationObserver(
	document.documentElement,
	() => {
		// 监听 html 标签属性变更
		styleDom.disabled = !document.documentElement.classList.contains('dark')
	},
	{ attributes: true }
)

const theme = useColorMode({
	storageKey: '_G_THEME__'
})
const isDefaultDark = usePreferredDark()

export const useThemeStore = defineStore({
	id: 'theme',
	state: () => ({
		theme,
		isDefaultDark
	}),
	getters: {
		getTheme() {
			return this.theme !== 'auto' ? this.theme : this.isDefaultDark ? 'dark' : 'light'
		}
	},
	actions: {
		setTheme(_theme) {
			styleDom.disabled = _theme !== 'dark'
			this.theme = _theme
			theme.value = _theme
		}
	}
})
