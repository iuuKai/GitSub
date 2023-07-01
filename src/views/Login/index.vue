<!--
 * @Author: iuukai
 * @Date: 2022-10-21 06:51:48
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-15 11:10:42
 * @FilePath: \gitsub\src\views\Login\index.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<a-layout v-if="imgURL">
		<a-layout-content
			:class="['login_wrapper', { 'is-full-hover': isHovered, 'is-light-img': isLightImage }]"
		>
			<LoginHeader />
			<LoginMain ref="wrapEl" :isLightImage="isLightImage" />
			<!-- 全屏背景 -->
			<img id="full_image" ref="imgEl" :src="imgURL" @load="handleLoad" />
			<div class="mask"></div>
		</a-layout-content>
	</a-layout>
</template>

<script setup>
import { LoginHeader, LoginMain } from './components'

import { reactive, toRefs, watch } from 'vue'
import { getFullBanner } from '@/api/login'
import { useImageColor } from '@/hooks/useImageColor'
import { useElementHover, useUrlSearchParams } from '@vueuse/core'
import { useAccountStore } from '@/store/modules/account'

const state = reactive({
	imgEl: null,
	imgURL: '',
	wrapEl: null,
	isLightImage: false
})
const { imgEl, imgURL, wrapEl, isLightImage } = toRefs(state)

const accountStore = useAccountStore()
const query = useUrlSearchParams('history')
const { getImageColor, isLight } = useImageColor()
const isHovered = useElementHover(wrapEl)

if (accountStore.getRedirect) {
	query.redirect = accountStore.getRedirect
	// code 回调返回来时，会执行清空，得重新思考下
	// accountStore.setRedirect(null)
}

const handleLoad = e => {
	const rgb = getImageColor(state.imgEl)
	state.isLightImage = isLight(...rgb)
}

// 获取图片地址
getFullBanner().then(res => {
	const {
		images: [{ copyrightlink, url }]
	} = res
	const reg = /(http|https):\/\/([^/\r\n]+)(\/[^\r\n]*)?/
	const match = reg.exec(copyrightlink)
	const host = match ? `${match[1]}://${match[2]}` : ''
	state.imgURL = host + url
})
</script>

<style lang="less" scoped>
.login_wrapper {
  @apply relative h-screen overflow-hidden select-none z-0;

  &.is-full-hover {
    .mask {
      @apply backdrop-filter backdrop-blur-md;
    }

    #full_image {
      @apply transform scale-110;
    }
  }

  #full_image,
  .mask {
    @apply absolute top-0 left-0 w-full h-full -z-2 duration-1000;
  }

  #full_image {
    @apply object-cover;
  }

  .mask {
    background-color: rgba(0, 0, 0, .1);
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .5) 100%),
    radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, .3) 166%);
  }
}

</style>
