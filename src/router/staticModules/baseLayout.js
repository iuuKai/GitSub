/*
 * @Author: iuukai
 * @Date: 2022-12-14 16:57:55
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-06 16:01:38
 * @FilePath: \gitsub\src\router\staticModules\baseLayout.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defaultRoutePath, namedRouteName, namedRoutePath } from '../constant'
import { useAccountStore } from '@/store/modules/account'

const gitPage = {
	path: '/:type(github|gitee)',
	redirect: to => {
		const accountStore = useAccountStore()
		const type = accountStore.getType
		if (to.params['type'] !== type) {
			return '/error'
		} else {
			return '/'
		}
	},
	children: [
		{
			path: ':owner',
			name: namedRouteName,
			beforeEnter: (to, from, next) => {
				// 移除末尾斜杠
				if (/\/$/.test(to.fullPath)) next({ path: to.fullPath.replace(/\/$/, ''), replace: true })
				else next()
			},
			component: () => import('@/views/Home/index.vue')
		},
		{
			path: ':owner/:repo',
			name: 'Repo',
			beforeEnter: (to, from, next) => {
				// 移除末尾斜杠
				if (/\/$/.test(to.fullPath)) next({ path: to.fullPath.replace(/\/$/, ''), replace: true })
				else next()
			},
			component: () => import('@/views/Repo/index.vue'),
			children: [
				{
					path: '',
					name: 'Portal',
					component: () => import('@/views/Repo/pages/Portal.vue')
				},
				{
					path: 'commits/:branch?',
					name: 'Commits',
					component: () => import('@/views/Repo/pages/Commits.vue')
				},
				{
					path: 'tree/:branch/:path*',
					name: 'Tree',
					component: () => import('@/views/Repo/pages/Tree.vue')
				},
				{
					path: 'blob/:branch/:path+',
					name: 'Blob',
					component: () => import('@/views/Repo/pages/Blob.vue')
				}
			]
		}
		// {
		// 	path: ':owner/:repo/commits/:branch?',
		// 	name: 'Commits',
		// 	component: () => import('@/views/Commits/index.vue')
		// },
		// {
		// 	path: ':owner/:repo/tree/:branch/:path?',
		// 	name: 'Tree',
		// 	component: () => import('@/views/Tree/index.vue')
		// },
		// {
		// 	path: ':owner/:repo/blob/:branch/:path',
		// 	name: 'Blob',
		// 	component: () => import('@/views/Blob/index.vue')
		// }
	]
}

const aboutPage = {
	path: '/about',
	meta: {
		title: '关于'
	},
	component: () => import('@/views/About/index.vue')
}

const routes = [
	{
		path: defaultRoutePath,
		name: 'Layout',
		meta: {
			title: '首页'
		},
		redirect: to => {
			const accountStore = useAccountStore()
			const type = accountStore.getType
			const owner = accountStore.getLoginName
			return `/${type}/${owner}`
		},
		component: () => import('@/layouts/index.vue'),
		children: [gitPage, aboutPage]
	}
]

export default routes
