import { defineComponent, h, Fragment, reactive, watch, toRaw } from 'vue'
import { useRepoStore } from '@/store/modules/repo'
import { toUpper, sum, round, isEmpty } from 'lodash-es'

import {
	FileTextOutlined,
	ExclamationCircleOutlined,
	UserOutlined,
	HistoryOutlined
} from '@ant-design/icons-vue'
import style from './components.module.less'

export default defineComponent({
	props: {},
	setup() {
		const { details, events, contributors, releases, releasesTotal, languages } = useRepoStore()
		const latestReleases = releases[0]
		const white = [
			{ type: null, template: '' },
			{ type: 'CreateEvent', template: '' },
			{ type: 'PushEvent', template: '' },
			{ type: 'PullRequestEvent', template: '' },
			{ type: 'IssueCommentEvent', template: '' },
			{ type: 'IssuesEvent', template: '' },
			{ type: 'DeleteEvent', template: '' }
		]
		const repoEvents = events.filter(item => white.find(({ type }) => type === item.type))

		const showLen = 6
		const isSameLen = languages.length === showLen
		const repoLanguages = languages.slice(0, showLen)
		const curSum = sum(repoLanguages.map(item => parseFloat(item.ratio)))
		console.log(repoLanguages, curSum)

		const arr = languages.reduce((res, cur, i) => {
			const curSum = sum(res.map(item => parseFloat(item.ratio)))
			const Other = res.find(item => item.label === 'Other')
			// 如果是末项，则直接把所有堆到 Other
			if (!Other) {
				if (curSum > 98.5) {
					// 还需要判断是否是最后一个

					if (i === languages.length - 1) {
						res.push(cur)
					} else {
						res.push({
							label: 'Other',
							value: 0,
							ratio: round(100 - curSum, 1).toFixed(1) + '%',
							color: '#ededed'
						})
					}
				} else {
					if (i < showLen - 1) {
						res.push(cur)
					} else {
						if (isSameLen) {
							res.push(cur)
						} else {
							res.push({
								label: 'Other',
								value: 0,
								ratio: round(100 - curSum, 1).toFixed(1) + '%',
								color: '#ededed'
							})
						}
					}
				}
			}

			return res
		}, [])

		const state = reactive({
			isHasReadme: true,
			isHasLicense: true
		})

		const handleScrollTo = () => {}
		return () => {
			return (
				<div class={style['repo-profile']} style={{ top: '80px' }}>
					<Gradients type="border" />
					<a-card bodyStyle={{ padding: '15px' }}>
						{!isEmpty(details) && (
							<>
								<a-typography-title level={3}>简介</a-typography-title>
								<div>
									<div>
										<a-typography-text type="secondary">
											{details.description || 'No description, website, or topics provided.'}
										</a-typography-text>
									</div>
									<div>
										<a-typography-link href={details.homepage} target="_blank">
											{details.homepage}
										</a-typography-link>
									</div>
									<div class="tag-group">
										{(details.topics || details.project_labels).map(item => (
											<a-tag color="blue">{item.name || item}</a-tag>
										))}
									</div>
									{state.isHasReadme && <div onClick={handleScrollTo}>Readme</div>}
									{details.license && state.isHasLicense && <div>License</div>}
									<div>Stars: {details.stargazers_count}</div>
									<div>Watching: {details.subscribers_count}</div>
									<div>Forks: {details.network_count}</div>
								</div>
							</>
						)}
						{
							<>
								<a-divider />
								<a-typography-title level={3}>
									<a-space>
										<span>发行版</span>
										{!isEmpty(releasesTotal) && <span>({releasesTotal})</span>}
									</a-space>
								</a-typography-title>
								{!isEmpty(latestReleases) ? (
									<div>
										{latestReleases.name}
										<a-tag color="green">Latest</a-tag>
										<div>
											<time
												datetime={latestReleases.published_at}
												title={latestReleases.published_at}
											>
												{latestReleases.published_at}
											</time>
										</div>
										<div>
											<a>+ {releasesTotal - 1} releases</a>
										</div>
									</div>
								) : (
									<a-empty description="暂无发行版" />
								)}
							</>
						}
						{!isEmpty(contributors) && (
							<>
								<a-divider />
								<a-typography-title level={3}>贡献者</a-typography-title>
								<a-avatar-group max-count={10}>
									{contributors.map(user => (
										<a-popover
											v-slots={{
												// title: () => <div>title</div>,
												content: () => (
													<div>
														<div>name: {user.login || user.name}</div>
														<div>email: {user.email}</div>
													</div>
												)
											}}
											placement="top"
										>
											<a-avatar
												src={user.avatar_url}
												v-slots={{
													icon: () =>
														(user.login || user.name)
															.split(/\s/)
															.map(str => toUpper(str.charAt()))
															.join('')
												}}
											></a-avatar>
										</a-popover>
									))}
								</a-avatar-group>
							</>
						)}
						{!isEmpty(languages) && (
							<>
								<a-divider />
								<a-typography-title level={3}>语言</a-typography-title>
								<div class={style['progress']}>
									{arr.map(lang => (
										<div
											class={style['progress-item']}
											style={{
												width: lang.ratio,
												backgroundColor: lang.color
												// outline: '2px solid #0000'
											}}
										></div>
									))}
								</div>
								<ul>
									{arr.map(lang => (
										<li style={{ display: 'inline' }}>
											<a-badge color={lang.color} text={`${lang.label} ${lang.ratio}`} />
										</li>
									))}
								</ul>
							</>
						)}
					</a-card>
				</div>
			)
		}
	}
})
