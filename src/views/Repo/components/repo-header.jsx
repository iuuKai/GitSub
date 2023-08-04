/*
 * @Author: iuukai
 * @Date: 2023-03-04 15:18:39
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-14 13:21:51
 * @FilePath: \gitsub\src\views\Repo\components\repo-header.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, h, Fragment, reactive, watch } from 'vue'
import { TabBar } from '@/components/basic/tab-bar'
import {
	ReadOutlined,
	HddOutlined,
	StarOutlined,
	HomeOutlined,
	UserOutlined,
	DownOutlined,
	UnlockOutlined
} from '@ant-design/icons-vue'
import { useRepoStore } from '@/store/modules/repo'
import { isArray } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import style from './components.module.less'

export default defineComponent({
	name: 'RepoHeader',
	props: {},
	emits: ['breadcrumb-click'],
	setup(props, { emit }) {
		const route = useRoute()
		const router = useRouter()
		const repoStore = useRepoStore()

		const count = {
			issues: repoStore.issuesTotal
		}
		const state = reactive({
			activeKey: 0,
			tabs: [
				{ label: 'Code', icon: ReadOutlined },
				{ label: 'Issues', icon: HddOutlined, count: count['issues'] },
				{ label: 'Pull Requests' },
				{ label: 'Events', icon: StarOutlined },
				{ label: 'Contributors', icon: UserOutlined }
			]
		})

		watch(
			() => state.activeKey,
			k => {
				console.log(state.tabs[k])
				if (state.tabs[k].label === 'Issues') {
					router.push({ name: 'Issues' })
				}
			}
		)

		const { owner, repo, path } = route.params

		const breadcrumb = [
			{ breadcrumbName: '', icon: HomeOutlined },
			{
				breadcrumbName: owner,
				icon: UserOutlined,
				overlayList: [{ menu: '概况' }, { menu: '仓库' }, { menu: 'Stars' }]
			},
			{ breadcrumbName: repo, icon: null }
		].concat(
			['Content', 'Edit'].includes(route.name)
				? (isArray(path) ? path : path.split('/')).filter(Boolean).map(v => ({
						breadcrumbName: v
				  }))
				: []
		)

		return () => {
			return (
				<div class={style['git-project-header']}>
					<Gradients type="border" />
					<a-card bodyStyle={{ padding: '10px 15px' }}>
						<a-page-header
							style={{ padding: 0 }}
							v-slots={{
								title: () => h(Fragment, null, [h('a', owner), h('span', ' / '), h('a', repo)]),
								subTitle: () => 'This is a subtitle',
								breadcrumb: () => (
									<a-breadcrumb>
										{breadcrumb.map((item, i) => {
											const isNotLast = i < breadcrumb.length - 1
											return (
												<a-breadcrumb-item
													v-slots={
														item.overlayList && {
															overlay: () => (
																<a-menu>
																	{item.overlayList.map((over, index) => (
																		<a-menu-item key={index}>{over.menu}</a-menu-item>
																	))}
																</a-menu>
															)
														}
													}
													onClick={() => isNotLast && emit('breadcrumb-click', item)}
												>
													{h(
														isNotLast ? 'a' : Fragment,
														{
															class: isNotLast ? 'ant-breadcrumb-link' : ''
														},
														<>
															{item.icon && h(item.icon)}
															{item.breadcrumbName && h('span', null, item.breadcrumbName)}
														</>
													)}
												</a-breadcrumb-item>
											)
										})}
									</a-breadcrumb>
								),
								tags: () => <a-tag v-slots={{ icon: () => <UnlockOutlined /> }}>public</a-tag>,
								extra: () => (
									<a-space align="center" style={{ height: '100%' }}>
										<a-dropdown-button
											key="1"
											size="small"
											trigger={['click']}
											v-slots={{
												overlay: () => (
													<a-menu>
														<a-menu-item key="1">Submit and continue</a-menu-item>
													</a-menu>
												),
												icon: () => <DownOutlined />
											}}
										>
											Watch 300
										</a-dropdown-button>
										<a-dropdown-button
											key="2"
											size="small"
											trigger={['click']}
											v-slots={{
												overlay: () => (
													<a-menu>
														<a-menu-item key="1">Submit and continue</a-menu-item>
													</a-menu>
												),
												icon: () => <DownOutlined />
											}}
										>
											Fork 100
										</a-dropdown-button>
										<a-dropdown-button
											key="3"
											size="small"
											trigger={['click']}
											v-slots={{
												overlay: () => (
													<a-menu>
														<a-menu-item key="1">Submit and continue</a-menu-item>
													</a-menu>
												),
												icon: () => <DownOutlined />
											}}
										>
											Star 150
										</a-dropdown-button>
									</a-space>
								),
								default: () => (
									<TabBar
										tabs={state.tabs}
										activeKey={state.activeKey}
										onChange={val => (state.activeKey = val)}
									/>
								)
							}}
						></a-page-header>
					</a-card>
				</div>
			)
		}
	}
})
