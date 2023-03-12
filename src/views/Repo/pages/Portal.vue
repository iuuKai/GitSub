<!--
 * @Author: iuukai
 * @Date: 2023-03-03 03:44:46
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-06 20:58:25
 * @FilePath: \gitsub\src\views\Repo\pages\Portal.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div>
		<a-row :gutter="16">
			<a-col :span="18">
				<Tree />
			</a-col>
			<a-col :span="6"></a-col>
		</a-row>
	</div>
</template>

<script setup>
import Tree from './Tree.vue'
</script>

<style lang="less" scoped></style>
