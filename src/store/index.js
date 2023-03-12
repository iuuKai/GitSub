/*
 * @Author: iuukai
 * @Date: 2022-10-21 05:46:11
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-27 02:33:43
 * @FilePath: \gitsub\src\store\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { createPinia } from 'pinia'

const store = createPinia()

export function setupStore(app) {
	app.use(store)
}

export { store }
