/*
 * @Author: iuukai
 * @Date: 2022-10-22 02:14:41
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-23 06:56:52
 * @FilePath: \gitsub\src\components\basic\lottie\lottie-web.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, onMounted, ref, computed, unref } from 'vue'
import lottie from 'lottie-web'

export default defineComponent({
	name: 'LottieWeb',
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
		jsonData: {
			type: Object,
			default: () => null
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		loop: {
			type: Boolean,
			default: true
		}
	},
	setup(props) {
		const anim = ref(null)

		const options = computed(() => {
			const { src, jsonData, autoplay, loop } = props
			return {
				container: anim.value,
				renderer: 'svg',
				loop: loop,
				autoplay: autoplay,
				path: src,
				// animationData只能加载本地json，优先级高于path
				animationData: jsonData
			}
		})

		onMounted(() => {
			lottie.loadAnimation(unref(options))
		})

		return () => {
			const { width, height, src, jsonData } = props

			return src || jsonData ? (
				<div
					ref={anim}
					style={{
						width: `${parseFloat(width)}px`,
						height: `${parseFloat(height)}px`
					}}
				/>
			) : null
		}
	}
})
