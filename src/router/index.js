/*
 * @Author: iuukai
 * @Date: 2022-10-21 05:46:04
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-20 20:19:42
 * @FilePath: \gitsub\src\router\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './router-guards'
import outsideLayout from './outsideLayout'
import { whiteNameList } from './constant'

export const routes = [
	// Layout之外的路由
	...outsideLayout
]

export const router = createRouter({
	history: createWebHistory(''),
	routes
})

export function resetRouter() {
	router.getRoutes().forEach(route => {
		const { name } = route
		if (name && !whiteNameList.some(n => n === name)) {
			router.hasRoute(name) && router.removeRoute(name)
		}
	})
}

export async function setupRouter(app) {
	// 创建路由守卫
	createRouterGuards(router, whiteNameList)

	app.use(router)

	// 路由准备就绪后挂载APP实例
	await router.isReady()
}

export default router
