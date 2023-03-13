/*
 * @Author: iuukai
 * @Date: 2023-01-01 13:07:26
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-12 16:20:20
 * @FilePath: \gitsub\src\api\repo\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { request } from '@/utils/request'
import { isPlainObject } from 'lodash-es'

// 获取用户的某个仓库
export function getRepo(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库所有公开动态
export function getRepoNetworksEventList(params = {}) {
	const { owner, repo } = params
	const url = `/networks/${owner}/${repo}/events`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库具体路径下的内容
export function getRepoPathContentList(params = {}) {
	const { owner, repo, path } = params
	const url = `/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => {
		const data = isPlainObject(res.data) ? [res.data] : res.data
		// 排序
		return data.sort((a, b) => a.type.localeCompare(b.type))
	})
}

// 获取仓库目录Tree
export function getRepoTrees(params = {}) {
	const { owner, repo, sha } = params
	const url = `/repos/${owner}/${repo}/git/trees/${sha}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取文件Blob
export function getRepoBlobs(params = {}) {
	const { owner, repo, sha } = params
	const url = `/repos/${owner}/${repo}/git/blobs/${sha}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库README
export function getRepoReadme(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/readme`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库贡献者
export function getRepoContributorList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/contributors`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库所有成员
export function getRepoCollaboratorList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/collaborators`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库所有分支
export function getRepoBrancheList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/branches`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库所有tags
export function getRepoTagList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/tags`
	return request({
		url,
		method: 'get'
	}).then(res => res.data)
}

// 获取仓库所有提交
export function getRepoCommitList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/commits`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库某个提交
export function getRepoCommit(params = {}) {
	const { owner, repo, sha } = params
	const url = `/repos/${owner}/${repo}/commits/${sha}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 下载仓库
export function getRepoDownloadZIP(params = {}) {
	const { owner, repo, sha } = params
	const url = `/repos/${owner}/${repo}/zipball/${sha}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}