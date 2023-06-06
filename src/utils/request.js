/*
 * @Author: iuukai
 * @Date: 2022-10-24 09:46:45
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-07 14:16:31
 * @FilePath: \gitsub\src\utils\request.js
 * @Description:
 * @QQ/微信: 790331286
 */
import axios from 'axios'
import { useAccountStore } from '@/store/modules/account'
import { message as $message } from 'ant-design-vue'

const tkey = 'token'
const timeout = 5000
const UNKNOWN_ERROR = '未知错误，请重试'
const isLocalhost = location.hostname === 'localhost'

// 创建实例
const request = axios.create({
	// baseURL: import.meta.env.VITE_REQUEST_BUILD
	baseURL: isLocalhost ? import.meta.env.VITE_REQUEST_DEV : import.meta.env.VITE_REQUEST_BASEURL
	// timeout
})

// 请求拦截
request.interceptors.request.use(
	config => {
		const accountStore = useAccountStore()
		const type = accountStore.getType
		const token = accountStore.getToken
		token && (config.headers['Authorization'] = token)
		type && !/^http/.test(config.url) && (config.url = type + config.url)
		return config
	},
	error => {
		// $message.error(error.message)
		return Promise.reject(error)
	}
)

// 响应拦截
request.interceptors.response.use(
	response => {
		const { data, status } = response
		if (status !== 200 || data.error) {
			// $message.error(data.message || data.error_description || UNKNOWN_ERROR)
			return Promise.reject(new Error(data.message || data.error_description || UNKNOWN_ERROR))
		} else {
			return data
		}
	},
	error => {
		if (error?.response?.data) {
			const { code, data, msg } = error.response.data
			// Illegal token
			if (code === 401) {
				const accountStore = useAccountStore()
				accountStore.logout({ redirect: location.pathname })
				$message.error(msg || UNKNOWN_ERROR)
			}
		} else {
			// 超时
			if (error.code === 'ECONNABORTED') $message.error(error.code)
		}
		return Promise.reject(error)
	}
)

/**
 * 提供一个原 axios 实例，但需携带token
 */
const http = axios.create({ timeout })
// 请求拦截
http.interceptors.request.use(
	config => {
		const { params, data } = config
		if ((params && params[tkey]) || (data && data[tkey])) {
			// 解构出token参数
			config.headers['Authorization'] = params[tkey] ?? data[tkey]
			params && delete params[tkey]
			data && delete data[tkey]
		} else {
			// 从 store 里拿
			const accountStore = useAccountStore()
			const token = accountStore.getToken
			token && (config.headers['Authorization'] = token)
		}
		return config
	},
	error => {
		// $message.error(error.message)
		return Promise.reject(error)
	}
)
// 响应拦截
http.interceptors.response.use(
	response => response.data,
	error => Promise.reject(error)
)

export { request, http as $http, axios as $axios }
