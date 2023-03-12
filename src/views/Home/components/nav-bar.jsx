/*
 * @Author: iuukai
 * @Date: 2022-11-14 09:11:48
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-05 05:10:09
 * @FilePath: \gitsub\src\views\Home\components\nav-bar.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, ref, h, unref, computed } from 'vue'
import { useI18n } from '@/hooks/useI18n'
import { tabs } from '../Tabs'
import { useOwnerStore } from '@/store/modules/owner'
import style from './components.module.less'

export default defineComponent({
	name: 'NavBar',
	props: {
		active: {
			type: [Number, String],
			default: 0
		}
	},
	emits: ['update:active', 'tab-click'],
	setup(props, { emit }) {
		const { t } = useI18n()
		const ownerStore = useOwnerStore()

		const count = {
			repositories: ownerStore.getReposTotal,
			stars: ownerStore.starsTotal
		}
		const list = computed(() =>
			tabs.map(item => ({
				...item,
				label: t(`component.home.tabs.${item.model}`),
				count: count[item.model]
			}))
		)

		const handleClick = ({ model, label }, index) => {
			emit('update:active', index)
			emit('tab-click', { model, label })
		}

		return () => {
			const { active } = props

			return (
				<>
					<Gradients type="border" />
					<a-card bodyStyle={{ padding: '10px 15px' }}>
						<ul class={style['navbar_tabs_wrap']}>
							{unref(list).map((item, i) => (
								<li class={style['navbar_tabs_item']}>
									<div
										class={[style['navbar_tabs_button'], i === active && style['is-active']]}
										onClick={() => handleClick(item, i)}
									>
										<a-space>
											{item.icon && h(item.icon)}
											{item.label}
											{item.count}
										</a-space>
									</div>
								</li>
							))}
						</ul>
					</a-card>
				</>
			)
		}
	}
})
