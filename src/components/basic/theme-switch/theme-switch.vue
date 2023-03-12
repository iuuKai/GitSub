<!--
 * @Author: iuukai
 * @Date: 2022-10-22 23:50:35
 * @LastEditors: iuukai
 * @LastEditTime: 2022-10-23 01:42:32
 * @FilePath: \gitsub\src\components\basic\theme-switch\theme-switch.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<a-switch class="g-theme-switch">
		<template #checkedChildren><IconFont type="icon-sun" :size="14" /></template>
		<template #unCheckedChildren><IconFont type="icon-moon" :size="14" /></template>
	</a-switch>
</template>

<script setup>
import { IconFont } from '../iconfont'
defineProps({
	sunBgColor: {
		type: String,
		default: '#fff'
	},
	moonBgColor: {
		type: String,
		default: '#000'
	}
})
</script>

<style lang="less" scoped>
.g-theme-switch {
	background-color: v-bind('moonBgColor');
	&.ant-switch-checked {
		background-color: v-bind('sunBgColor');
	}
}
// 聚焦时的白色阴影
// .ant-switch-checked:focus {
//   box-shadow: 0 0 0 2px #e6f7ff;
// }
</style>
