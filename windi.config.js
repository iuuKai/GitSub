/*
 * @Author: iuukai
 * @Date: 2022-10-21 08:11:00
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-27 06:50:30
 * @FilePath: \gitsub\windi.config.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineConfig } from 'windicss/helpers'
import { baseConfig } from 'windicss/config'
import plugin from 'windicss/plugin'
import colors from 'windicss/colors'

export default defineConfig({
	// 取消默认样式重置
	// preflight: false,
	darkMode: 'class', // or 'media'
	theme: {
		extend: {
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px'
			},
			colors: {
				gray: colors.gray,
				blue: colors.sky,
				red: colors.rose,
				pink: colors.fuchsia
			},
			animation: {
				// fluid: 'fluid 3s linear infinite',
				// 'fluid-fast': 'fluid 1s linear infinite',
				// 'fluid-slow': 'fluid 5s linear infinite'
			},
			keyframes: {
				// fluid: {
				// 	'0%': { backgroundPosition: '0 0' },
				// 	'100%': { backgroundPosition: '-100% 0' }
				// }
			},
			typography: theme => ({
				DEFAULT: {
					css: {
						img: {
							height: null
						}
					}
				}
			})
		},
		cursor: {
			...baseConfig.theme.cursor,
			'zoom-in': 'zoom-in'
		}
		// listStyleType: {
		// 	auto: 'auto'
		// }
		// boxShadow: {
		// 	// sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		// 	// DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		// 	// md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		// 	// lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		// 	// xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		// 	// '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		// 	// '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
		// 	// inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
		// 	// none: 'none'
		// }
	},
	plugins: []
})
