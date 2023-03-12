/*
 * @Author: iuukai
 * @Date: 2023-01-11 04:14:25
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-11 18:55:42
 * @FilePath: \gitsub\src\components\basic\markdown\markdown-preview.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, computed, watch, ref, unref, onUnmounted, nextTick, onMounted } from 'vue'
import { message as $message } from 'ant-design-vue'
import { FileTextOutlined } from '@ant-design/icons-vue'
import { useMutationObserver, useClipboard } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { toLower } from 'lodash-es'
import MdAnchor from './markdown-anchor'
import { useMarked } from './hooks/useMarked'
// 高亮主题
// import coy from 'prismjs/themes/prism-coy.min.css?inline'
// import okaidia from 'prismjs/themes/prism-okaidia.min.css?inline'
import tomorrow from 'prismjs/themes/prism-tomorrow.min.css?inline'
import solarized from 'prismjs/themes/prism-solarizedlight.min.css?inline'
import style from './markdown.module.less'

// xss

const prismLight = document.createElement('style')
prismLight.dataset.type = 'prism-light'
prismLight.textContent = solarized
document.head.appendChild(prismLight)

const prismDark = document.createElement('style')
prismDark.dataset.type = 'prism-dark'
prismDark.textContent = tomorrow
document.head.appendChild(prismDark)

useMutationObserver(
	document.head,
	mutations => {
		const hasCustomStyleEl_light = mutations.some(n =>
			Array.from(n.addedNodes).includes(prismLight)
		)
		if (!hasCustomStyleEl_light) {
			document.head.appendChild(prismLight)
			prismLight.disabled = !document.documentElement.classList.contains('light')
		}
		const hasCustomStyleEl_dark = mutations.some(n => Array.from(n.addedNodes).includes(prismDark))
		if (!hasCustomStyleEl_dark) {
			document.head.appendChild(prismDark)
			prismDark.disabled = !document.documentElement.classList.contains('dark')
		}
	},
	{
		childList: true
	}
)

export default defineComponent({
	name: 'Markdown',
	props: {
		isDark: {
			type: Boolean,
			default: false
		},
		title: String,
		content: String
	},
	emits: ['link-before'],
	setup(props, { emit, expose, slots }) {
		const route = useRoute()
		const anchorRef = ref(null)
		const mdContainerRef = ref(null)
		const copyedList = []

		watch(
			() => props.isDark,
			val => {
				prismLight.disabled = val
				prismDark.disabled = !val
			}
		)

		watch([mdContainerRef, anchorRef], async ([mdContainerEl, anchorComponent]) => {
			if (!mdContainerEl || !anchorComponent) return
			mdContainerEl.querySelectorAll('details').forEach(item => (item.open = true))
			await nextTick()

			if (route.hash && anchorComponent.scrollTo)
				setTimeout(() => anchorComponent.scrollTo(route.hash), 500)
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
				const { copy, copied } = useClipboard()
				// 判断冷却是否结束
				const index = copyedList.findIndex(item => item === el)
				if (index > -1) return
				// 调用复制函数
				copy(source)

				watch(copied, val => {
					if (val) {
						el.classList.replace('icon-copy', 'icon-copyed')
						// 记录已复制状态
						copyedList.push(el)
						$message.success('复制代码成功')
					} else {
						el.classList.replace('icon-copyed', 'icon-copy')
						// 重置状态
						copyedList.splice(index, 1)
					}
				})
			}

			// 链接拦截
			if (elParentName === 'a' || elName === 'a') {
				const url = (elParentName === 'a' ? elParent : el).getAttribute('href')
				emit('link-before', url)
			}

			// 锚点
			if (elName === 'span' && elType === 'anchor' && unref(anchorRef)) {
				// 调用子组件方法
				unref(anchorRef).scrollTo(el.dataset.hash)
			}
		}

		return () => {
			const w = ref('25%')
			function foo() {
				w.value = unref(w) === '0%' ? '25%' : '0%'
			}
			const { title, content } = props
			const { content: parseContent, isMarkdown, anchors } = useMarked(content, title)

			const vSlots = {
				title: () =>
					slots.title ? (
						slots.title(title)
					) : (
						<a-space>
							<FileTextOutlined />
							{title}
						</a-space>
					),
				default: () => {
					const Markdown = content => (
						<div
							ref={mdContainerRef}
							class={[style['markdown-body']]}
							v-html={unref(parseContent)}
							onClick={handleEventDelegationClick}
						></div>
					)
					return (
						<a-row>
							<a-col span={isMarkdown ? 5 : 0}>
								<MdAnchor
									ref={anchorRef}
									wrapperClass={style['markdown-anchor']}
									list={unref(anchors)}
								/>
							</a-col>
							<a-col span={isMarkdown ? 19 : 24}>{Markdown(unref(parseContent))}</a-col>
						</a-row>
					)
					// return (
					// 	<div style={{ display: 'flex' }}>
					// 		<div style={{ width: unref(w), transition: '.3s', overflow: 'hidden' }}>
					// 			<MdAnchor
					// 				ref={anchorRef}
					// 				wrapperClass={style['markdown-anchor']}
					// 				list={unref(anchors)}
					// 			/>
					// 		</div>
					// 		<div style={{ flex: 'auto', width: '75%' }}>
					// 			<div
					// 				ref={mdContainerRef}
					// 				class={[style['markdown-body']]}
					// 				v-html={unref(parseContent)}
					// 				onClick={handleEventDelegationClick}
					// 			></div>
					// 		</div>
					// 	</div>
					// )
				}
			}
			return content ? <a-card v-slots={vSlots} bodyStyle={{ padding: 0 }}></a-card> : null
		}
	}
})
