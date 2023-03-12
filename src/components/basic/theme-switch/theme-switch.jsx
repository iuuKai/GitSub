/*
 * @Author: iuukai
 * @Date: 2022-10-22 05:24:27
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-09 08:40:33
 * @FilePath: \gitsub\src\components\basic\theme-switch\theme-switch.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, computed, watch } from 'vue'
import { IconFont } from '../iconfont'
import { message } from 'ant-design-vue'
import { useThemeStore } from '@/store/modules/theme'
import { useI18n } from '@/hooks/useI18n'
import style from './theme-switch.module.less'

export default defineComponent({
	name: 'ThemeSwitch',
	props: {
		showMessage: {
			type: Boolean,
			default: false
		},
		checkedMessage: String,
		unCheckedMessage: String
	},
	setup(props, { attrs }) {
		const { t } = useI18n()
		const themeStore = useThemeStore()
		const theme = computed({
			get: () => themeStore.getTheme,
			set: val => themeStore.setTheme(val)
		})
		watch(theme, v => {
			const msgSucc = t(v === 'dark' ? 'message.theme.dark' : 'message.theme.light')
			message.success(msgSucc)
		})

		return () => {
			const slots = {
				checkedChildren: () => <IconFont type="icon-sun" size={16} />,
				unCheckedChildren: () => <IconFont type="icon-moon" size={16} />
			}

			return (
				<a-switch
					v-model:checked={theme.value}
					class={[
						style['theme-switch'],
						style[theme.value === 'dark' ? 'theme-switch-sun' : 'theme-switch-moon']
					]}
					checkedValue="dark"
					unCheckedValue="light"
					v-slots={slots}
				/>
			)
		}
	}
})
