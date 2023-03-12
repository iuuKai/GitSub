/*
 * @Author: iuukai
 * @Date: 2022-10-21 06:49:36
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-13 17:10:15
 * @FilePath: \gitsub\src\router\outsideLayout.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { LOGIN_NAME } from '@/router/constant'

/**
 * layout布局之外的路由
 */
export const LoginRoute = {
	path: '/login',
	name: LOGIN_NAME,
	component: () => import('@/views/Login/index.vue'),
	meta: {
		title: '登录'
	}
}

export default [LoginRoute]
