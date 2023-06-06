<!--
 * @Author: iuukai
 * @Date: 2023-05-18 16:35:00
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-27 04:23:52
 * @FilePath: \gitsub\src\components\basic\markdown\markdown-editor.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<md-editor
		v-model="content"
		:theme="theme"
		:preview="false"
		:htmlPreview="false"
		:noMermaid="true"
		:noKatex="true"
		:noHighlight="true"
		:toolbars="toolbars"
		:footers="footers"
		:sanitize="html => xss(html)"
		:style="{
			minHeight: '100vh'
		}"
		@onChange="onChange"
		@onUploadImg="onUploadImg"
	/>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { MdEditor, config } from 'md-editor-v3'
import { lineNumbers } from '@codemirror/view'
import 'md-editor-v3/lib/style.css'
import xss from 'xss'
// import { languages } from '@codemirror/language-data'
// import { javascript } from '@codemirror/lang-javascript'

export default defineComponent({
	props: {
		value: String,
		isDark: {
			type: Boolean,
			default: false
		},
		config: {
			type: Object,
			default: () => ({})
		}
	},
	setup(props) {
		const content = ref(props.value)
		const theme = computed(() => (props.isDark ? 'dark' : 'light'))
		const toolbars = [
			'bold',
			'underline',
			'italic',
			'-',
			'title',
			'strikeThrough',
			'sub',
			'sup',
			'quote',
			'unorderedList',
			'orderedList',
			'task',
			'-',
			'codeRow',
			'code',
			'link',
			'image',
			'table',
			'mermaid',
			'katex',
			'-',
			'revoke',
			'next',
			'save',
			'=',
			'pageFullscreen',
			'fullscreen'
			// 'preview',
			// 'htmlPreview',
			// 'catalog'
			// 'github'
		]
		const footers = ['markdownTotal', '=']

		config({
			codeMirrorExtensions(_theme, extensions) {
				return [...extensions, lineNumbers()]
			}
		})

		function onChange(val) {}

		function onUploadImg(files) {
			console.log(Array.from(files))
		}

		return {
			content,
			theme,
			toolbars,
			footers,
			xss,
			onChange,
			onUploadImg
		}
	},
	components: {
		MdEditor
	}
})
</script>

<style lang="less" scoped>
.md-editor {
	:deep(.cm-content) {
		@apply pl-4;

		.ͼ1h,
		.ͼ10 {
			@apply text-current no-underline;
		}
	}
}
</style>
