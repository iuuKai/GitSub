/*
 * @Author: iuukai
 * @Date: 2022-10-27 09:21:59
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-16 00:26:56
 * @FilePath: \gitsub\src\views\Login\login-main.jsx
 * @Description:
 * @QQ/微信: 790331286
 */
import { defineComponent, Transition, h, reactive, toRefs, watch, onMounted, computed } from 'vue'
import { IconFont } from '@/components/basic/iconfont'
import { Lottie } from '@/components/basic/lottie'
import { Logo } from '@/layouts/logo'
import { message as $message } from 'ant-design-vue'
import { Common } from '@/config/index'
import { toLower } from 'lodash-es'
import { useI18n } from '@/hooks/useI18n'
import { useAccountStore } from '@/store/modules/account'
import { useUrlSearchParams } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import style from './login.module.less'

const isGitee = str => toLower(str) === 'gitee'

export default defineComponent({
	props: {
		isLightImage: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const { t } = useI18n()
		const route = useRoute()
		const router = useRouter()
		const accountStore = useAccountStore()
		const query = useUrlSearchParams('history')
		const lotties = Common.lottieJSON
		const redirect_uri = location.href.replace(location.search, '')

		const state = reactive({
			isWaiting: false,
			isTokenValid: computed(() => accountStore.getTokenValid),
			activeKey: '0',
			inputToken: '',
			code: computed({
				get() {
					return query.code
				},
				set(v) {
					query.code = v
				}
			}),
			type: computed({
				get() {
					return query.type ? query.type : accountStore.getType ?? 'github'
				},
				set(v) {
					query.type = isGitee(v) ? v : null
					accountStore.setType(v)
				}
			}),
			errMsg: computed({
				get() {
					return query.error_description && t('message.login.denied')
				},
				set(v) {
					query.error = query.error_description = query.error_uri = v
				}
			}),
			// 重定向里匹配到的类型
			targetType: computed(() => {
				if (query.redirect && /github|gitee/.test(query.redirect.split('/').filter(Boolean)[0])) {
					return query.redirect.split('/').filter(Boolean)[0]
				} else {
					return ''
				}
			})
		})
		const { activeKey, inputToken, code, type } = toRefs(state)

		function handleSwitch(val) {
			// 取反
			state.type = isGitee(val) ? 'github' : 'gitee'
			// 切换重置
			state.activeKey = '0'
			state.inputToken = ''
			state.code = null
		}

		async function hanleClick() {
			const msgKey = 'login'
			const msgDuration = 0
			// 输入令牌直接登录
			const isLogin = state.activeKey === '1'
			// 已有登录，或等待状态，或输入令牌登录但是无值时的报错提示
			if (state.isTokenValid || state.isWaiting || (isLogin && !state.inputToken)) {
				let errMsg = ''
				// 重复登录
				if (state.isTokenValid) errMsg = t('message.login.again')
				// 频繁操作
				else if (state.isWaiting) errMsg = t('message.login.frequent')
				// 不允许空值
				else errMsg = t('message.login.tokenEmpty')
				return $message.error(errMsg)
			} else {
				// 正在等待
				state.isWaiting = true
				!accountStore.getType && accountStore.setType(state.type)
				// 正在授权或正在登录
				const msg =
					!isLogin && !state.code ? t('message.login.authorizing') : t('message.login.logining')
				$message.loading({ content: msg, key: msgKey, duration: msgDuration })
				try {
					// 传 isLogin 区分前往授权或令牌直接登录
					const res = await login(isLogin, { redirect_uri, token: state.inputToken })
					if (!res) return
					state.isWaiting = false
					// 授权或登录成功
					$message.success({ content: t('message.login.success'), key: msgKey })
					// 跳转页面
					goPage()
				} catch (err) {
					state.isWaiting = false
					// 授权或登录失败
					$message.error({ content: err.message ?? err, key: msgKey })
				}
			}
		}

		function login(isLogin, params) {
			if (route.query.redirect) accountStore.setRedirect(route.query.redirect)
			return accountStore.login(isLogin, params)
		}

		function goPage() {
			setTimeout(() => {
				const redirect = accountStore.getRedirect
				router.replace(redirect || '/')
				accountStore.setRedirect(null)
			})
		}

		onMounted(async () => {
			if (state.code) {
				// 授权后，自动获取用户信息完成登录
				try {
					$message.loading({ content: t('message.login.logining'), key: 'login', duration: 0 })
					await login(false, { redirect_uri })
					$message.success({ content: t('message.login.success'), key: 'login' })
					goPage()
				} catch (err) {
					console.log('err', err)
					$message.error({ content: err.message ?? err, key: 'login' })
				}
				state.code = null
			}
			if (state.errMsg) {
				if (!query.redirect && accountStore.redirect) {
					query.redirect = accountStore.redirect
				}
				const msg = state.errMsg
				state.errMsg = null
				setTimeout(() => $message.error(msg), 1000)
			}
		})
		watch(
			[type, code],
			v => {
				if (!accountStore.getType) accountStore.setType(v[0])
				if (query.type !== accountStore.getType && isGitee(accountStore.getType)) {
					query.type = accountStore.getType
				}
				accountStore.setCode(v[1])
			},
			{ immediate: true }
		)

		/**
		 * components
		 */
		const formBox = () => (
			<a-card class={[style['login-form'], style[`is-${type.value}`]]}>
				<a-row justify="space-between" align="middle">
					<Logo border />
					<IconFont type="link" size={50} />
					<Transition name="fade" mode="out-in" appear>
						<IconFont key={type.value} type={type.value} data-type={type.value} size={80} />
					</Transition>
				</a-row>
				<a-tabs v-model:activeKey={activeKey.value} size="large">
					<a-tab-pane key="0" tab={t('component.login.btAuth.title')}>
						<a-button type="primary" block onClick={hanleClick}>
							{t('component.login.btAuth.button')}
						</a-button>
					</a-tab-pane>
					<a-tab-pane key="1" tab={t('component.login.byToken.title')} force-render>
						<a-input
							v-model:value={inputToken.value}
							placeholder={t('component.login.byToken.placeholder')}
						></a-input>
						<a-button type="primary" onClick={hanleClick}>
							{t('component.login.byToken.button')}
						</a-button>
					</a-tab-pane>
				</a-tabs>
			</a-card>
		)
		const switchBox = () =>
			lotties.map(item => (
				<div class={style['login-switch-box']}>
					<Lottie src={item.url} width={350} height={350} />
					<button class={style['login-switch-button']} onClick={() => handleSwitch(item.type)}>
						{t(isGitee(item.type) ? 'component.login.useGitHub' : 'component.login.useGitee')}
					</button>
				</div>
			))

		return () => {
			const { isLightImage } = props

			return (
				<main class={[style['login-main'], isLightImage && style['is-light-image']]}>
					{[formBox, switchBox].map(item => h(item))}
				</main>
			)
		}
	}
})
