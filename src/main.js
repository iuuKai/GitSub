/*
 * @Author: iuukai
 * @Date: 2022-10-21 00:44:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-08-05 05:28:31
 * @FilePath: \gitsub\src\main.js
 * @Description:
 * @QQ/微信: 790331286
 */
// with polyfills
import 'core-js/stable'

import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupI18n } from '@/locales'
import { setupAntd, setupAssets, setupGlobalMethods, setupCustomComponents } from '@/plugins'

const app = createApp(App)

function setupPlugins() {
	// 注册全局常用的ant-design-vue组件
	setupAntd(app)
	// 引入静态资源
	setupAssets()
	// 注册全局自定义组件,如：<svg-icon />
	setupCustomComponents(app)
	// 注册全局方法，如：app.config.globalProperties.$message = message
	setupGlobalMethods(app)
}

async function setupApp() {
	// 挂载vuex状态管理
	setupStore(app)
	// Multilingual configuration
	// Asynchronous case: language files may be obtained from the server side
	await setupI18n(app)
	// 挂载路由
	await setupRouter(app)

	app.mount('#app')
}

setupPlugins()

setupApp()
