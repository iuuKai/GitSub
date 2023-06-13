/*
 * @Author: iuukai
 * @Date: 2023-03-04 14:58:53
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-13 10:06:28
 * @FilePath: \gitsub\src\views\Repo\components\file-list.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { computed, defineComponent, h, unref } from 'vue'
import { FolderFilled, FileOutlined, CloudDownloadOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { toLower } from 'lodash-es'
import { byteConvert } from '@/utils/common'
import { useDayjs } from '@/hooks/useDayjs'
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
		const dayjs = useDayjs()

		const sourceList = computed(() => {
			const arr = props.list.map(item => ({ ...item }))
			console.log(arr, 123)
			const { path } = route.params

			if (path && path.length) {
				arr.unshift({
					type: 'back',
					name: '../',
					path: path.slice(0, path.length - 1).join('/')
				})
			}
			return arr
		})

		const renderIcon = (type, isHide) => {
			const icon = type === 'dir' ? FolderFilled : FileOutlined
			const iconProps = { style: { fontSize: '16px' } }
			return isHide ? <span class={style['icon-blank']}></span> : h(icon, iconProps)
		}

		const slots = {
			renderItem: ({ item }) => {
				const { type } = route.params
				const isBack = item.type === 'back'
				const isGitee = toLower(type) === 'gitee'
				const listItemSlots = {
					actions: () => (
						<div style={{ width: '100px', textAlign: 'right' }}>
							{item.demo && (
								<a-typography-text
									type="secondary"
									title={dayjs(item.demo.commit.author.date).format(
										'MMM D, YYYY[, ]h:mm A [GMT]ZZ'
									)}
								>
									{dayjs(item.demo.commit.author.date).from()}
								</a-typography-text>
							)}
						</div>
					)
				}
				const listItemMetaSlots = {
					title: () => (
						<a-row style={{ marginRight: '16px' }}>
							<a-col span={8}>
								<a-space size={10}>
									{renderIcon(item.type, isBack)}
									<a onClick={() => emit('file-click', item)} title={isBack ? null : item.name}>
										{item.name}
									</a>
								</a-space>
							</a-col>
							<a-col span={16}>
								{item.demo && (
									<a-typography-link
										type="secondary"
										ellipsis={true}
										title={item.demo.commit.message}
										content={item.demo.commit.message.match(/^[^\n]*/)?.[0]}
									></a-typography-link>
								)}
							</a-col>
						</a-row>
					)
				}
				return (
					<a-list-item v-slots={isBack ? null : listItemSlots} class={style['list_row']}>
						<a-list-item-meta v-slots={listItemMetaSlots}></a-list-item-meta>
						<div
							style={{
								width: '120px',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							{!isBack && item.type !== 'dir' && (
								<>
									<span>{!isGitee && byteConvert(item.size)}</span>
									<a-typography-link
										style={{ fontSize: '0' }}
										onClick={() => emit('download-click', item)}
									>
										<CloudDownloadOutlined style={{ fontSize: '18px' }} />
									</a-typography-link>
								</>
							)}
						</div>
					</a-list-item>
				)
			}
		}

		return () => {
			const { list } = props

			return list.length ? (
				<a-list size="small" data-source={unref(sourceList)} v-slots={slots}></a-list>
			) : null
		}
	}
})
