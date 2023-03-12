/*
 * @Author: iuukai
 * @Date: 2022-10-24 11:56:44
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-29 03:56:56
 * @FilePath: \gitsub\src\components\basic\weather\he-weather.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, watch, onUnmounted, computed } from 'vue'
import { useScriptTag } from '@vueuse/core'
import { toLower, endsWith } from 'lodash-es'
import style from './weather.module.less'

const { load, unload } = useScriptTag(
	'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0',
	() => {},
	{ manual: true }
)

function setOptions(obj) {
	const optKeys = [
		'modules',
		'background',
		'tmpColor',
		'tmpSize',
		'cityColor',
		'citySize',
		'aqiColor',
		'aqiSize',
		'weatherIconSize',
		'alertIconSize',
		'padding',
		'shadow',
		'language',
		'fixed',
		'vertical',
		'horizontal',
		'appKey'
	]

	let CONFIG = {}
	if (Object.keys(obj.config).length) {
		CONFIG = { ...obj.config }
		const isNotFounds = optKeys.filter(k => !(k in CONFIG) && !endsWith(toLower(k), 'key'))
		isNotFounds.forEach(k => {
			CONFIG[k] = obj[k]
		})
	} else {
		optKeys.forEach(k => (CONFIG[endsWith(toLower(k), 'key') ? 'key' : k] = obj[k]))
	}
	window.WIDGET = {
		CONFIG
	}
}

export default defineComponent({
	name: 'HeWeather',
	props: {
		modules: {
			type: String,
			default: '10234'
		},
		background: {
			type: [String, Number],
			default: 1
		},
		tmpColor: {
			type: String,
			default: 'FFFFFF'
		},
		tmpSize: {
			type: [String, Number],
			default: 16
		},
		cityColor: {
			type: String,
			default: 'FFFFFF'
		},
		citySize: {
			type: [String, Number],
			default: 16
		},
		aqiColor: {
			type: String,
			default: 'FFFFFF'
		},
		aqiSize: {
			type: [String, Number],
			default: 16
		},
		weatherIconSize: {
			type: [String, Number],
			default: 24
		},
		alertIconSize: {
			type: [String, Number],
			default: 18
		},
		padding: {
			type: String,
			default: '10px 10px 10px 10px'
		},
		shadow: {
			type: String,
			default: '0'
		},
		language: {
			type: String,
			default: 'auto'
		},
		fixed: {
			type: String,
			default: 'false'
		},
		vertical: {
			type: String,
			default: 'top'
		},
		horizontal: {
			type: String,
			default: 'left'
		},
		appKey: {
			type: String
			// required: true
		},
		config: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		setOptions(props)

		load()

		watch(
			() => props.language,
			n => {
				unload()
				window.WIDGET.CONFIG.language = n
				load()
			}
		)

		onUnmounted(() => unload())

		return () => {
			return (
				<div class={style['he_weather_wrap']}>
					<div id="he-plugin-simple"></div>
				</div>
			)
		}
	}
})
