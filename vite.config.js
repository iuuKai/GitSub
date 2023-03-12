/*
 * @Author: iuukai
 * @Date: 2022-10-21 00:44:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-02-02 07:39:38
 * @FilePath: \gitsub\vite.config.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { prismjsPlugin } from 'vite-plugin-prismjs'
import WindiCSS from 'vite-plugin-windicss'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
// 按需加载antd
// import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

//这个配置 为了在html中使用 环境变量
const getViteEnv = (mode, target) => {
	return loadEnv(mode, process.cwd())[target]
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	server: {
		// vite 启动时打开项目
		open: true,
		port: 3000,
		host: '0.0.0.0'
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	// alias: {},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: '@import "@/styles/variables.less";'
				// modifyVars: {
				// 	hack: ';@import (reference) "@/styles/variables.less";'
				// }
			}
		}
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: tag => tag === 'lottie-player'
				}
			}
		}),
		vueJsx({
			isCustomElement: tag => tag === 'lottie-player'
		}),
		WindiCSS(),
		prismjsPlugin({
			languages: 'all',
			// 配置行号插件
			plugins: ['line-numbers'],
			// 主题名
			// theme: 'coy',
			css: true
		}),
		createHtmlPlugin({
			inject: {
				data: {
					//将环境变量 VITE_APP_TITLE 赋值给 title 方便 html页面使用 title 获取系统标题
					title: getViteEnv(mode, 'VITE_APP_TITLE')
				}
			}
		}),
		// 引入 cdn 就不需要按需了
		// Components({
		// 	resolvers: [AntDesignVueResolver()]
		// }),
		visualizer({
			//注意这里要设置为true，否则无效
			open: true,
			// 启用 gzip 压缩大小报告
			gzipSize: true,
			// 启用 brotli 压缩大小报告
			brotliSize: true
		}),
		importToCDN({
			modules: [
				{
					name: 'vue',
					var: 'Vue',
					path: 'https://cdn.jsdelivr.net/npm/vue@3.2.41/dist/vue.global.prod.min.js'
				},
				{
					name: 'vue-router',
					var: 'VueRouter',
					path: 'https://cdn.jsdelivr.net/npm/vue-router@4.1.5/dist/vue-router.global.min.js'
				},
				// {
				// 	name: 'vue-demi',
				// 	var: 'VueDemi',
				// 	path: 'https://cdn.jsdelivr.net/npm/vue-demi@0.13.11/lib/index.iife.min.js'
				// },
				{
					name: '@vueuse/shared',
					// var: '',
					path: 'https://cdn.jsdelivr.net/npm/@vueuse/shared@9.4.0/index.iife.min.js'
				},
				{
					name: '@vueuse/core',
					var: 'VueUse',
					path: 'https://cdn.jsdelivr.net/npm/@vueuse/core@9.3.1/index.iife.min.js'
				},
				{
					name: 'pinia',
					var: 'Pinia',
					path: 'https://cdn.jsdelivr.net/npm/pinia@2.0.23/dist/pinia.iife.min.js'
				},
				{
					name: 'vue-i18n',
					var: 'VueI18n',
					path: 'https://cdn.jsdelivr.net/npm/vue-i18n@9.2.2/dist/vue-i18n.global.prod.min.js'
				},
				{
					name: 'dayjs',
					var: 'dayjs',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js'
				},
				{
					name: 'dayjs_plugin_advancedFormat',
					var: 'dayjs_plugin_advancedFormat',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/advancedFormat.js'
				},
				{
					name: 'dayjs_plugin_customParseFormat',
					var: 'dayjs_plugin_customParseFormat',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/customParseFormat.js'
				},
				{
					name: 'dayjs_plugin_localeData',
					var: 'dayjs_plugin_localeData',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/localeData.js'
				},
				{
					name: 'dayjs_plugin_weekOfYear',
					var: 'dayjs_plugin_weekOfYear',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekOfYear.js'
				},
				{
					name: 'dayjs_plugin_weekYear',
					var: 'dayjs_plugin_weekYear',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekYear.js'
				},
				{
					name: 'dayjs_plugin_weekday',
					var: 'dayjs_plugin_weekday',
					path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/weekday.js'
				},
				{
					name: 'ant-design-vue',
					var: 'antd',
					path: 'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.13/dist/antd.min.js',
					css: [
						'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.13/dist/antd.min.css',
						'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.13/dist/antd.dark.min.css'
					]
				},
				{
					name: 'axios',
					var: 'axios',
					path: 'https://cdn.jsdelivr.net/npm/axios@1.1.3/dist/axios.min.js'
				},
				{
					name: 'nprogress',
					var: 'NProgress',
					path: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
					css: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css'
				},
				{
					name: 'lottie-web',
					var: 'lottie',
					path: 'https://cdn.jsdelivr.net/npm/lottie-web@5.9.6/build/player/lottie.min.js'
				},
				{
					name: '@lottiefiles/lottie-player',
					var: 'LottiePlayer',
					path: 'https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.min.js'
				},
				{
					name: 'marked',
					var: 'marked',
					path: 'https://cdn.jsdelivr.net/npm/marked@4.2.12/marked.min.js'
				},
				{
					name: 'prismjs',
					var: 'Prism',
					path: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js'
				},
				{
					name: 'lodash-es',
					var: '_',
					path: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'
				}
			]
		})
	]
}))
