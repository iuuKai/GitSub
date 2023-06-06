/*
 * @Author: iuukai
 * @Date: 2023-01-31 16:23:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-22 05:38:34
 * @FilePath: \gitsub\src\store\modules\dom.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'

export const useDomStore = defineStore({
	id: 'dom',
	state: () => ({
		headerContainer: null,
		scrollContainer: null,
		scrollX: 0,
		scrollY: 0
	}),
	getters: {
		getHeaderContainer() {
			return this.headerContainer
		},
		getScrollContainer() {
			return this.scrollContainer
		},
		getScroll() {
			return { x: this.scrollX, y: this.scrollY }
		}
	},
	actions: {
		setHeaderContainer(el) {
			this.headerContainer = el
		},
		setScrollContainer(el) {
			this.scrollContainer = el
		},
		setScrollX(x) {
			this.scrollX = x
		},
		setScrollY(y) {
			this.scrollY = y
		}
	}
})
