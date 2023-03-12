/*
 * @Author: iuukai
 * @Date: 2022-10-21 05:51:15
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-15 17:14:56
 * @FilePath: \gitsub\src\plugins\customComponents.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { IconFont } from '@/components/basic/iconfont'
import { Gradients } from '@/components/basic/gradients'

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app) {
	app.component(IconFont.name, IconFont)
	app.component(Gradients.name, Gradients)
}
