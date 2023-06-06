/*
 * @Author: iuukai
 * @Date: 2023-02-15 11:39:12
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-02 13:01:15
 * @FilePath: \gitsub\src\utils\common.js
 * @Description:
 * @QQ/微信: 790331286
 */
/**
 * 字节单位换算
 * @param {*} bytes
 * @returns
 */
export function byteConvert(bytes) {
	if (isNaN(bytes)) {
		return ''
	}
	const symbols = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	let exp = Math.floor(Math.log(bytes) / Math.log(2))
	if (exp < 1) {
		exp = 0
	}
	const i = Math.floor(exp / 10)
	bytes = bytes / Math.pow(2, 10 * i)

	if (bytes.toString().length > bytes.toFixed(2).toString().length) {
		bytes = bytes.toFixed(2)
	}
	return `${bytes} ${symbols[i]}`
}

const htmlTags = [
	'a',
	'abbr',
	'acronym',
	'address',
	'applet',
	'area',
	'article',
	'aside',
	'audio',
	'b',
	'base',
	'basefont',
	'bdi',
	'bdo',
	'big',
	'blockquote',
	'body',
	'br',
	'button',
	'canvas',
	'caption',
	'center',
	'cite',
	'code',
	'col',
	'colgroup',
	'data',
	'datalist',
	'dd',
	'del',
	'details',
	'dfn',
	'dialog',
	'dir',
	'div',
	'dl',
	'dt',
	'em',
	'embed',
	'fieldset',
	'figcaption',
	'figure',
	'font',
	'footer',
	'form',
	'frame',
	'frameset',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'head',
	'header',
	'hr',
	'html',
	'i',
	'iframe',
	'img',
	'input',
	'ins',
	'kbd',
	'label',
	'legend',
	'li',
	'link',
	'main',
	'map',
	'mark',
	'menu',
	'menuitem',
	'meta',
	'meter',
	'nav',
	'noframes',
	'noscript',
	'object',
	'ol',
	'optgroup',
	'option',
	'output',
	'p',
	'param',
	'picture',
	'pre',
	'progress',
	'q',
	'rp',
	'rt',
	'ruby',
	's',
	'samp',
	'script',
	'section',
	'select',
	'small',
	'source',
	'span',
	'strike',
	'strong',
	'style',
	'sub',
	'summary',
	'sup',
	'svg',
	'table',
	'tbody',
	'td',
	'template',
	'textarea',
	'tfoot',
	'th',
	'thead',
	'time',
	'title',
	'tr',
	'track',
	'tt',
	'u',
	'ul',
	'var',
	'video',
	'wbr',
	'xmp'
]

export function isHtmlTag(str) {
	const reg =
		/^(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr|xmp)$/i
	return reg.test(str)
}
