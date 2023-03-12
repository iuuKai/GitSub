/*
 * @Author: iuukai
 * @Date: 2023-01-30 23:48:47
 * @LastEditors: iuukai
 * @LastEditTime: 2023-02-28 13:13:39
 * @FilePath: \gitsub\src\components\basic\markdown\markdown-anchor.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, computed, ref, onMounted, watch, unref, reactive, toRefs } from 'vue'
import { useDomStore } from '@/store/modules/dom'
import { useRouter } from 'vue-router'
import { fixFlatArr, arrFlatToTree } from '@/utils/common'

export default defineComponent({
	name: 'MdAnchor',
	props: {
		list: {
			type: Array,
			default: () => []
		}
	},
	setup(props, { expose }) {
		const router = useRouter()
		const domStore = useDomStore()

		const state = reactive({
			mapArr: [],
			anchorRef: null,
			currentAnchor: '',
			headerHeight: computed(() => domStore.getHeaderContainer.offsetHeight),
			getContainer: computed(() => () => domStore.getScrollContainer),
			getCurrentAnchor: computed(() => () => state.currentAnchor || (props.list[0]?.href ?? '')),
			treeArr: computed(() => {
				const { list } = props
				const o = {
					child: 'href',
					parent: 'p-href'
				}
				return arrFlatToTree(fixFlatArr(list, o), o)
			})
		})
		const { treeArr, anchorRef, headerHeight, getContainer, getCurrentAnchor } = toRefs(state)

		const handleClick = (e, link) => {
			e.preventDefault()
			state.currentAnchor = link.href
			router.replace({ hash: link.href })
		}
		const handleChange = link => {
			state.currentAnchor = link
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
					target-offset={unref(headerHeight)}
					get-container={unref(getContainer)}
					get-current-anchor={unref(getCurrentAnchor)}
					wrapperStyle={{ position: 'sticky', top: unref(headerHeight) + 'px', overflow: 'hidden' }}
					onClick={handleClick}
					onChange={handleChange}
				>
					{loopAnchor(unref(treeArr))}
				</a-anchor>
			)
		}
	}
})
