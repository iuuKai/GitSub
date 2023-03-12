/*
 * @Author: iuukai
 * @Date: 2022-11-03 03:03:28
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-16 00:30:52
 * @FilePath: \gitsub\src\store\modules\owner.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import { getUser, getOrgRepoList, getRepoList, getUserStarredRepoList } from '@/api/user'
import { getOrg } from '@/api/org'
import { toLower } from 'lodash-es'
import { $http } from '@/utils/request'
import { to as _to } from '@/utils/awaitTo'
import colors from '@/utils/colors.json'

const UNKNOWN_ERROR = '未知错误，请重试'

export const useOwnerStore = defineStore({
	id: 'owner',
	state: () => ({
		owner: '',
		ownerInfo: null,
		reposTotal: 0,
		starsTotal: 0
	}),
	getters: {
		accountStore() {
			return useAccountStore()
		},
		// 是否当前授权用户
		isAuthUser() {
			return toLower(this.owner) === toLower(this.accountStore.getLoginName)
		},
		// 是否个人用户还是组织
		isUser() {
			return this.ownerInfo?.type === 'User'
		},
		getReposTotal() {
			return this.reposTotal / 1
		},
		getStarsTotal() {
			return this.starsTotal / 1
		},
		getOwner() {
			return this.owner
		},
		getOwnerInfo() {
			return this.ownerInfo
		}
	},
	actions: {
		setOwner(_owner) {
			this.user = _owner || ''
			this.owner = _owner || ''
		},
		setOwnerInfo(_info = null) {
			this.ownerInfo = _info
		},
		async apiGetOwnerInfo() {
			try {
				const type = this.accountStore.getType
				const isAuthUser = this.isAuthUser

				/**
				 * 获取 ownerInfo
				 */
				if (isAuthUser) {
					this.setOwnerInfo(this.accountStore.getUserInfo)
				} else {
					const [orgErr, orgInfo] = await _to(getOrg({ org: this.owner }))
					// 非组织
					if (orgErr) {
						const [userErr, userInfo] = await _to(getUser({ username: this.user }))
						// 也不是用户，则直接抛出错误
						if (userErr) throw userErr

						this.setOwnerInfo(userInfo)
					} else {
						this.setOwnerInfo(orgInfo)
					}
				}
				if (type === 'github') {
					this.reposTotal =
						this.getOwnerInfo['public_repos'] + (this.getOwnerInfo['total_private_repos'] ?? 0)
					if (this.isUser) {
						const { meta, data } = await getUserStarredRepoList({
							per_page: 1,
							username: !isAuthUser ? this.owner : ''
						})
						// 0、1 时，无 last
						this.starsTotal = meta?.['last']?.['page'] ?? data.length
					}
				} else {
					const params = {
						// 因为 gitee 的 total 在 headers，所以只需获取一条数据触发请求即可
						per_page: 1,
						// 当前授权用户空参
						[this.isUser ? 'username' : 'org']: !isAuthUser ? this.owner : ''
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
		async apiGetRepoList(params) {
			try {
				// 是否当前授权用户
				const isAuthUser = this.isAuthUser
				// 是否用户还是组织
				const isUser = this.isUser
				const owner = this.getOwner

				const { data } = await (isUser ? getRepoList : getOrgRepoList)({
					// 当前授权用户空参
					[isUser ? 'username' : 'org']: !isAuthUser ? owner : '',
					...params
				})

				const idList = []
				const promiseList = []
				data.forEach(item => {
					// 先push父层
					if (item.fork) {
						idList.push({
							id: item.id,
							model: 'parent'
						})
						promiseList.push($http.get(item.url))
					}
					// 再push语言，因为后面需要从父获取语言，有先后顺序
					if ((!item.language || !colors[item.language]) && item.languages_url) {
						idList.push({
							id: item.id,
							model: 'language'
						})
						promiseList.push($http.get(item.languages_url))
					}
				})

				// 并发请求，减少时间
				const [err, responseList] = await _to(Promise.all(promiseList))
				// 出现错误则跳过
				if (!err) {
					idList.forEach((item, i) => {
						const { id, model } = item
						const repo = data.find(r => r.id === id)
						if (model === 'language') {
							const languages = responseList[i]
							// 如果空且有父，则从父里拿
							repo['language'] =
								!repo['language'] && repo['parent']
									? repo['parent']['language']
									: (repo['language'] = Object.keys(languages).reduce(
											(res, cur, i) =>
												(res = !res ? cur : languages[cur] > languages[res] ? cur : res),
											''
									  ))
						} else {
							repo[model] = responseList[i]['parent']
						}
					})
				}

				return Promise.resolve(data)
			} catch (err) {
				return Promise.reject(err)
			}
		},
		// 获取用户star的仓库
		apiGetUserStarredRepoList(params) {
			if (!this.isUser) return
			if (!this.isAuthUser) params.username = this.owner
			return getUserStarredRepoList(params).then(res => res.data)
		}
	}
})
