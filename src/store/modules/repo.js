/*
 * @Author: iuukai
 * @Date: 2022-11-30 08:07:33
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-01 14:05:48
 * @FilePath: \gitsub\src\store\modules\repo.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import { useOwnerStore } from './owner'
import { upperFirst } from 'lodash-es'
import * as API from '@/api/repo'

const apiActions = {}
Object.keys(API).forEach(k => (apiActions[`api${upperFirst(k)}`] = API[k]))

export const useRepoStore = defineStore({
	id: 'repo',
	state: () => ({
		isRopeHome: false,
		// 仓库路径
		path: '',
		// 仓库详情
		details: null,
		// 文件或目录
		contents: null,
		// 文件内容
		mdContent: '',
		// 当前路径提交
		curPathCommit: null,
		// 仓库动态
		events: null,
		// 贡献者
		contributors: null,
		// 所有发行版
		releases: null,
		releasesTotal: 0,
		languages: null
	}),
	getters: {
		accountStore() {
			return useAccountStore()
		},
		ownerStore() {
			return useOwnerStore()
		},
		getContents() {
			return this.contents
		},
		getDetails() {
			return this.details
		},
		// getMdContent() {
		// 	return this.mdContent
		// },
		getCurPathCommit() {
			return this.curPathCommit
		}
	},
	actions: {
		setRepoState(key, value) {
			this[key] = value
		},
		setMdContent(_md) {
			this.mdContent = _md
		},
		...apiActions
	}
})
