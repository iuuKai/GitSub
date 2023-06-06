/*
 * @Author: iuukai
 * @Date: 2022-11-03 03:03:28
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-17 14:45:06
 * @FilePath: \gitsub\src\store\modules\owner.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import { getUser, getOrgRepoList, getRepoList, getUserStarredRepoList } from '@/api/user'
import { getRepo, getRepoLanguageList } from '@/api/repo'
import { getOrg } from '@/api/org'
import { toLower } from 'lodash-es'
import { to as _to } from '@/utils/awaitTo'
import colors from '@/utils/colors.json'

const UNKNOWN_ERROR = '未知错误，请重试'

export const useOwnerStore = defineStore({
	id: 'owner',
	state: () => ({
		// owner: '',
		ownerInfo: null,
		reposTotal: 0,
		starsTotal: 0
	}),
	getters: {
		// 是否个人用户还是组织
		isUser() {
			return this.ownerInfo?.type === 'User'
		},
		isGitHub() {
			const { getType } = useAccountStore()
			return getType === 'github'
		},
		getReposTotal() {
			return this.reposTotal / 1
		},
		getStarsTotal() {
			return this.starsTotal / 1
		},
		getOwner() {
			return this.ownerInfo?.login || ''
		},
		getOwnerInfo() {
			return this.ownerInfo
		}
	},
	actions: {
		setOwnerInfo(_info = null) {
			this.ownerInfo = _info
		},
		async apiGetOwnerInfo(params = {}) {
			try {
				const {
					getType: type,
					getLoginName: login,
					getUserInfo: accountUserInfo
				} = useAccountStore()
				const { owner } = params

				const isAuthUser = !owner || toLower(owner) === toLower(login)
				/**
				 * 获取 ownerInfo
				 */
				if (isAuthUser || !owner) {
					this.setOwnerInfo(accountUserInfo)
				} else {
					const list = [
						{ method: getOrg, key: 'org' },
						{ method: getUser, key: 'username' }
					]
					const promiseList = list.map(item =>
						item.method({ [item.key]: owner }).catch(() => Promise.resolve(null))
					)
					const [ownerInfo] = (await Promise.all(promiseList)).filter(Boolean)
					this.setOwnerInfo(ownerInfo)
				}

				if (!owner) return

				if (type === 'github') {
					this.reposTotal =
						this.getOwnerInfo['public_repos'] + (this.getOwnerInfo['total_private_repos'] ?? 0)
					if (this.isUser) {
						const { meta, data } = await getUserStarredRepoList({
							per_page: 1,
							username: !isAuthUser ? owner : ''
						})
						// 0、1 时，无 last
						this.starsTotal = meta?.['last']?.['page'] ?? data.length
					}
				} else {
					const params = {
						// 因为 gitee 的 total 在 headers，所以只需获取一条数据触发请求即可
						per_page: 1,
						// 当前授权用户空参
						[this.isUser ? 'username' : 'org']: !isAuthUser ? owner : ''
					}

					// 组织、用户的区分
					const { meta, data } = await (this.isUser ? getRepoList : getOrgRepoList)(params)
					this.reposTotal = meta?.['total_count'] ?? data.length

					this.isUser && (this.starsTotal = this.getOwnerInfo['stared'])
				}
			} catch (err) {
				console.log(err, 'err')
				return Promise.reject(err.message || UNKNOWN_ERROR)
			}
		},
		// 获取仓库列表
		async apiGetRepoList(params = {}) {
			try {
				const { getType: type, getLoginName: login } = useAccountStore()
				// 是否用户还是组织
				const isUser = this.isUser
				const owner = this.getOwner
				// 是否当前授权用户
				const isAuthUser = !owner || toLower(owner) === toLower(login)

				const { data } = await (isUser ? getRepoList : getOrgRepoList)({
					// 当前授权用户空参
					[isUser ? 'username' : 'org']: !isAuthUser ? owner : '',
					...params
				})

				// 获取 languages、fork
				if (type === 'github') {
					const list = data.reduce((res, cur) => {
						// 获取 parent
						if (cur.fork) {
							const [owner, repo] = cur.full_name.split('/')
							res.push(this.insertParentAndLanguage({ owner, repo }, cur))
						}
						return res
					}, [])
					// 并发执行 promise 集合
					await Promise.all(list)
				}

				return Promise.resolve(data)
			} catch (err) {
				return Promise.reject(err)
			}
		},
		// 获取用户star的仓库
		apiGetUserStarredRepoList(params = {}) {
			if (!this.isUser) return
			if (!this.isAuthUser) params.username = this.getOwner
			return getUserStarredRepoList(params).then(res => res.data)
		},
		// 为原数据插入 parent 和 language
		async insertParentAndLanguage(params = {}, raw = {}) {
			try {
				const info = await getRepo(params)
				// 直接修改原数据
				raw['parent'] = info['parent']
				// language不存在值或者colors列表不识别改lang，则从父里拿
				if (!raw.language || !colors[raw.language]) {
					raw['language'] = info['parent']['language']
				}
			} catch (err) {
				return Promise.resolve({
					name: raw.full_name,
					err: {
						msg: 'getRepo request is fails',
						data: err
					}
				})
			}
		}
	}
})
