/*
 * @Author: iuukai
 * @Date: 2022-10-25 01:02:16
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-09 09:17:57
 * @FilePath: \gitsub\src\components\basic\locale-picker\locale-picker.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, Transition, ref, unref, computed, watchEffect } from 'vue'
import { useLocale } from '@/locales/useLocale'
import { localeList } from '@/locales/config'
import { IconFont } from '@/components/basic/iconfont'
import { startsWith } from 'lodash-es'
import style from './locale-picker.module.less'

export default defineComponent({
	name: 'LocalePicker',
	props: {
		size: {
			type: String,
			// large | middle | small | mini
			default: 'middle'
		},
		/**
		 * Whether to refresh the interface when changing
		 */
		reload: { type: Boolean }
	},
	setup(props, { attrs }) {
		const { changeLocale, getLocale } = useLocale()

		const fs = {
			large: 28,
			middle: 22,
			small: 20,
			mini: 18
		}

		const selectedKeys = ref([])
		const getLocaleText = computed(() => {
			const key = selectedKeys.value[0]
			if (!key) {
				return ''
			}
			return localeList.find(item => item.lang === key)?.label
		})

		watchEffect(() => {
			selectedKeys.value = [unref(getLocale)]
		})
		async function toggleLocale(lang) {
			await changeLocale(lang)
			selectedKeys.value = [lang]
			props.reload && location.reload()
		}
		function handleMenuClick({ key }) {
			if (unref(getLocale) === key) {
				return
			}
			toggleLocale(key)
		}

		return () => {
			const { size } = props

			const slots = {
				overlay: () => (
					<a-menu v-model:selectedKeys={selectedKeys.value} onClick={handleMenuClick}>
						{localeList.map(item => (
							<a-menu-item key={item.lang}>
								<span>{item.label}</span>
							</a-menu-item>
						))}
					</a-menu>
				),
				default: () => (
					<Transition name="fade" mode="out-in" appear>
						<a-space
							class={[style['locale-picker'], style['locale-picker-' + size]]}
							key={startsWith(getLocale.value, 'zh') ? 'zh' : 'en'}
						>
							<IconFont
								type={`lang-${startsWith(getLocale.value, 'zh') ? 'zh' : 'en'}`}
								size={fs[size]}
							/>
							<span>{getLocaleText.value}</span>
						</a-space>
					</Transition>
				)
			}

			return <a-dropdown v-slots={slots} {...attrs}></a-dropdown>
		}
	}
})
