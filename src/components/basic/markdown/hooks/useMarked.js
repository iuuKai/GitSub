/*
 * @Author: iuukai
 * @Date: 2023-02-28 00:50:42
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-16 23:47:17
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\useMarked.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import emojiRegexCreater from 'emoji-regex'
import { Renderer, parse, use } from 'marked'
import xss from 'xss'
import markedKatex from 'marked-katex-extension'
import Prism from 'prismjs'
// 高亮主题
// import coy from 'prismjs/themes/prism-coy.min.css?inline'
// import okaidia from 'prismjs/themes/prism-okaidia.min.css?inline'
import tomorrow from 'prismjs/themes/prism-tomorrow.min.css?inline'
import solarized from 'prismjs/themes/prism-solarizedlight.min.css?inline'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'
import flowchart from 'flowchart.js'
import { useFlatToTree } from './useFlatToTree'

// window.mermaid = mermaid

const prismLight = document.createElement('style')
prismLight.dataset.type = 'prism-light'
prismLight.textContent = solarized
document.head.appendChild(prismLight)

const prismDark = document.createElement('style')
prismDark.dataset.type = 'prism-dark'
prismDark.textContent = tomorrow
document.head.appendChild(prismDark)

use(
	markedKatex({
		// output: 'mathml',
		// 将 displayMode 设置为 true
		displayMode: true,
		// 将 throwOnError 设置为 false
		throwOnError: false,
		strict: false
	})
)

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

const state = reactive({
	mermaidList: [],
	diagramList: [],
	anchorsFlat: [],
	anchorsTree: computed(() => {
		const { treeList } = useFlatToTree(state.anchorsFlat)
		return treeList
		// const list = state.anchorsFlat
		// return list.reduce((res, cur, i) => {
		// 	if (!res.length || cur.level <= res[0].level) {
		// 		res.push({ ...cur, children: [] })
		// 	} else {
		// 		res[res.length - 1].children.push({ ...cur })
		// 	}
		// 	return res
		// }, [])
	})
})
const isDarkTheme = ref(false)

// 参考：https://marked.js.org/using_pro#renderer
let hasTaskList = false
const renderer = {
	link(href, title, text) {
		return `<a class="ant-typography" href="${href}">${text}</a>`
	},
	list(body, ordered, start) {
		const type = ordered ? 'ol' : 'ul'
		const taskListClass = hasTaskList ? ' class="task-list"' : ''

		return `<${type}${taskListClass}>${body}</${type}>`
	},
	listitem(text, task, checked) {
		let taskListItemClass = ''

		if (task) {
			hasTaskList = true
			taskListItemClass = 'class="task-list-item"'
			text = text.replace(
				/^\s*\[[x ]\]\s*/,
				(match, checked) => `<input type="checkbox" ${checked === 'x' ? 'checked' : ''} disabled>`
			)
		} else {
			hasTaskList = false
		}

		return `<li ${taskListItemClass}>${text}</li>`
	},
	code(code, infostring, escaped) {
		if (['mermaid', 'sequence'].includes(infostring.toLowerCase())) {
			let graph = code
			const id = `mermaid-${Math.random().toString(36).substring(7)}`
			if (infostring === 'sequence') graph = `sequenceDiagram\n${code}`
			state.mermaidList.push({
				id,
				graph
			})
			return `<div id="${id}" class="mermaid">${graph}</div>`
		} else if (infostring === 'flow') {
			const id = `diagram-${Math.random().toString(36).substring(7)}`
			state.diagramList.push({
				id
			})
			const diagram = flowchart.parse(code)

			setTimeout(() => {
				diagram.drawSVG(id, {
					'line-width': 2
				})
			}, 1000)
			return `<div id="${id}" class="diagram"></div>`
		} else {
			/**
			 * 添加行号方便 prism 渲染
			 * 处理多语言格式类名
			 */
			const langs = infostring.split(',')
			const langsPrefix = langs
				.reduce(
					(res, cur, i, arr) =>
						/^\s*$/.test(cur) && arr.length === 1
							? res.concat('language-none')
							: res.concat(`language-${cur}`),
					[]
				)
				.join(' ')
			const reg = /\n(?!$)/g
			const match = code.match(reg)
			const linesNum = match ? match.length + 1 : 1
			const lines = new Array(linesNum + 1).join('<span></span>')
			const lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`
			const md =
				langs.filter(Boolean).length && Prism.languages[langs[0]]
					? Prism.highlight(code, Prism.languages[langs[0]], infostring)
					: code

			return `
			<div class="code_wrap">
				<button data-type="copy" class="iconfont icon-copy"></button>
				<pre class="line-numbers ${langsPrefix}"><code class="${langsPrefix}">${
				md + lineNumbersWrapper
			}</code></pre>
			</div>`
		}
	}
}

/**
 *
 * @param {*} value
 * @returns
 */
function getHtmlStr(value) {
	const v = value
		// katex 渲染时，反斜杠不得转义，即 md 是 \\pm，那么就需要改为 \pm
		.replace(/\\\\(\w+)/g, match => match.replace(/\\\\/g, '\\'))
		.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')

	const str = parse(
		xss(v, {
			whiteList: {
				a: ['href', 'rel', 'target', 'title'],
				b: [],
				bdi: ['dir'],
				bdo: ['dir'],
				big: [],
				blockquote: ['cite'],
				br: [],
				caption: [],
				center: [],
				cite: [],
				code: [],
				col: ['align', 'valign', 'width'],
				colgroup: ['align', 'valign', 'width'],
				dd: [],
				del: ['datetime'],
				details: ['open'],
				div: ['style', 'align', 'title'],
				dl: [],
				dt: [],
				em: [],
				font: ['color', 'size', 'face', 'style'],
				h1: ['align', 'title'],
				h2: ['align', 'title'],
				h3: ['align', 'title'],
				h4: ['align', 'title'],
				h5: ['align', 'title'],
				h6: ['align', 'title'],
				hr: [],
				i: [],
				img: ['alt', 'src', 'title', 'width', 'height'],
				ins: ['datetime'],
				li: [],
				mark: [],
				ol: ['start'],
				p: ['style', 'align', 'title'],
				picture: ['alt', 'src', 'title', 'width', 'height'],
				pre: [],
				q: [],
				rp: [],
				rt: [],
				ruby: [],
				s: [],
				samp: [],
				section: [],
				small: [],
				source: [],
				span: [],
				strong: [],
				strike: [],
				summary: [],
				sub: [],
				sup: [],
				table: [],
				tbody: [],
				tfoot: [],
				thead: [],
				th: [],
				tr: [],
				td: [],
				tt: [],
				u: [],
				ul: [],
				var: []
				// audio: ['autoplay', 'controls', 'loop', 'preload', 'src'],
				// video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
			},
			// 自定义匹配到标签时的处理方法
			onTag(tag, html, options) {
				const { isClosing } = options
				if (!isClosing) {
					if (['pre'].includes(tag)) {
						return `<${tag} class="language-none">`
					}
				}
				if (tag === 'picture') {
					return isClosing
						? '</picture></themed-picture>'
						: '<themed-picture data-catalyst-inline="true" data-catalyst=""><picture>'
				}
			},
			// 自定义匹配到不在白名单上的标签时的处理方法
			onIgnoreTag(tag, html, options) {
				if (/^(https|http):\S+$|^(kbd)$|^.{0}$/gi.test(tag)) {
					return html
				} else if (['iframe', 'noframes', 'style', 'textarea', 'title', 'xmp'].includes(tag)) {
					return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				} else if (/^\w+$/.test(tag) && !/\n/.test(html)) {
					return ''
				}
			},
			escapeHtml(html) {
				// 仅对需要正常显示，但又不属于元素的尖括号进行转义
				return html.replace(/<[^/][^>\n]*>|<.+?\/>/g, match => {
					return match.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				})
			}
		}),
		{
			renderer: Object.assign(new Renderer(), renderer)
		}
	)

	const idMark = {}
	return value
		? str.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
				const isHasId = /id="([^"]*)"/.exec(attrs)

				let id = isHasId ? isHasId[1] : text
				if (idMark[id]) {
					idMark[id]++
					id += '-' + (idMark[id] - 1)
				} else {
					idMark[id] = 1
				}

				const emojiRegex = emojiRegexCreater()

				// 内容过滤标签
				const textNoTag = /^<(\w+)([^>]*)>/.test(text)
					? text.match(/<(\w+)[^>]*>(.*?)<\/\1>/)[2].replace(/^\s*|\s*$/gi, '')
					: text.replace(/<(\w+)([^>]*)>(.*?)<\/\1>/gi, '')

				// id过滤表情
				const idNoEmoji = id
					? id.replace(emojiRegex, '').replace(/^[\s-]*|[\s-]*$/gi, '')
					: text.toLowerCase().replace(/\s+/g, '-')
				// 属性过滤id
				const attrsNoId = attrs.replace(/id="[^"]*"|^\s*|\s*$/gi, '')

				state.anchorsFlat.push({
					title: textNoTag,
					href: '#' + idNoEmoji,
					level
				})

				// console.log({ match, level, id, text, attrsNoId })

				return `<h${level} ${attrsNoId} id="${idNoEmoji}" class="ant-typography">
						<a id="user-content-${idNoEmoji}" name="${idNoEmoji}" class="anchor">
							<span data-type="anchor" data-hash="#${idNoEmoji}" class="iconfont icon-pin"></span>
						</a>
						<span>${text}</span>
					</h${level}>`
		  }) /* .replace(/(\x20|\t){2}/gi, '') */
		: ''
}

export function useMarked(value = '', title = '.md') {
	state.anchorsFlat = []
	const match = title.match(/^([^\.]*)|([^\.]+)$/g)
	const lang = (match[1] ?? '').replace('vue', 'html')
	const isMarkdown = /^md$/i.test(lang)
	const mdStr = isMarkdown ? value : `\`\`\`${lang}\n${value}\n\`\`\``
	const content = getHtmlStr(mdStr)
	const mermaidConfig = () => ({
		securityLevel: 'loose',
		startOnLoad: false,
		theme: isDarkTheme.value ? 'dark' : 'default'
	})

	onMounted(async () => {
		mermaid.initialize(mermaidConfig())
		mermaid.run()

		await nextTick()
		watch(
			isDarkTheme,
			async val => {
				prismLight.disabled = val
				prismDark.disabled = !val

				const promiseList = state.mermaidList.map(async item => {
					const wrapEl = document.getElementById(item.id)
					const svgEl = wrapEl.querySelector('svg')
					mermaid.initialize(mermaidConfig())
					const { svg } = await mermaid.render(svgEl.id, item.graph)
					// console.log('>>>>>>>>', svg)
					wrapEl.innerHTML = svg
				})

				Promise.all(promiseList)
			}
			// { immediate: true }
		)
	})

	return {
		content,
		anchors: state.anchorsTree,
		isMarkdown,
		isDarkTheme
	}
}
