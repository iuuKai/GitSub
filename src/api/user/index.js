/*
 * @Author: iuukai
 * @Date: 2022-11-04 13:16:40
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-05 05:32:50
 * @FilePath: \gitsub\src\api\user\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { request } from '@/utils/request'

// 获取用户信息
export function getUser(params = {}) {
	const { username } = params
	// username 有则为查询用户，无则为授权用户
	const url = username ? `/users/${username}` : '/user'
	!username && delete params.username
	return request({
		url,
		method: 'get'
	}).then(res => res.data)
}

// 获取组织所有仓库
export function getOrgRepoList(params = {}) {
	const { org } = params
	const url = `/orgs/${org}/repos`
	return request({
		url,
		method: 'get',
		params
	})
}

// 获取用户所有仓库
export function getRepoList(params = {}) {
	const { username } = params
	// username 有则为查询用户，无则为授权用户
	const url = username ? `/users/${username}/repos` : '/user/repos'
	!username && delete params.username
	return request({
		url,
		method: 'get',
		params
	})
}

// 获取用户star的仓库
export function getUserStarredRepoList(params = {}) {
	const { username } = params
	// username 有则为查询用户，无则为授权用户
	const url = username ? `/users/${username}/starred` : '/user/starred'
	return request({
		url,
		method: 'get',
		params
	})
}
