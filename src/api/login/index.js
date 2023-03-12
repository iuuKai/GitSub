/*
 * @Author: iuukai
 * @Date: 2022-11-03 02:53:14
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-04 03:26:28
 * @FilePath: \gitsub\src\api\login\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { request } from '@/utils/request'

// 获取必应每日一图
export function getFullBanner() {
	const url = 'https://api.xygeng.cn/Bing'
	return request({
		url,
		method: 'get'
	}).then(res => res.data)
}

// 获取授权连接
export function getOauthLink(params = {}) {
	const url = '/oauth/authorize'
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取token
export function getToken(params = {}) {
	const url = '/oauth/access_token'
	return request({
		url,
		method: 'post',
		data: params
	}).then(res => res.data)
}
