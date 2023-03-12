/*
 * @Author: iuukai
 * @Date: 2022-12-10 22:20:19
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-14 15:56:08
 * @FilePath: \gitsub\src\router\staticModules\error.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { PAGE_NOT_FOUND_NAME } from '@/router/constant'
import ErrorView from '@/views/Error/index.vue'

const moduleName = 'Error'

export const NotFound = {
	// path: '/:pathMatch(.*)*',
	path: '/:catchAll(.*)',
	name: 'NotFound',
	meta: {
		title: 'NotFound'
	},
	redirect: '/error/404',
	component: () => import('@/views/Error/404.vue'),
	children: []
}

export const ErrorRoute = {
	path: '/error',
	name: moduleName,
	redirect: '/error/404',
	component: ErrorView,
	meta: {
		title: '错误页'
	},
	children: [
		{
			path: '404',
			name: PAGE_NOT_FOUND_NAME,
			meta: {
				title: '404'
			},
			component: () => import('@/views/Error/404.vue')
		}
	]
}

export default [ErrorRoute, NotFound]
