/*
 * @Author: iuukai
 * @Date: 2022-11-13 06:16:48
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-05 01:45:02
 * @FilePath: \gitsub\src\store\modules\account.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { isNil } from 'lodash-es'
import { useStorage } from '@vueuse/core'
import { getOauthLink, getToken } from '@/api/login'
import { getUser } from '@/api/user'
import { generatorDynamicRouter } from '@/router/generator-router'

const UNKNOWN_ERROR = '未知错误，请重试'

const type = useStorage('_G_TYPE__', null)
const token = useStorage('_G_TOKEN__', null)
const redirect = useStorage('_G_REDIRECT__', null)
const refresh = useStorage('_G_REFRESH__', null, undefined, {
	serializer: {
		read: v => (v ? JSON.parse(v) : null),
		write: v => JSON.stringify(v)
	}
})
const userInfo = useStorage('_G_USERINFO__', null, undefined, {
	serializer: {
		read: v => (v ? JSON.parse(v) : null),
		write: v => JSON.stringify(v)
	}
})

export const useAccountStore = defineStore({
	id: 'account',
	state: () => ({
		token,
		type,
		code: '',
		userInfo,
		refresh,
		// 前往授权页面会重置路由，所以需缓存重定向路由
		redirect,
		menus: []
	}),
	getters: {
		getType() {
			return this.type
		},
		getCode() {
			return this.code
		},
		getToken() {
			return !this.token ? null : /^Bearer/i.test(this.token) ? this.token : `Bearer ${this.token}`
		},
		getTokenValid() {
			return !isNil(this.token)
		},
		getUserInfo() {
			return this.userInfo ?? {}
		},
		getAvatar() {
			return this.getUserInfo.avatar_url
		},
		getLoginName() {
			return this.getUserInfo.login
		},
		getRedirect() {
			return this.redirect
		}
	},
	actions: {
		resetToken() {
			this.token = null
			this.avatar = ''
			this.refresh = null
			this.userInfo = null
			// this.redirect = null
		},
		setType(_type) {
			this.type = _type
		},
		setCode(_code) {
			this.code = _code
		},
		setToken(_token) {
			this.token = _token
		},
		setRedirect(_path) {
			this.redirect = _path
		},
		// 登录
		async login(isLogin, params) {
			try {
				const type = this.getType
				// 前往授权，非令牌登录
				if (!isLogin) {
					if (!this.getCode) {
						delete params.token
						// 无code则拿到回调地址访问获取
						const { url } = await getOauthLink(params)
						// 获取 code
						location.href = url
					} else {
						// 有code则参数附带
						params.code = this.getCode
						const { access_token, refresh_token, created_at, expires_in, token_type } =
							await getToken(params)
						// 拿到token携带上，继续下一步登录操作
						params.token = access_token

						// 仅 Gitee 有 refresh_token
						if (refresh_token) {
							this.refresh = {
								refresh_token,
								expired: (created_at + expires_in) * 1000
							}
						}
					}
				}
				// 无token则不可继续进行登录操作
				if (!params.token) return
				// 设置token
				this.setToken(params.token)

				return this.afterLogin()
			} catch (err) {
				// 拿到 token 但获取用户信息失败
				if (!this.avatar) this.setToken(null)
				return Promise.reject(err.message || UNKNOWN_ERROR)
			}
		},
		async afterLogin() {
			try {
				if (Object.keys(this.getUserInfo).length === 0) {
					const userInfo = await getUser(this.getType)
					this.userInfo = userInfo
				}
				const generatorResult = generatorDynamicRouter()
				this.menus = generatorResult
				return Promise.resolve(true)
			} catch (err) {
				return Promise.reject(err)
			}
		},
		// 登出
		async logout({ redirect }) {
			this.setRedirect(redirect)
			this.resetToken()
			resetRouter()
		}
	}
})
