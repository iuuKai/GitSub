<!--
 * @Author: iuukai
 * @Date: 2022-12-05 12:19:32
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-06 23:44:46
 * @FilePath: \gitsub\src\views\About\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="about">
		<h2 class="demo">demo</h2>
		<a-image src="https://drive.google.com/file/d/1gPGUgGDtt5zZ8SSAVjWB4fLj7-cw_sWv/view" />
		<div>姓名: {{ username }}</div>
		<div>年龄: {{ userage }}</div>
		<!-- <div id="demo" v-html="demo"></div> -->
		<a-typography-title>marked + Mermaidjs</a-typography-title>
		<Mermaid id="mermaid-foo" :graph="foo" />
		<Mermaid id="mermaid-bar" :graph="bar" />

		<a-button type="primary" @click="handleClick('dark')">change</a-button>
		<!-- <div class="container">
			<div class="mermaid">{{ foo }}</div>
			And here is another:
			<div class="mermaid">{{ bar }}</div>
			<div class="mermaid">{{ foobar }}</div>
		</div> -->
	</div>
</template>

<script setup>
import { reactive, toRefs, ref, computed, onMounted } from 'vue'
import { useDemoStore } from '@/store/modules/demo'
import mermaid from 'mermaid'
import Mermaid from './Mermaid.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const domStore = useDemoStore()

const username = computed(() => domStore.user.name)
const userage = computed(() => domStore.user.age)

const state = reactive({
	demo: {
		name: '张三',
		age: 18
	}
})

const { demo } = toRefs(state)

const aaa = ref({ name: '123' })

console.log('reactive >> ', aaa)
console.log('toRefs >> ', demo)

const foo = `
sequenceDiagram 
Title: 标题：复杂使用
对象A->对象B: 对象B你好吗?（请求）
Note right of 对象B: 对象B的描述
Note left of 对象A: 对象A的描述(提示)
对象B-->对象A: 我很好(响应)
对象B->小三: 你好吗
小三-->>对象A: 对象B找我了
对象A->对象B: 你真的好吗？
Note over 小三,对象B: 我们是朋友
participant C
Note right of C: 没人陪我玩
`

const bar = `
sequenceDiagram
    participant 张三
    participant 李四
    张三->王五: 王五你好吗？
    loop 健康检查
        王五->王五: 与疾病战斗
    end
    Note right of 王五: 合理 食物 <br/>看医生...
    李四-->>张三: 很好!
    王五->李四: 你怎么样?
    李四-->王五: 很好!
`

const foobar = `
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
`

onMounted(async () => {
	// mermaid.initialize({
	// 	startOnLoad: true
	// })

	handleClick()

	console.log(router.getRoutes(), 54646546)
})

// mermaid.init(
// 		{
// 			theme: 'custom',
// 			themeVariables: {
// 				fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
// 				fontSize: '16px',
// 				backgroundColor: '#F9F9F9',
// 				primaryColor: '#0D1117',
// 				secondaryColor: '#6A737D',
// 				tertiaryColor: '#959DA4',
// 				quaternaryColor: '#D1D5DA',

// 				flowchartBackgroundColor: '#F9F9F9',
// 				flowchartTextColor: '#0D1117',
// 				flowchartBorderColor: '#0D1117',
// 				flowchartPrimaryColor: '#0D1117',
// 				flowchartSecondaryColor: '#6A737D',
// 				flowchartLabelBackgroundColor: '#F3F4F6',

// 				sequenceTextColor: '#0D1117',
// 				sequenceSecondaryColor: '#6A737D',
// 				sequenceAccentColor: '#28A745',
// 				sequenceLabelBackgroundColor: '#F3F4F6',

// 				ganttBackgroundColor: '#F9F9F9',
// 				ganttTextColor: '#0D1117',
// 				ganttBorderColor: '#0D1117',
// 				ganttPrimaryColor: '#0D1117',
// 				ganttSecondaryColor: '#6A737D',
// 				ganttLabelBackgroundColor: '#F3F4F6',

// 				classBackgroundColor: '#F9F9F9',
// 				classTextColor: '#0D1117',
// 				classBorderColor: '#0D1117',
// 				classLabelBackgroundColor: '#F3F4F6',

// 				stateBackgroundColor: '#F9F9F9',
// 				stateTextColor: '#0D1117',
// 				stateBorderColor: '#0D1117',
// 				stateAccentColor: '#28A745',
// 				stateLabelBackgroundColor: '#F3F4F6',

// 				erBackgroundColor: '#F9F9F9',
// 				erTextColor: '#0D1117',
// 				erBorderColor: '#0D1117',
// 				erPrimaryColor: '#0D1117',
// 				erSecondaryColor: '#6A737D',
// 				erLabelBackgroundColor: '#F3F4F6'
// 			}
// 		},
// 		document.getElementsByClassName('mermaid')
// 	)
async function handleClick(theme) {
	// mermaid.initialize({
	// 	startOnLoad: true
	// 	// theme,
	// })
	theme = theme === 'dark' ? 'default' : 'dark'
	console.log(theme)
	mermaid.initialize({
		// startOnLoad: true,
		// securityLevel: 'loose',
		theme,
		// theme: 'forest',
		arrowMarkerAbsolute: true,
		// themeCSS: '.edgePath .path {stroke: red;} .arrowheadPath {fill: red;}',
		logLevel: 0,
		state: {
			defaultRenderer: 'dagre-d3'
		},
		flowchart: {
			// defaultRenderer: 'dagre-wrapper',
			nodeSpacing: 10,
			curve: 'cardinal',
			htmlLabels: true
		},
		htmlLabels: true,
		// gantt: { axisFormat: '%m/%d/%Y' },
		sequence: { actorFontFamily: 'courier', actorMargin: 50, showSequenceNumbers: false },
		// sequenceDiagram: { actorMargin: 300 } // deprecated
		// fontFamily: '"times", sans-serif',
		// fontFamily: 'courier',
		fontSize: 18,
		curve: 'basis',
		securityLevel: 'antiscript',
		startOnLoad: false,
		secure: ['secure', 'securityLevel', 'startOnLoad', 'maxTextSize']
	})
	await mermaid.run({
		querySelector: '.mermaid'
	})
	// mermaid.init(
	// 	{
	// 	},
	// 	document.getElementsByClassName('mermaid')
	// )
}

const img = ref('')

loadImg('./demo.jpg')
async function loadImg(url) {
	img.value = (await import(url)).default
}
</script>

<style lang="less" scoped></style>
