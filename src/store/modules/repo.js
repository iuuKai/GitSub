/*
 * @Author: iuukai
 * @Date: 2022-11-30 08:07:33
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-10 15:27:18
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
		details: {},
		// 文件或目录
		contents: [],
		// 文件内容
		textContent: '',
		// 当前路径提交
		curPathCommit: {},
		// 仓库动态
		events: [],
		// 贡献者
		contributors: [],
		// 所有发行版
		releases: [],
		releasesTotal: 0,
		languages: [],
		issuesTotal: 0,
		pullsTotal: 0
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
		getPath() {
			return this.path
		},
		// gettextContent() {
		// 	return this.textContent
		// },
		getCurPathCommit() {
			return this.curPathCommit
		}
	},
	actions: {
		setRepoState(key, value) {
			this[key] = value
		},
		setTextContent(_content) {
			this.textContent = _content
		},
		...apiActions
	}
})
