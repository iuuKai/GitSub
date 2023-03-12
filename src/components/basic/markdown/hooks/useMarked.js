/*
 * @Author: iuukai
 * @Date: 2023-02-28 00:50:42
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-11 19:19:43
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\useMarked.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { Renderer, parse } from 'marked'
import Prism from 'prismjs'
import emojiRegexCreater from 'emoji-regex'
import { ref } from 'vue'

const anchors = ref([])

// 参考：https://marked.js.org/using_pro#renderer
const renderer = {
	link(href, title, text) {
		return `<a class="ant-typography" href="${href}">${text}</a>`
	},
	// hr() {
	// 	return '<hr class="ant-divider ant-divider-horizontal" role="separator" />'
	// },
	code(code, infostring, escaped) {
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
			langs.filter(Boolean).length && Prism.languages?.[langs[0]]
				? Prism.highlight(code, Prism.languages[langs[0]], infostring)
				: code
		console.log(77777, Prism.languages)
		return `
    <div class="code_wrap">
      <button data-type="copy" class="iconfont icon-copy"></button>
      <pre class="line-numbers ${langsPrefix}"><code class="${langsPrefix}">${
			md + lineNumbersWrapper
		}</code></pre>
    </div>`
	}
}

function getHtmlStr(value) {
	const str = parse(value.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''), {
		renderer: Object.assign(new Renderer(), renderer)
	})
	return value
		? str.replace(
				/<h(\d{1})\s{1}(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gim,
				(raw, level, id, text) => {
					const emojiRegex = emojiRegexCreater()

					// 内容过滤标签
					const textNoTag = /^<(\w+)([^>]*)>/.test(text)
						? text.match(/<(\w+)[^>]*>(.*?)<\/\1>/)[2].replace(/^\s*|\s*$/g, '')
						: text.replace(/<(\w+)([^>]*)>(.*?)<\/\1>/g, '')

					// id过滤表情
					const idNoEmoji = id
						? id.replace(emojiRegex, '').replace(/^[\s-]*|[\s-]*$/g, '')
						: text.toLowerCase().replace(/\s+/g, '-')
					// 属性过滤id
					const attrsNoId = raw.match(/<h\d{1}\s{1}([^>]*)>/)[1].replace(/(id="([^"]+)[^"]")?/, '')

					anchors.value.push({
						title: textNoTag,
						href: '#' + idNoEmoji,
						level
					})

					// console.log({ raw, level, id, text, attrsNoId })

					return `<h${level} ${attrsNoId} id="${idNoEmoji}" class="ant-typography">
						<a id="user-content-${idNoEmoji}" name="${idNoEmoji}" class="anchor">
							<span data-type="anchor" data-hash="#${idNoEmoji}" class="iconfont icon-pin"></span>
						</a>		
						<span>${text}</span>
					</h${level}>`
				}
		  ) /* .replace(/(\x20|\t){2}/gi, '') */
		: ''
}

export function useMarked(value = '', title = '.md') {
	anchors.value = []
	const match = title.match(/^([^\.]*)|([^\.]+)$/g)
	const lang = match[1]
	const isMarkdown = /^md$/i.test(lang)
	const mdStr = isMarkdown ? value : `\`\`\`${lang}\n${value}\n\`\`\``
	const content = getHtmlStr(mdStr)

	return {
		content,
		anchors,
		isMarkdown
	}
}
