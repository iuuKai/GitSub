/*
 * @Author: iuukai
 * @Date: 2022-11-14 13:10:42
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-30 10:26:27
 * @FilePath: \gitsub\src\components\basic\gradients\gradients.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, computed } from 'vue'
import { isString } from 'lodash-es'
import style from './gradients.module.less'

export default defineComponent({
	name: 'Gradients',
	props: {
		type: {
			type: String,
			// default | text | border | circle
			default: 'default'
		},
		full: {
			type: Boolean,
			default: false
		},
		autoPlay: {
			type: Boolean,
			default: true
		},
		borderWidth: {
			type: [Number, String],
			default: 3
		}
	},
	setup(props, { slots }) {
		return () => {
			const { type, full, autoPlay, borderWidth } = props
			const borderHeight = computed(
				() => `${isString(borderWidth) ? parseFloat(borderWidth) : borderWidth}px`
			)

			return (
				(slots.default || type == 'border') && (
					<div
						class={[
							style['gradients'],
							style[`is-${type}`],
							style[full && 'is-full'],
							style[autoPlay && 'auto-play']
						]}
						style={
							type === 'circle' && {
								borderWidth: borderHeight.value
							}
						}
					>
						{type === 'border' ? (
							<div style={{ height: borderHeight.value }}></div>
						) : type === 'circle' ? (
							<div class={style['circle-static-round']}>{slots.default()}</div>
						) : (
							slots.default()
						)}
					</div>
				)
			)
		}
	}
})
