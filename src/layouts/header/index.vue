<!--
 * @Author: iuukai
 * @Date: 2022-11-09 07:45:30
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-30 18:44:42
 * @FilePath: \gitsub\src\layouts\header\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<Layout.Header class="layout-header">
		<Row align="middle" justify="space-between">
			<Logo link size="large" />
			<Space>
				<Button @click="router.push('/')">Home</Button>
				<Button @click="router.push('/about')">About</Button>
			</Space>
			<Space :size="20">
				<LocalePicker size="middle" :trigger="['click']" />
				<ThemeSwitch />
				<Dropdown class="layout-header-avatar" placement="bottomRight">
					<Avatar :src="avatar" :alt="user" />
					<template #overlay>
						<Menu>
							<Menu.Item @click="$router.push({ name: 'account-about' })">个人中心</Menu.Item>
							<Menu.Item @click="$router.push({ name: 'Home', params: { owner: 'X4' } })">
								我的主页
							</Menu.Item>
							<Menu.Item @click="$router.push({ name: 'account-about' })">关于</Menu.Item>
							<Menu.Item @click="$router.push({ name: 'account-settings' })">设置</Menu.Item>
							<Menu.Divider />
							<Menu.Item>
								<div @click.prevent="doLogout">
									<PoweroffOutlined />
									退出登录
									<!-- {{ $t('layout.header.dropdownItemLoginOut') }} -->
								</div>
							</Menu.Item>
						</Menu>
					</template>
				</Dropdown>
			</Space>
		</Row>
	</Layout.Header>
</template>

<script setup>
import { Layout, Row, Space, Dropdown, Avatar, Menu, Modal, Button } from 'ant-design-vue'
import { PoweroffOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { LocalePicker } from '@/components/basic/locale-picker'
import { ThemeSwitch } from '@/components/basic/theme-switch'
import { Logo } from '@/layouts/logo'

import { computed, nextTick, h } from 'vue'
import { useRouter } from 'vue-router'
import { message as $message } from 'ant-design-vue'
import { useAccountStore } from '@/store/modules/account'
import { useI18n } from '@/hooks/useI18n'
import { LOGIN_NAME } from '@/router/constant'

const { t } = useI18n()
const router = useRouter()
const accountStore = useAccountStore()

const avatar = computed(() => accountStore.getAvatar)
const user = computed(() => accountStore.getLoginName)

// 退出登录
const doLogout = e => {
	Modal.confirm({
		title: t('message.logout.title'),
		icon: h(QuestionCircleOutlined),
		centered: true,
		onOk: async () => {
			// 可能因为 vueuse - useUrlSearchParams 的关系， useRoute 并未响应更新
			const redirect = location.href.replace(location.origin, '')
			// 退出并记录当前路由
			await accountStore.logout({ redirect })
			// localStorage.clear()
			$message.success(t('message.logout.success'))
			await nextTick()
			// location.reload()
			router.replace({ name: LOGIN_NAME })
		}
	})
}
</script>

<style lang="less" scoped>
.layout-header {
	@apply bg-transparent overflow-hidden z-10;
	@apply bg-white bg-opacity-70 dark:(bg-dark-400 bg-opacity-70) backdrop-filter backdrop-blur-md;
	@apply shadow-md shadow-dark-50/10 dark:shadow-dark-900/50;

	.layout-header-avatar {
		@apply cursor-pointer select-none;
	}
}
</style>
