/*
 * @Author: iuukai
 * @Date: 2022-11-30 08:07:33
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-21 00:34:03
 * @FilePath: \gitsub\src\store\modules\repo.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import { useOwnerStore } from './owner'
import {
	getRepo,
	getRepoTrees,
	getRepoBlobs,
	getRepoContributorList,
	getRepoCollaboratorList,
	getRepoPathContents,
	getRepoLanguageList,
	getRepoReadme,
	getRepoBrancheList,
	getRepoTagList,
	getRepoCommit,
	getRepoCommitList,
	getRepoNetworksEventList,
	getRepoDownloadZIP,
	getRepoLatestReleases
} from '@/api/repo'

export const useRepoStore = defineStore({
	id: 'repo',
	state: () => ({
		details: {},
		contents: null,
		mdContent: ''
	}),
	getters: {
		accountStore() {
			return useAccountStore()
		},
		ownerStore() {
			return useOwnerStore()
		},
		getRepoName() {
			return this.details?.name
		},
		getMdContent() {
			return this.mdContent
		},
		getDetails() {
			return this.details
		},
		getContents() {
			return this.contents
		}
	},
	actions: {
		setMdContent(_md) {
			this.mdContent = _md
		},
		setDetails(_details) {
			this.details = _details
		},
		setContents(_contents) {
			this.contents = _contents
		},
		// 获取仓库详情
		apiGetRepo(params) {
			return getRepo(params)
		},
		// 获取仓库目录Tree
		apiGetRepoTrees(params) {
			return getRepoTrees(params)
		},
		// 获取仓库Blob
		apiGetRepoBlobs(params) {
			return getRepoBlobs(params)
		},
		// 获取仓库贡献者
		apiGetRepoContributorList(params) {
			return getRepoContributorList(params)
		},
		// 获取仓库所有成员
		apiGetRepoCollaboratorList(params) {
			return getRepoCollaboratorList(params)
		},
		// 获取仓库语言列表
		apiGetRepoLanguageList(params) {
			return getRepoLanguageList(params)
		},
		// 获取仓库具体路径下的内容
		apiGetRepoPathContents(params) {
			return getRepoPathContents(params)
		},
		// 获取仓库README
		apiGetRepoReadme(params) {
			return getRepoReadme(params)
		},
		// 获取仓库所有分支
		apiGetRepoBrancheList(params) {
			return getRepoBrancheList(params)
		},
		// 获取仓库所有tags
		apiGetRepoTagList(params) {
			return getRepoTagList(params)
		},
		// 获取仓库某个提交
		apiGetRepoCommit(params) {
			return getRepoCommit(params)
		},
		// 获取仓库所有提交
		apiGetRepoCommitList(params) {
			return getRepoCommitList(params)
		},
		// 获取仓库所有公开动态
		apiGetRepoNetworksEventList(params) {
			return getRepoNetworksEventList(params)
		},
		// 下载仓库 zip
		apiGetRepoDownloadZIP(params) {
			return getRepoDownloadZIP(params)
		},
		// 获取仓库最新发行版
		apiGetRepoLatestReleases(params) {
			return getRepoLatestReleases(params)
		}
	}
})
