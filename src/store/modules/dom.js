/*
 * @Author: iuukai
 * @Date: 2023-01-31 16:23:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-02-19 06:33:01
 * @FilePath: \gitsub\src\store\modules\dom.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'

export const useDomStore = defineStore({
	id: 'dom',
	state: () => ({
		headerContainer: null,
		scrollContainer: null
	}),
	getters: {
		getHeaderContainer() {
			return this.headerContainer
		},
		getScrollContainer() {
			return this.scrollContainer
		}
	},
	actions: {
		setHeaderContainer(el) {
			this.headerContainer = el
		},
		setScrollContainer(el) {
			this.scrollContainer = el
		}
	}
})
