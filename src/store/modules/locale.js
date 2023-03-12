/*
 * @Author: iuukai
 * @Date: 2022-10-25 13:41:25
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-26 23:34:42
 * @FilePath: \gitsub\src\store\modules\locale.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineStore } from 'pinia'
import { store } from '@/store'
import { useStorage, useNavigatorLanguage } from '@vueuse/core'
import { startsWith } from 'lodash-es'

const { language } = useNavigatorLanguage()
const locale = useStorage('_G_LOCALE__', startsWith(language.value, 'zh') ? 'zh_CN' : 'en_US')

export const useLocaleStore = defineStore({
	id: 'locale',
	state: () => ({
		locale
	}),
	getters: {
		getLocale() {
			return this.locale ?? 'zh_CN'
		}
	},
	actions: {
		setLocale(_locale) {
			this.locale = _locale
			locale.value = _locale
		}
	}
})

// Need to be used outside the setup
export function useLocaleStoreWithOut() {
	return useLocaleStore(store)
}
