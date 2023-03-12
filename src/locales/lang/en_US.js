/*
 * @Author: iuukai
 * @Date: 2022-10-25 14:55:26
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-25 23:46:38
 * @FilePath: \gitsub\src\locales\lang\en_US.js
 * @Description:
 * @QQ/微信: 790331286
 */
import antdLocale from 'ant-design-vue/es/locale/en_US'
import { genMessage } from '../helper'

const modulesFiles = import.meta.glob('./en-US/**', { eager: true })

export default {
	message: {
		...genMessage(modulesFiles, 'en-US'),
		antdLocale
	},
	dateLocale: null,
	dateLocaleName: 'en-US'
}
