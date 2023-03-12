<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:13:03
 * @LastEditors: iuukai
 * @LastEditTime: 2022-12-28 00:13:03
 * @FilePath: \gitsub\src\views\Home\Tabs\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="overview_main">
		<a-card class="repo_card" v-for="num in 20" :key="num">
			概览
			<br />
			概览
			<br />
			概览
			<br />
			概览
		</a-card>
	</div>
</template>

<script setup></script>

<style lang="less" scoped>
@space: 10px;

.overview_main {
	@apply flex flex-wrap;

	.repo_card {
		width: calc((100% - @space) / 2);

		&:nth-child(2n) {
			margin-left: @space;
		}

		&:nth-child(n + 3) {
			margin-top: @space;
		}
	}
}
</style>
