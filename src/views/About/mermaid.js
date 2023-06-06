/*
 * @Author: iuukai
 * @Date: 2023-05-10 12:53:08
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-10 12:53:08
 * @FilePath: \gitsub\src\views\About\mermaid.js
 * @Description:
 * @QQ/微信: 790331286
 */
import mermaid from 'mermaid'

export const render = async (id, code, config) => {
	mermaid.initialize(config)
	const { svg } = await mermaid.render(id, code)
	return svg
}
