/*
 * @Author: iuukai
 * @Date: 2023-03-04 15:24:40
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-04 15:29:18
 * @FilePath: \gitsub\src\components\basic\two-column-layout\two-column-layout.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'TwoColumnLayout',
	props: {},
	setup(props) {
		return () => {
			return (
				<a-row gutter={16}>
					<a-col span={18}>
						<router-view></router-view>
					</a-col>
					<a-col span={6}></a-col>
				</a-row>
			)
		}
	}
})
