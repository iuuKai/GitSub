<!--
 * @Author: iuukai
 * @Date: 2023-03-06 05:50:21
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-11 18:55:06
 * @FilePath: \gitsub\src\views\Repo\pages\Blob.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<div class="markdown_container">
			<Gradients type="border" />
			<MarkDownPreview
				v-if="fileContent"
				:isDark="isDark"
				:title="title"
				:content="fileContent"
				@link-before="handleClickLink"
			>
				<template #title="title">
					<div>{{ title }}</div>
				</template>
			</MarkDownPreview>
		</div>
	</div>
</template>

<script setup>
import { MarkDownPreview } from '@/components/basic/markdown'
import { reactive, toRefs, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import { toLower, isArray } from 'lodash-es'
import { Base64 } from '@/utils/crypto'

const route = useRoute()
const repoStore = useRepoStore()
const themeStore = useThemeStore()
const state = reactive({
	isDark: computed(() => themeStore.getTheme === 'dark'),
	title: computed(() => {
		const paths = route.params.path
		return paths[paths.length - 1]
	}),
	fileContent: ''
})
const { isDark, title, fileContent } = toRefs(state)

getFileData()
async function getFileData() {
	try {
		const { owner, repo, path } = route.params
		console.log(path)
		const [{ content, name }] = await repoStore.apiGetRepoPathContentList({
			owner,
			repo,
			path: isArray(path) ? path.join('/') : ''
		})
		state.fileContent = Base64.dec(content)
		console.log(state.fileContent)
	} catch (err) {
		console.error(err)
	}
}

function handleClickLink(url) {
	console.log(url)
}
</script>

<style lang="less" scoped></style>
