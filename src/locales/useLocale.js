/*
 * @Author: iuukai
 * @Date: 2022-10-25 13:37:03
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-25 14:54:30
 * @FilePath: \gitsub\src\locales\useLocale.js
 * @Description:
 * @QQ/微信: 790331286
 */
/**
 * Multi-language related operations
 */
import { unref, computed } from 'vue'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { i18n } from './'

import { useLocaleStoreWithOut } from '@/store/modules/locale'

function setI18nLanguage(locale) {
	const localeStore = useLocaleStoreWithOut()

	if (i18n.mode === 'legacy') {
		i18n.global.locale = locale
	} else {
		i18n.global.locale.value = locale
	}
	localeStore.setLocale(locale)
	setHtmlPageLang(locale)
}

export function useLocale() {
	const localeStore = useLocaleStoreWithOut()
	const getLocale = computed(() => localeStore.getLocale)

	const getAntdLocale = computed(() => {
		return i18n.global.getLocaleMessage(unref(getLocale)).antdLocale
	})

	// Switching the language will change the locale of useI18n
	// And submit to configuration modification
	async function changeLocale(locale) {
		const globalI18n = i18n.global
		const currentLocale = unref(globalI18n.locale)
		if (currentLocale === locale) {
			return locale
		}

		if (loadLocalePool.includes(locale)) {
			setI18nLanguage(locale)
			return locale
		}
		const langModule = (await import(`./lang/${locale}.js`)).default
		if (!langModule) return

		const { message } = langModule

		globalI18n.setLocaleMessage(locale, message)
		loadLocalePool.push(locale)

		setI18nLanguage(locale)
		return locale
	}

	return {
		getLocale,
		changeLocale,
		getAntdLocale
	}
}
