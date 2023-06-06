/*
 * @Author: iuukai
 * @Date: 2022-11-30 08:09:20
 * @LastEditors: iuukai
 * @LastEditTime: 2023-04-04 14:45:39
 * @FilePath: \gitsub\src\views\Home\components\owner-profile.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, computed, unref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useOwnerStore } from '@/store/modules/owner'
import style from './components.module.less'

export default defineComponent({
	name: 'OwnerProfile',
	props: {},
	setup(props) {
		const ownerStore = useOwnerStore()
		// 无需响应，否则切换的时候数据会先更新
		const userInfo = ownerStore.getOwnerInfo
		const isUser = ownerStore.isUser
		const iconSize = 40

		const user = (
			<div class={style['user_profile_wrap']}>
				<Gradients type="circle" borderWidth={6} class={style['user_profile_avatar']}>
					<a-avatar
						class={style['avatar']}
						src={unref(userInfo)?.avatar_url}
						alt={unref(userInfo)?.login}
						size={180}
						v-slots={{
							icon: () => <UserOutlined />
						}}
					></a-avatar>
				</Gradients>
				<a-typography-title class={style['no-margin']}>
					<a-typography-paragraph
						class={style['no-margin']}
						ellipsis
						title={unref(userInfo)?.name}
						content={unref(userInfo)?.name || ''}
					></a-typography-paragraph>
				</a-typography-title>
				<a-typography-title level={3} class={style['no-margin']}>
					<a-typography-paragraph
						class={style['no-margin']}
						ellipsis
						title={'@' + unref(userInfo)?.login}
						content={'@' + unref(userInfo)?.login}
					></a-typography-paragraph>
				</a-typography-title>
				<a-typography-paragraph
					class={style['no-margin']}
					ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
					content={unref(userInfo)?.bio || ''}
				></a-typography-paragraph>
				<a-space>
					<a-statistic title="followers" value={unref(userInfo)?.followers} />
					<a-statistic title="following" value={unref(userInfo)?.following} />
				</a-space>
				<a-divider />
				<a-space size={15}>
					<a href="">
						<IconFont type="gitee" size={iconSize} />
					</a>
					<a href="">
						<IconFont type="home" size={iconSize} />
					</a>
					<a href="">
						<IconFont type="weibo" size={iconSize} />
					</a>
					<a href="">
						<IconFont type="email" size={iconSize} />
					</a>
				</a-space>
			</div>
		)

		const org = <div>组织</div>

		return () => {
			return (
				<>
					<Gradients type="border" />
					<a-card>{isUser ? user : org}</a-card>
				</>
			)
		}
	}
})
