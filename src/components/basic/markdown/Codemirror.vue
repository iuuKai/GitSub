<template>
	<Codemirror
		v-model:value="content"
		:options="cmOptions"
		ref="cmRef"
		height="100vh"
		placeholder="请输入..."
		@change="onChange"
		@input="onInput"
		@ready="onReady"
		@blur="onBlur"
		@beforeSelectionChange="onBeforeSelectionChange"
	></Codemirror>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import Codemirror from 'codemirror-editor-vue3'

// 语言
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/markdown/markdown.js'
// placeholder
import 'codemirror/addon/display/placeholder.js'
// 主题
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/shadowfox.css'
import 'codemirror/theme/seti.css'

// 折叠
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'

const props = defineProps({
	modelValue: String,
	isDark: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['update:modelValue'])

// let editor = null

const content = ref(props.modelValue)
const cmRef = ref()
const cmOptions = reactive({
	mode: 'text/javascript',
	smartIndent: true,
	// 缩进单位
	indentUnit: 4,
	matchBrackets: true,
	autoCloseBrackets: true,
	// 光标行高亮
	styleActiveLine: true,
	// readOnly: true,
	// 主题
	theme: computed(() => (props.isDark ? 'shadowfox' : 'default')),
	// theme: 'dracula',
	// 行号
	lineNumbers: true,
	// -- start 折叠
	lineWrapping: true,
	foldGutter: true, // Code folding
	gutters: ['CodeMirror-foldgutter', 'CodeMirror-linenumbers', 'CodeMirror-lint-markers']
	// -- end
})
const onChange = (val, cm) => {
	// if (!val) return
	// emits('update:modelValue', val)
}

const onInput = val => {
	emits('update:modelValue', val)
}
const ranges = {
	line: 0,
	ch: 0
}
const onBlur = cm => {
	// console.log(cm)
	cm.setSelection(ranges, ranges)
}

const onReady = cm => {
	console.log(cm.focus())
	// editor = cm
}

const onBeforeSelectionChange = cm => {
	const { line, ch } = cm.getCursor()
	ranges.line = line
	ranges.ch = ch
	// cm.setSelection({ line, ch }, { line, ch })
}

onMounted(() => {
	setTimeout(() => {
		cmRef.value?.refresh()
	}, 1000)

	setTimeout(() => {
		// cmRef.value?.resize(300, 200)
	}, 2000)

	setTimeout(() => {
		cmRef.value?.cminstance.isClean()
	}, 3000)
})

onUnmounted(() => {
	cmRef.value?.destroy()
})

function handleSave() {
	console.log('codeValue: ')
	console.log(code.value)
}
</script>
