/*
 * @Author: iuukai
 * @Date: 2023-01-02 14:41:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-04 03:25:58
 * @FilePath: \gitsub\src\api\org\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { request } from '@/utils/request'

// 获取一个组织
export function getOrg(params = {}) {
	const { org } = params
	const url = `/orgs/${org}`
	return request({
		url,
		method: 'get'
	}).then(res => res.data)
}
