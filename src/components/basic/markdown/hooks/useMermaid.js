/*
 * @Author: iuukai
 * @Date: 2023-05-11 13:45:02
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-12 02:54:36
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\useMermaid.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const svg = ref('')
let mut = null

export const render = async (id, code, config) => {
	// mermaid.initialize(config)
	const { svg } = await mermaid.render(id, code)
	return svg
}

export function useMermaid({ id = '', graph = '' }) {
	onMounted(async () => {
		mut = new MutationObserver(() => renderChart())
		mut.observe(document.documentElement, { attributes: true })

		await renderChart()

		//refresh images on first render
		const hasImages =
			/<img([\w\W]+?)>/.exec(graph.replace(/%[^\s%]{2}/g, match => decodeURIComponent(match)))
				?.length > 0

		if (hasImages)
			setTimeout(() => {
				let imgElements = document.getElementsByTagName('img')
				let imgs = Array.from(imgElements)
				if (imgs.length) {
					Promise.all(
						imgs
							.filter(img => !img.complete)
							.map(
								img =>
									new Promise(resolve => {
										img.onload = img.onerror = resolve
									})
							)
					).then(() => {
						renderChart()
					})
				}
			}, 100)
	})

	onUnmounted(() => mut.disconnect())

	const renderChart = async () => {
		const hasDarkClass = document.documentElement.classList.contains('dark')
		const mermaidConfig = {
			securityLevel: 'loose',
			startOnLoad: false,
			theme: hasDarkClass ? 'dark' : 'default'
		}

		const salt = Math.random().toString(36).substring(7)
		let svgCode = await render(
			id || salt,
			graph.replace(/%[^\s%]{2}/g, match => decodeURIComponent(match)),
			mermaidConfig
		)
		// id 与下方 salt 无任何关系
		svg.value = `${svgCode} <span style="display: none">${salt}</span>`
	}

	return {
		svg
	}
}
