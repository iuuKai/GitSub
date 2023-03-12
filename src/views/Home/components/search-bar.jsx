/*
 * @Author: iuukai
 * @Date: 2022-11-14 11:46:08
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-01 00:51:28
 * @FilePath: \gitsub\src\views\Home\components\search-bar.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

export default defineComponent({
	name: 'SearchBar',
	props: {},
	setup(props) {
		return () => {
			const value = ref('')
			return (
				<>
					<Gradients type="border" />
					<a-card bodyStyle={{ padding: '10px 15px' }}>
						<a-row align="middle">
							<a-col span={1}>
								<SearchOutlined />
							</a-col>
							<a-col span={23}>
								<a-input
									v-model:value={value.value}
									placeholder="Search everything.."
									bordered={false}
								/>
							</a-col>
						</a-row>
					</a-card>
				</>
			)
		}
	}
})
