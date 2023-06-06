<!--
 * @Author: iuukai
 * @Date: 2023-05-17 03:46:08
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-25 00:01:51
 * @FilePath: \gitsub\src\views\Repo\pages\Edit.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<div v-if="fileContents" ref="mdCardRef" class="md_card_container">
			<Gradients type="border" />
			<a-card :bodyStyle="{ padding: 0 }">
				<template #title>
					<a-space>
						<FileTextOutlined />
						<span id="readme">{{ title }}</span>
						<a-button @click="handleFullScreenToogle">click</a-button>
					</a-space>
				</template>
				<div
					ref="mdContainerRef"
					:class="{ 'is-fullscreen': isFullscreen }"
					:style="isFullscreen ? null : { overflow: 'unset' }"
				>
					<div ref="mdRef" :style="{ fontSize: 0 }">
						<MarkDownEditor :value="fileContents" :isDark="isDark" :config="config" />
						<!-- <Codemirror v-model="fileContents" :isDark="isDark" /> -->
					</div>
					<!-- <MarkDownPreview
						ref="mdRef"
						:isDark="isDark"
						:title="title"
						:content="fileContents"
						:is-fullscreen="isFullscreen"
						@copied="handleClickCopy"
						@link-before="handleClickLink"
					/> -->
					<!-- <Codemirror
						v-model="fileContents"
						placeholder="Code gose here..."
						:style="{ height: '400px' }"
						:autofocus="true"
						:indent-with-tab="true"
						:tabSize="2"
						:extensions="[]"
						@ready="log('ready', $event)"
						@change="log('change', $event)"
						@focus="log('focus', $event)"
						@blur="log('blur', $event)"
					/> -->

					<a-back-top v-if="isFullscreen" :target="() => mdRef.$el" />
				</div>
			</a-card>
		</div>
	</div>
</template>

<script setup>
import { MarkDownPreview, MarkDownEditor, Codemirror } from '@/components/basic/markdown'
import { FileList } from '../components'
import { Modal } from 'ant-design-vue'
import { message as $message } from 'ant-design-vue'
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

import { h, defineComponent, reactive, toRefs, computed, ref, unref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
	useElementBounding,
	unrefElement,
	useScroll,
	useFullscreen,
	useDebounceFn
} from '@vueuse/core'
import { useDomStore } from '@/store/modules/dom'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import { Base64 } from '@/utils/crypto'
import { toLower, isArray, isPlainObject } from 'lodash-es'
import { fileDownload } from '@/utils/file-download'
import scrollTo from '../../../components/basic/markdown/hooks/scrollTo'
// import { Codemirror } from 'vue-codemirror'

const route = useRoute()
const router = useRouter()
const domStore = useDomStore()
const repoStore = useRepoStore()
const themeStore = useThemeStore()

const state = reactive({
	isDark: computed(() => themeStore.getTheme === 'dark'),
	title: '',
	fileContents: ''
})
const { isDark, title, fileContents } = toRefs(state)
const contentRef = ref(null)
const mdCardRef = ref(null)
const mdContainerRef = ref(null)
const mdRef = ref(null)
const { isFullscreen, toggle: handleFullScreenToogle } = useFullscreen(mdContainerRef)

const config = reactive({
	disabled: false,
	indentWithTab: true,
	tabSize: 2,
	autofocus: true,
	height: 'auto',
	language: 'javascript',
	theme: isDark.value ? 'default' : 'oneDark'
})

onMounted(() => {
	// const editor = new Editor({
	//       // 指定textarea的id
	//       id: 'my-textarea',
	//       // 配置参数
	//       width: '100%',
	//       height: 500,
	//       path: '/static/editor.md/lib/',
	//       saveHTMLToTextarea: true, // 保存HTML到textarea
	//       flowChart: true, // 启用流程图功能
	//       sequenceDiagram: true, // 启用时序图功能
	//       imageUpload: true, // 启用图片上传功能
	//       imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'], // 允许上传的文件格式
	//       imageUploadURL: '/upload-image', // 图片上传的后端接口地址
	//   })
})

getFileContent()
async function getFileContent() {
	try {
		const { name, content } = await repoStore.apiGetRepoPathContents(route.params)
		state.title = name
		state.fileContents = Base64.dec(content)
	} catch (err) {
		console.error('获取失败:', err)
	}
}
</script>

<style lang="less" scoped></style>
