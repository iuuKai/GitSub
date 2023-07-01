/*
 * @Author: iuukai
 * @Date: 2023-06-24 02:39:46
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-30 12:33:25
 * @FilePath: \gitsub\src\views\Repo\script\repo-index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { useRepoStore } from '@/store/modules/repo'
import colors from '@/utils/colors.json'
import { isArray, isEmpty, toNumber, sum, round } from 'lodash-es'

const repoStore = useRepoStore()

function routerCatchNext(type, data, msg) {
	return {
		type,
		data,
		msg
	}
}

// 仓库详情
export const repoDetails = async (to = {}) => {
	try {
		// const repoStore = useRepoStore()
		const { owner, repo } = to.params
		if (repo && repo !== repoStore.getRepoName) {
			// 仓库详情信息
			const details = await repoStore.apiGetRepo({ owner, repo })
			// await repoStore.setDetails(details)
			repoStore.setRepoState('details', details)
		}
	} catch (err) {
		// return { err, msg: '获取仓库详情失败' }
		return routerCatchNext(null, err, '获取仓库详情失败')
	}
}

// 仓库内容（文件列表或者文件内容）
export const repoContents = async (to = {}) => {
	try {
		// const repoStore = useRepoStore()
		const cachePath = repoStore.getPath
		const { owner, repo, path, contentType, branch } = to.params
		const params = {
			owner,
			repo,
			path: isArray(path) ? path.join('/') : ''
		}
		const p = Object.values(params).join('/')
		if (to.name !== 'Content' || cachePath === p) return
		if (branch) params.ref = branch
		// 仓库内容
		const contents = await repoStore.apiGetRepoPathContents(params)
		if (isArray(contents)) contents.sort((a, b) => a.type.localeCompare(b.type))
		if (isArray(contents) && !contents.length) throw new Error('404')
		const curType = isArray(contents) ? 'tree' : 'blob'
		// await repoStore.setPath(p)
		// await repoStore.setContents(contents)
		repoStore.setRepoState('path', path)
		repoStore.setRepoState('contents', contents)
		if (contentType && contentType !== curType)
			return routerCatchNext('replace', {
				...to,
				params: {
					...to.params,
					contentType: curType
				}
			})
	} catch (err) {
		console.log(err, 444)
		// return { err, msg: '获取仓库内容失败', type: 'null' }
		return routerCatchNext('404', err, '获取仓库内容失败')
	}
}

// 当前路径的提交
export const curPathCommit = async (to = {}) => {
	try {
		// const repoStore = useRepoStore()
		const { owner, repo, path } = to.params
		const {
			data: [curCommit],
			meta
		} = await repoStore.apiGetRepoCommitList(
			{
				owner,
				repo,
				path: isArray(path) ? path.join('/') : '',
				per_page: '1'
			},
			true
		)
		const total = meta.total_count || meta.last.page
		// await repoStore.setCurPathCommit(curCommit, String(path) ? 0 : total)
		repoStore.setRepoState('curPathCommit', {
			...curCommit,
			total: String(path) ? 0 : total
		})
	} catch (err) {
		// return { err, msg: '获取当前路径commit失败' }
		return routerCatchNext(null, err, '获取当前路径commit失败')
	}
}

// 仓库动态
export const repoEvents = async (to = {}, params = {}) => {
	try {
		const { owner, repo } = to.params
		const res = await repoStore.apiGetRepoEventList({
			owner,
			repo,
			...params
		})
		console.log(res)
		repoStore.setRepoState('events', res)
	} catch (err) {
		// return { err, msg: '获取仓库动态失败' }
		return routerCatchNext(null, err, '获取仓库动态失败')
	}
}

// 仓库贡献者
export const repoContributors = async (to = {}, params = {}) => {
	try {
		const { owner, repo } = to.params
		const res = await repoStore.apiGetRepoContributorList({
			owner,
			repo,
			type: 'authors',
			page: 1,
			per_page: 10
		})
		console.log(res)
		repoStore.setRepoState('contributors', res)
	} catch (err) {
		// return { err, msg: '获取仓库贡献者失败' }
		return routerCatchNext(null, err, '获取仓库贡献者失败')
	}
}

// 仓库发行版
export const repoReleases = async (to = {}, params = {}) => {
	try {
		const { owner, repo } = to.params
		const { data, meta } = await repoStore.apiGetRepoReleases(
			{
				owner,
				repo,
				...params
			},
			true
		)
		console.log(meta)
		const total = meta.total_count || meta.last?.page || data.length
		repoStore.setRepoState('releases', data)
		if ((meta.last && toNumber(meta.last.per_page) === 1) || !data.length)
			repoStore.setRepoState('releasesTotal', toNumber(total))
	} catch (err) {
		// return { err, msg: '获取仓库所有发行版失败' }
		return routerCatchNext(null, err, '获取仓库所有发行版失败')
	}
}

// 仓库语言(gitee 无)
export const repoLanguages = async (to = {}, params = {}) => {
	try {
		const { owner, repo, type } = to.params
		if (type === 'gitee') return
		const res = await repoStore.apiGetRepoLanguageList({ owner, repo })

		const valyeSum = sum(Object.values(res))
		const languages = Object.keys(res).map(k => ({
			label: k,
			value: res[k],
			ratio: round((res[k] / valyeSum) * 100, 1).toFixed(1) + '%',
			color: colors[k]?.color || ''
		}))
		repoStore.setRepoState('languages', languages)
	} catch (err) {
		// return { err, msg: '获取仓仓库语言失败' }
		return routerCatchNext(null, err, '获取仓库语言失败')
	}
}

export default function (to) {
	const list = [
		{ task: repoDetails, isTaskAtHome: false },
		{ task: repoContents, isTaskAtHome: false },
		{ task: curPathCommit, isTaskAtHome: true },
		{
			task: repoEvents,
			isTaskAtHome: true,
			params: {
				limit: 100
			}
		},
		{ task: repoContributors, isTaskAtHome: true },
		{
			task: repoReleases,
			isTaskAtHome: true,
			params: {
				page: 1,
				per_page: 1
			}
		},
		{
			task: repoLanguages,
			isTaskAtHome: true
		}
	]
	const { path } = to.params
	const isHome = isEmpty(path)
	return list
		.map(
			item => (!item.isTaskAtHome || (item.isTaskAtHome && isHome)) && item.task(to, item.params)
		)
		.filter(Boolean)
}
