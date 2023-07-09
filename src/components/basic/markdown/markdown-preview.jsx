/*
 * @Author: iuukai
 * @Date: 2023-01-11 04:14:25
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-07 14:06:55
 * @FilePath: \gitsub\src\components\basic\markdown\markdown-preview.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, watch, ref, unref, nextTick, onMounted } from 'vue'
// import { message as $message } from 'ant-design-vue'
import { useClipboard, unrefElement, useCurrentElement } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { toLower } from 'lodash-es'
import { useMarked } from './hooks/useMarked'
import MdAnchor from './markdown-anchor'
import style from './markdown.module.less'

export default defineComponent({
	name: 'Markdown',
	props: {
		isDark: {
			type: Boolean,
			default: false
		},
		isFullscreen: {
			type: Boolean,
			default: false
		},
		showAnchor: {
			type: Boolean,
			default: false
		},
		title: String,
		content: String
	},
	emits: ['link-before', 'copied'],
	setup(props, { emit, expose, slots }) {
		const route = useRoute()
		const anchorRef = ref(null)
		const mdContainerRef = ref(null)
		const currentElement = useCurrentElement()
		// 勿放在 return 导致重复执行
		const {
			content: parseContent,
			// isMarkdown,
			anchors,
			isDarkTheme
		} = useMarked(props.content, props.showAnchor)
		const copyedList = []

		watch(
			() => props.isDark,
			val => {
				isDarkTheme.value = val
			},
			{ immediate: true }
		)

		watch(
			() => props.isFullscreen,
			async () => {
				await nextTick()
				unref(anchorRef).scrollTo(route.hash)
			}
		)

		onMounted(async () => {
			await nextTick()
			const anchorComponent = unref(anchorRef)
			const mdContainer = unrefElement(mdContainerRef)
			if (mdContainer) {
				// 展开 <details> 折叠元素
				mdContainer.querySelectorAll('details').forEach(item => (item.open = true))
			}
			if (anchorComponent && route.hash) {
				//初始化锚点定位
				anchorComponent.scrollTo(route.hash)
			}
		})

		// 事件代理
		const handleEventDelegationClick = e => {
			e.preventDefault()

			const el = e.target
			const elName = toLower(el.nodeName)
			const elClass = el.classList
			const elType = el.dataset.type
			const elParent = el.parentNode
			const elParentName = toLower(elParent.nodeName)

			// 复制粘贴
			if (elName === 'button' && elType === 'copy') {
				const source = el.nextElementSibling.textContent
				const { text, copy, copied } = useClipboard()
				// 判断冷却是否结束
				const index = copyedList.findIndex(item => item === el)
				if (index > -1) return
				// 调用复制函数
				copy(source)

				watch(copied, val => {
					if (val) {
						el.classList.replace('icon-copy', 'icon-copied')
						// 记录已复制状态
						copyedList.push(el)
						emit('copied', unref(text))
						// $message.success('复制代码成功')
					} else {
						el.classList.replace('icon-copied', 'icon-copy')
						// 重置状态
						copyedList.splice(index, 1)
					}
				})
			}

			// 链接拦截、内容里的锚点
			if (elParentName === 'a' || elName === 'a') {
				const url = (elParentName === 'a' ? elParent : el).getAttribute('href')
				console.log(/^#/.test(url), url, 555)
				if (/^#/.test(url)) {
					unref(anchorRef).scrollTo(url)
				} else if (url) {
					emit('link-before', url)
				}
			}

			// 生成的锚点
			if (elName === 'span' && elType === 'anchor' && unref(anchorRef)) {
				// 调用子组件方法
				unref(anchorRef).scrollTo(el.dataset.hash)
			}
		}

		return () => {
			const { isFullscreen, showAnchor } = props
			return unref(parseContent) ? (
				<a-row class={isFullscreen ? style['is-fullscreen'] : ''}>
					<a-col span={showAnchor ? 5 : 0}>
						<div class={style['markdown-anchor']}>
							<MdAnchor
								isFullscreen={isFullscreen}
								get-container={() => unrefElement(currentElement)}
								ref={anchorRef}
								list={unref(anchors)}
							/>
						</div>
					</a-col>
					<a-col span={showAnchor ? 19 : 24}>
						<div class={[style['md_pd_wrap'], showAnchor && style['is-show_anchor']]}>
							<div
								ref={mdContainerRef}
								class={style['markdown-body']}
								v-html={unref(parseContent)}
								onClick={handleEventDelegationClick}
							></div>
						</div>
					</a-col>
				</a-row>
			) : null
		}
	}
})
