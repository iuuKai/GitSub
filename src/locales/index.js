/*
 * @Author: iuukai
 * @Date: 2022-10-21 05:45:59
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-26 00:38:40
 * @FilePath: \gitsub\src\locales\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { createI18n } from 'vue-i18n'
import { localeMap } from './config'
import { setHtmlPageLang, setLoadLocalePool } from './helper'
import { useLocaleStoreWithOut } from '@/store/modules/locale'

const defaultLocales = import.meta.glob('./lang/*.js', { eager: true })

function createI18nOptions() {
	const localeStore = useLocaleStoreWithOut()
	const locale = localeStore.getLocale
	const curLangKey = Object.keys(defaultLocales).find(k => k.indexOf(locale) > -1)
	const defaultLocale = defaultLocales[curLangKey]
	const message = defaultLocale.default?.message ?? {}

	setHtmlPageLang(locale)
	setLoadLocalePool(loadLocalePool => {
		loadLocalePool.push(locale)
	})

	return {
		locale,
		// legacy: false,
		fallbackLocale: localeMap.zh_CN, // set fallback locale
		messages: {
			[locale]: message
		},
		globalInjection: true,
		silentTranslationWarn: true, // true - warning off
		missingWarn: false,
		silentFallbackWarn: true
	}
}

const options = createI18nOptions()

export const i18n = createI18n(options)

// setup i18n instance with global
export async function setupI18n(app) {
	app.use(i18n)
}
