/*
 * @Author: iuukai
 * @Date: 2022-11-04 20:18:31
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-04 20:22:27
 * @FilePath: \gitsub\src\components\basic\empty-block\empty-block.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent } from 'vue'
import style from './empty-block.module.less'

export default defineComponent({
	name: 'EmptyBlock',
	props: {},
	setup(props) {
		return () => <div class></div>
	}
})
