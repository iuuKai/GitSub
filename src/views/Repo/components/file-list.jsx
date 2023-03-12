/*
 * @Author: iuukai
 * @Date: 2023-03-04 14:58:53
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-09 18:27:09
 * @FilePath: \gitsub\src\views\Repo\components\file-list.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, h } from 'vue'
import {
	UserOutlined,
	HddOutlined,
	FolderFilled,
	FolderOutlined,
	FileOutlined,
	CloudDownloadOutlined
} from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { toLower } from 'lodash-es'
import { byteConvert } from '@/utils/common'
import style from './components.module.less'

export default defineComponent({
	name: 'FileList',
	props: {
		list: {
			type: Array,
			default: () => []
		}
	},
	emits: ['file-click', 'download-click'],
	setup(props, { emit }) {
		const route = useRoute()
		const slots = {
			renderItem: ({ item }) => {
				const { type } = route.params
				const isGitee = toLower(type) === 'gitee'
				const isDir = item.type === 'dir'
				const icon = isDir ? FolderFilled : FileOutlined
				const iconProps = { style: { fontSize: '16px' } }
				const listItemSlots = {
					actions: () => (
						<>
							<a key="list-loadmore-more">删除</a>
						</>
					)
				}
				const listItemMetaSlots = {
					title: () => (
						<a-space size={10}>
							{h(icon, iconProps)}
							<a onClick={() => emit('file-click', item)} title={item.name}>
								{item.name}
							</a>
						</a-space>
					)
				}
				return (
					<a-list-item v-slots={listItemSlots}>
						<a-list-item-meta v-slots={listItemMetaSlots}></a-list-item-meta>
						{!isDir && (
							<div
								style={{
									width: '120px',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<span>{!isGitee && byteConvert(item.size)}</span>
								<a-typography-link onClick={() => emit('download-click', item)}>
									<CloudDownloadOutlined style={{ fontSize: '18px' }} />
								</a-typography-link>
							</div>
						)}
					</a-list-item>
				)
			}
		}

		return () => {
			const { list } = props

			return (
				<a-card bodyStyle={{ padding: 0 }}>
					<a-list size="small" data-source={list} v-slots={slots}></a-list>
				</a-card>
			)
		}
	}
})
