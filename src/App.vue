<!--
 * @Author: iuukai
 * @Date: 2022-10-21 00:44:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-08-05 05:29:05
 * @FilePath: \gitsub\src\App.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<script setup>
import { ConfigProvider } from 'ant-design-vue'
import { useLocale } from '@/locales/useLocale'

const { getAntdLocale } = useLocale()
</script>

<template>
	<ConfigProvider :locale="getAntdLocale">
		<router-view v-slot="{ Component }">
			<transition name="fade-page" mode="out-in" appear>
				<component :is="Component" />
			</transition>
		</router-view>
	</ConfigProvider>
</template>

<style lang="less"></style>
