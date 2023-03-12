/*
 * @Author: iuukai
 * @Date: 2022-10-25 14:55:15
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-25 23:45:41
 * @FilePath: \gitsub\src\locales\lang\zh_CN.js
 * @Description:
 * @QQ/微信: 790331286
 */
import antdLocale from 'ant-design-vue/es/locale/zh_CN'
import { genMessage } from '../helper'

const modulesFiles = import.meta.glob('./zh-CN/**', { eager: true })

export default {
	message: {
		...genMessage(modulesFiles, 'zh-CN'),
		antdLocale
	}
}
