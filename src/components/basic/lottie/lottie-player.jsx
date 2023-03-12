/*
 * @Author: iuukai
 * @Date: 2022-10-22 07:20:05
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-15 14:10:19
 * @FilePath: \gitsub\src\components\basic\lottie\lottie-player.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent } from 'vue'
import '@lottiefiles/lottie-player'

export default defineComponent({
	name: 'Lottie',
	props: {
		width: {
			type: [Number, String],
			default: ''
		},
		height: {
			type: [Number, String],
			default: ''
		},
		src: {
			type: String,
			default: ''
		},
		mode: {
			type: String,
			default: 'normal'
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		loop: {
			type: Boolean,
			default: true
		},
		controls: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		return () => {
			const { width, height, src, autoplay, loop, mode, controls } = props

			return src ? (
				<lottie-player
					src={src}
					autoplay={autoplay}
					loop={loop}
					mode={mode}
					controls={controls}
					style={{
						width: `${parseFloat(width)}px`,
						height: `${parseFloat(height)}px`
					}}
				></lottie-player>
			) : null
		}
	}
})
