/*
 * @Author: iuukai
 * @Date: 2022-12-28 00:13:38
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-13 18:05:30
 * @FilePath: \gitsub\src\views\Home\Tabs\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { ReadOutlined, HddOutlined, StarOutlined } from '@ant-design/icons-vue'
import Overview from './Overview.vue'
import Repositories from './Repositories.vue'
import Stars from './Stars.vue'

export const tabs = [
	// { model: 'overview', icon: ReadOutlined, component: Overview },
	{ model: 'repositories', icon: HddOutlined, component: Repositories },
	{ model: 'stars', icon: StarOutlined, component: Stars }
]
