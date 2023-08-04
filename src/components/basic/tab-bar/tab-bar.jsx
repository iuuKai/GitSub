/*
 * @Author: iuukai
 * @Date: 2023-05-27 06:25:53
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-10 18:43:45
 * @FilePath: \gitsub\src\components\basic\tab-bar\tab-bar.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, ref, h, unref, computed } from 'vue'
// import { useI18n } from '@/hooks/useI18n'
// import { tabs } from '../Tabs'
// import { useOwnerStore } from '@/store/modules/owner'
import style from './components.module.less'
import { isNumber } from 'lodash-es'

export default defineComponent({
	name: 'TabBar',
	props: {
		activeKey: {
			type: [Number, String],
			default: 0
		},
		tabs: {
			type: Array,
			default: () => []
		},
		fieldNames: {
			type: Object,
			default: () => ({
				icon: 'icon',
				label: 'label',
				model: 'model'
			})
		}
	},
	emits: ['update:activeKey', 'change'],
	setup(props, { emit }) {
		// const { t } = useI18n()
		// const ownerStore = useOwnerStore()

		// const count = {
		// 	repositories: ownerStore.getReposTotal,
		// 	stars: ownerStore.starsTotal
		// }
		// const list = computed(() =>
		// 	props.tabs.map(item => ({
		// 		...item,
		// 		label: t(`component.home.tabs.${item.model}`),
		// 		count: count[item.model]
		// 	}))
		// )
		const curActive = computed(() =>
			isNumber(props.activeKey) ? props.tabs[props.activeKey] : props.activeKey
		)

		const handleClick = (k, i) => {
			const active = isNumber(props.activeKey) ? i : k
			emit('update:activeKey', active)
			emit('change', active)
		}

		return () => {
			const { activeKey, tabs, fieldNames } = props

			return (
				<ul class={style['navbar_tabs_wrap']}>
					{tabs.map((item, i) => (
						<li class={style['navbar_tabs_item']}>
							<div
								class={[
									style['navbar_tabs_button'],
									((item[fieldNames.label] || item) === activeKey ||
										(isNumber(activeKey) && activeKey === i)) &&
										style['is-active']
								]}
								onClick={() => handleClick(item[fieldNames.label] || item, i)}
							>
								<a-space>
									{item[fieldNames.icon] && h(item[fieldNames.icon])}
									{item[fieldNames.label] || item}
									{(item.count || item.count === 0) && item.count}
								</a-space>
							</div>
						</li>
					))}
				</ul>
			)
		}
	}
})
