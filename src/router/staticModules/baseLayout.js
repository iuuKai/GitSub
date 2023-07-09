/*
 * @Author: iuukai
 * @Date: 2022-12-14 16:57:55
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-06 15:46:53
 * @FilePath: \gitsub\src\router\staticModules\baseLayout.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defaultRoutePath, namedRouteName, namedRoutePath } from '../constant'
import { useAccountStore } from '@/store/modules/account'
import { useOwnerStore } from '@/store/modules/owner'

const gitPage = [
	{
		path: '/:type(github|gitee)',
		redirect: '/'
	},
	{
		path: '/:type(github|gitee)/:owner',
		name: namedRouteName,
		// name: 'GitView',
		redirect: { name: 'Portal' },
		beforeEnter: (to, from, next) => {
			const {
				params: { type, owner }
			} = to
			const accountStore = useAccountStore()
			if (type === accountStore.getType) next(owner ? null : '/')
			else next({ name: 'Error', query: { redirect: to.fullPath } })
		},
		component: () => import('@/views/GitView/index.vue'),
		children: [
			{
				path: '',
				name: 'Portal',
				component: () => import('@/views/Home/index.vue')
			},
			{
				path: ':repo',
				name: 'Repo',
				component: () => import('@/views/Repo/index.vue'),
				children: [
					{
						path: ':contentType(tree|blob)?/:branch?/:path*',
						name: 'Content',
						// redirect: to => {
						// 	// { path: to.fullPath.replaceAll('%23', '#') }
						// 	console.log(to.fullPath, 777)
						// 	// return to.fullPath.replaceAll('%23', '#')
						// 	if (to.params.redirect && to.fullPath.indexOf('%23') > -1) {
						// 		return to.fullPath.replaceAll('%23', '#')
						// 	} else {
						// 		return to
						// 	}
						// },
						component: () => import('@/views/Repo/pages/Content.vue')
					},
					{
						path: 'edit/:branch?/:path*',
						name: 'Edit',
						component: () => import('@/views/Repo/pages/Edit.vue')
					},
					{
						path: 'issues/:number?',
						name: 'Issues',
						component: () => import('@/views/Repo/pages/Issues.vue')
					}
				]
			}
		]
	}
]

const aboutPage = {
	path: '/about',
	name: 'About',
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
			return { name: namedRouteName, params: { type, owner } }
		},
		beforeEnter: (to, from, next) => {
			// 移除末尾斜杠
			if (/\/$/.test(to.fullPath)) next({ path: to.fullPath.replace(/\/$/, '') })
			else next()
		},
		component: () => import('@/layouts/index.vue'),
		children: [...gitPage, aboutPage]
	}
]

export default routes
