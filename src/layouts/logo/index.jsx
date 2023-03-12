/*
 * @Author: iuukai
 * @Date: 2022-11-01 02:38:15
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-03 00:33:05
 * @FilePath: \gitsub\src\layouts\logo\index.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { defaultRoutePath } from '@/router/constant'
import style from './logo.module.less'

export default defineComponent({
	name: 'Logo',
	props: {
		border: {
			type: Boolean,
			default: false
		},
		link: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			// large | normal
			default: 'normal'
		}
	},
	emits: {},
	setup(props) {
		const router = useRouter()

		const handleClick = () => {
			router.push(defaultRoutePath)
		}

		return () => {
			const { border, link, size } = props
			return (
				<div
					class={[
						style['logo'],
						style[border ? 'logo-border' : ''],
						style[link ? 'logo-link' : ''],
						style[`logo-size-${size}`]
					]}
					onClick={link && handleClick}
				>
					<Gradients type="text" class={'font-konexy'}>
						GitSub
					</Gradients>
				</div>
			)
		}
	}
})
