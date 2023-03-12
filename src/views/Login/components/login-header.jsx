/*
 * @Author: iuukai
 * @Date: 2022-10-24 10:48:48
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-09 09:40:21
 * @FilePath: \gitsub\src\views\Login\login-header.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
// 组件
import { LocalePicker } from '@/components/basic/locale-picker'
import { ThemeSwitch } from '@/components/basic/theme-switch'
import { HeWeather } from '@/components/basic/weather'
// 方法
import { defineComponent, computed } from 'vue'
import { useLocale } from '@/locales/useLocale'
import { Config } from '@/config'
import { startsWith } from 'lodash-es'
import style from './login.module.less'

export default defineComponent({
	props: {},
	setup() {
		const { getLocale } = useLocale()

		return () => {
			const lang = computed(() => (startsWith(getLocale.value, 'zh') ? 'zh' : 'en'))

			return (
				<header class={style['login-header']}>
					<HeWeather language={lang.value} config={Config.HeWeather} />
					<a-space size={20}>
						<LocalePicker size="large" trigger={['click']} />
						<ThemeSwitch />
					</a-space>
				</header>
			)
		}
	}
})
