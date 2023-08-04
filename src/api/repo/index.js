/*
 * @Author: iuukai
 * @Date: 2023-01-01 13:07:26
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-13 18:52:47
 * @FilePath: \gitsub\src\api\repo\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { request } from '@/utils/request'

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

// 获取仓库所有动态
export function getRepoEventList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/events`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库具体路径下的内容
export function getRepoPathContents(params = {}) {
	const { owner, repo, path } = params
	const url = `/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库语言列表(gitee 没有)
export function getRepoLanguageList(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/languages`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
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
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库所有提交
export function getRepoCommitList(params = {}, isAll = false) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/commits`
	return request({
		url,
		method: 'get',
		params
	}).then(res => (isAll ? res : res.data))
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

// 获取仓库所有发行版
export function getRepoReleaseList(params = {}, isAll = false) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/releases`
	return request({
		url,
		method: 'get',
		params
	}).then(res => (isAll ? res : res.data))
}

// 获取仓库最新的发行版
export function getRepoLatestRelease(params = {}) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/releases/latest`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库的所有Issues
export function getRepoIssueList(params = {}, isAll = false) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/issues`
	return request({
		url,
		method: 'get',
		params
	}).then(res => (isAll ? res : res.data))
}

// 获取仓库的某个Issue
export function getRepoIssue(params = {}) {
	const { owner, repo, number } = params
	const url = `/repos/${owner}/${repo}/issues/${number}`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取仓库某个Issue所有的评论
export function getRepoIssueCommentList(params = {}) {
	const { owner, repo, number } = params
	const url = `/repos/${owner}/${repo}/issues/${number}/comments`
	return request({
		url,
		method: 'get',
		params
	}).then(res => res.data)
}

// 获取Pull Request列表
export function getRepoPullRequestList(params = {}, isAll = false) {
	const { owner, repo } = params
	const url = `/repos/${owner}/${repo}/pulls`
	return request({
		url,
		method: 'get',
		params
	}).then(res => (isAll ? res : res.data))
}
