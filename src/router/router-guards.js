/*
 * @Author: iuukai
 * @Date: 2022-10-21 06:36:35
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-05 10:25:17
 * @FilePath: \gitsub\src\router\router-guards.js
 * @Description:
 * @QQ/微信: 790331286
 */
import NProgress from 'nprogress' // progress bar
import { isNavigationFailure } from 'vue-router'
import { useAccountStore } from '@/store/modules/account'
import { defaultRoutePath, namedRouteParam, LOGIN_NAME, namedRouteName } from './constant'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

export function createRouterGuards(router, whiteNameList) {
	router.beforeEach(async (to, from, next) => {
		const accountStore = useAccountStore()
		const token = accountStore.getToken

		// 锚点不进行操作
		if (token && to.path === from.path && to.path !== defaultRoutePath) return next()

		NProgress.start() // start progress bar

		if (token) {
			if (to.name === LOGIN_NAME) {
				next(defaultRoutePath)
			} else {
				const hasRoute = router.hasRoute(to.name)
				if (accountStore.menus.length === 0) {
					await accountStore.afterLogin()
					if (!hasRoute) {
						// 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
						next({ ...to, replace: true })
					} else {
						next()
					}
				} else {
					next()
				}
			}
		} else {
			// not login
			if (whiteNameList.some(n => n === to.name)) {
				// 在免登录名单，直接进入
				next()
			} else {
				const query = to.fullPath !== defaultRoutePath ? { redirect: to.fullPath } : null
				next({ name: LOGIN_NAME, query, replace: true })
			}
		}
	})

	/** 获取路由对应的组件名称 */
	// const getComponentName = route => {
	// 	return route.matched.find(item => item.name === route.name)?.components?.default.name
	// }

	router.afterEach((to, from, failure) => {
		if (to.fullPath === from.fullPath) return
		// const keepAliveStore = useKeepAliveStore()
		// const token = Storage.get(ACCESS_TOKEN_KEY, null)
		if (isNavigationFailure(failure)) {
			console.error('failed navigation', failure)
		}
		// // 在这里设置需要缓存的组件名称
		// const toCompName = getComponentName(to)
		// // 判断当前页面是否开启缓存，如果开启，则将当前页面的 componentName 信息存入 keep-alive 全局状态
		// if (to.meta?.keepAlive) {
		// 	// 需要缓存的组件
		// 	if (toCompName) {
		// 		keepAliveStore.add(toCompName)
		// 	} else {
		// 		console.warn(
		// 			`${to.fullPath}页面组件的keepAlive为true但未设置组件名，会导致缓存失效，请检查`
		// 		)
		// 	}
		// } else {
		// 	// 不需要缓存的组件
		// 	if (toCompName) {
		// 		keepAliveStore.remove(toCompName)
		// 	}
		// }
		// // 如果进入的是 Redirect 页面，则也将离开页面的缓存清空(刷新页面的操作)
		// if (to.name === REDIRECT_NAME) {
		// 	const fromCompName = getComponentName(from)
		// 	fromCompName && keepAliveStore.remove(fromCompName)
		// }
		// // 如果用户已登出，则清空所有缓存的组件
		// if (!token) {
		// 	keepAliveStore.clear()
		// }
		NProgress.done() // finish progress bar
	})

	router.onError(error => {
		console.log(error, '路由错误')
	})
}
