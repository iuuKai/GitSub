/*
 * @Author: iuukai
 * @Date: 2023-07-08 08:55:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-10 19:53:33
 * @FilePath: \gitsub\src\views\Repo\script\repo-issues.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { useRepoStore } from '@/store/modules/repo'
import colors from '@/utils/colors.json'
import { Base64 } from '@/utils/crypto'
import { isArray, isEmpty, toNumber, sum, round } from 'lodash-es'

const repoStore = useRepoStore()

// 仓库所有 Issues
export const getRepoIssues = async (params = {}) => {
	try {
		const list = await repoStore.apiGetRepoIssueList(params)
		return list.map(item => ({
			...item,
			task: item.body?.match(/-\s\[(\s|x)\]/g)?.length || 0
		}))
	} catch (err) {
		return { err, msg: '获取仓库所有Issues失败' }
	}
}

// 仓库 Issues 所有评论
export const getRepoIssueComments = async (params = {}) => {
	try {
		const { owner, repo, number } = params
		return await Promise.all([
			repoStore.apiGetRepoIssue({ owner, repo, number }),
			repoStore.apiGetRepoIssueCommentList(params)
		])
	} catch (err) {
		return { err, msg: '获取仓库所有Issues失败' }
	}
}
