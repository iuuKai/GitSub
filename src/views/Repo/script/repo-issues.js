/*
 * @Author: iuukai
 * @Date: 2023-07-08 08:55:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-09 19:41:12
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
		const { owner, repo } = params
		const list = await repoStore.apiGetRepoIssueList({ owner, repo, state: 'all' })
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
			repoStore.apiGetRepoIssueCommentList({ owner, repo, number, page: 1, per_page: 100 })
		])
	} catch (err) {
		return { err, msg: '获取仓库所有Issues失败' }
	}
}
