/*
 * @Author: iuukai
 * @Date: 2022-12-13 18:05:30
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-14 23:40:44
 * @FilePath: \gitsub\src\router\generator-router.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { ErrorRoute, NotFound } from './staticModules/error'
import baseLayout from './staticModules/baseLayout'
import router, { routes } from '@/router'

// 需要放在所有路由之后的路由
const endRoutes = [ErrorRoute, NotFound]

/**
 * 登录后添加路由
 * @param
 * @returns
 */
export const generatorDynamicRouter = () => {
	const routeList = [...baseLayout, ...endRoutes]
	routeList.forEach(item => router.addRoute(item))
	return routeList
}
