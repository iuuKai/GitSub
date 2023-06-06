/*
 * @Author: iuukai
 * @Date: 2023-01-30 23:48:47
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-25 01:47:59
 * @FilePath: \gitsub\src\components\basic\markdown\markdown-anchor.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import {
	defineComponent,
	computed,
	ref,
	onMounted,
	watch,
	unref,
	reactive,
	toRefs,
	nextTick
} from 'vue'
import {
	useElementBounding,
	useWindowSize,
	useScroll,
	useFullscreen,
	useDebounceFn,
	useCurrentElement
} from '@vueuse/core'
import { useDomStore } from '@/store/modules/dom'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'MdAnchor',
	props: {
		isFullscreen: {
			type: Boolean,
			default: false
		},
		list: {
			type: Array,
			default: () => []
		},
		getContainer: {
			type: Function,
			default: null
		}
	},
	setup(props, { expose }) {
		const router = useRouter()
		const domStore = useDomStore()
		const state = reactive({
			mapArr: [],
			anchorRef: null,
			currentAnchor: '',
			headerHeight: computed(() => domStore.getHeaderContainer?.offsetHeight || 0),
			getContainer: computed(() =>
				props.isFullscreen ? props.getContainer : () => domStore.getScrollContainer
			),
			getCurrentAnchor: computed(() => () => state.currentAnchor || (props.list[0]?.href ?? '')),
			treeArr: computed(() => props.list)
		})
		const { treeArr, anchorRef, headerHeight, getContainer, getCurrentAnchor } = toRefs(state)

		// watch(unref(getCurrentAnchor), val => {
		// 	if (!val) return
		// 	const el = document.querySelector(`[href="${val}"]`)
		// 	const { top } = useElementBounding(el)
		// 	fooTop.value++
		// 	console.log('[ el ] >', el)
		// 	console.log({ top: unref(top), width: unref(width), height: unref(height) })
		// })

		watch(
			() => state.currentAnchor,
			async val => {
				if (!val) return
				// await nextTick()
				// const el = document.querySelector('.ant-anchor-link-title-active')
				// const el = document.querySelector(`[href="${val}"]`)
				// const { top } = useElementBounding(el)
				// console.log('[ el ] >', el)
				// console.log({ top: unref(top), width: unref(width), height: unref(height) })
			}
		)
		const handleClick = (e, link) => {
			e.preventDefault()
			state.currentAnchor = link.href
			router.replace({ hash: link.href })
		}
		const { width, height } = useWindowSize()
		const handleChange = async link => {
			// if (!link) return
			state.currentAnchor = link
			// await nextTick()
			// const el = document.querySelector('.ant-anchor-link-title-active')
			// const { top } = useElementBounding(el)
			// console.log('[ el ] >', el)
			// console.log({ top: unref(top), width: unref(width), height: unref(height) })
		}

		const loopAnchor = list => {
			if (!list?.length) return null
			return list.map((item, i) => {
				// 声明一个 ref 对象，对组件实例进行绑定
				const curRef = ref(null)
				const child = (
					<a-anchor-link ref={curRef} key={item.title} href={item.href} title={item.title}>
						{loopAnchor(item.children)}
					</a-anchor-link>
				)
				// 监听是否获取组件实例
				watch(curRef, cur => {
					if (!cur?.$el) return
					state.mapArr.push({ href: item.href, $el: cur.$el })
				})
				return child
			})
		}

		const scrollTo = href => {
			if (!state.mapArr.length) return
			const mapItem = state.mapArr.find(item => item.href === href)
			if (!mapItem) return
			const curEl = mapItem.$el.firstChild
			curEl && curEl.click()
		}

		// 暴露给父组件
		expose({
			scrollTo
		})

		return () => {
			return (
				<a-anchor
					ref={anchorRef}
					affix={false}
					showInkInFixed={true}
					target-offset={props.isFullscreen ? 0 : unref(headerHeight)}
					get-container={unref(getContainer)}
					get-current-anchor={unref(getCurrentAnchor)}
					wrapperStyle={{
						position: 'sticky',
						top: (props.isFullscreen ? 0 : unref(headerHeight)) + 'px',
						// overflow: 'hidden',
						userSelect: 'none',
						transition: '.3s'
					}}
					onClick={handleClick}
					onChange={handleChange}
				>
					{loopAnchor(unref(treeArr))}
				</a-anchor>
			)
		}
	}
})
