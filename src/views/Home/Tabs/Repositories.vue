<!--
 * @Author: iuukai
 * @Date: 2022-12-28 00:13:22
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-04 17:34:50
 * @FilePath: \gitsub\src\views\Home\Tabs\Repositories.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="repo_list_main">
		<template v-if="!isLoading">
			<template v-if="repos.length">
				<a-card class="repo_item" v-for="item in repos" :key="item.id">
					<a-row>
						<a-col :span="18">
							<a-space direction="vertical" :size="5">
								<a-row>
									<a-space>
										<a-typography-title class="repo_title" :level="4">
											<a @click="handleClick(item.full_name)">{{ item.name }}</a>
										</a-typography-title>
										<a-tag>{{ item.visibility ?? item.public }}</a-tag>
									</a-space>
								</a-row>
								<a-row v-if="item.fork && item.parent">
									<span>
										Forked from
										<a @click="handleClick(item.parent.full_name)">
											{{ item.parent.full_name }}
										</a>
									</span>
								</a-row>
								<a-row>
									<a-typography-text type="secondary">{{ item.description }}</a-typography-text>
								</a-row>
								<a-row>
									<a-space :size="20">
										<a-space v-if="item.language && colors[item.language]" :size="5">
											<span
												class="repo-language-color"
												:style="{ background: colors[item.language]?.color }"
											></span>
											<a-typography-text type="secondary">{{ item.language }}</a-typography-text>
										</a-space>
										<a-typography-text v-if="item.license && item.license.name" type="secondary">
											{{ item.license.name }}
										</a-typography-text>
										<a-typography-text type="secondary">
											<time>Updated {{ dayjs(item.pushed_at).from() }}</time>
										</a-typography-text>
									</a-space>
								</a-row>
							</a-space>
						</a-col>
						<a-col :span="6"></a-col>
					</a-row>
				</a-card>

				<!-- 页面切换 -->
				<a-row>
					<a-button type="link" :disabled="isPrevDisabled" @click="handlePageChange(-1)">
						<LeftOutlined />
						Previous
					</a-button>
					<a-button type="link" :disabled="isNextDisabled" @click="handlePageChange(+1)">
						Next
						<RightOutlined />
					</a-button>
				</a-row>
			</template>
			<template v-else>
				<!-- 空状态 -->
				<a-card>
					<a-empty :description="description" />
				</a-card>
			</template>
		</template>

		<template v-else>
			<!-- 骨架屏 -->
			<a-card class="repo_item" v-for="num in skeletonLen" :key="num">
				<a-skeleton active />
			</a-card>
			<a-row>
				<a-button type="link" disabled>
					<LeftOutlined />
					Previous
				</a-button>
				<a-button type="link" disabled>
					Next
					<RightOutlined />
				</a-button>
			</a-row>
		</template>
	</div>
</template>

<script setup>
import { reactive, toRefs, computed, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { message as $message } from 'ant-design-vue'
import { useDayjs } from '@/hooks/useDayjs'
import { useRoute, useRouter } from 'vue-router'
import { useUrlSearchParams } from '@vueuse/core'
import { useOwnerStore } from '@/store/modules/owner'
import { useRepoStore } from '@/store/modules/repo'
import colors from '@/utils/colors.json'

const dayjs = useDayjs()
const route = useRoute()
const router = useRouter()
const repoStore = useRepoStore()
const ownerStore = useOwnerStore()
const query = useUrlSearchParams('history')

const state = reactive({
	isLoading: false,
	isPrevDisabled: computed(() => state.params.page === 1),
	isNextDisabled: computed(() => state.params.page * state.params.per_page >= state.total),
	repos: [],
	params: {
		page: (query.page ?? 1) / 1,
		per_page: 10,
		sort: 'pushed'
	},
	total: computed(() => ownerStore.getReposTotal),
	totalPage: computed(() => Math.ceil(state.total / state.params.per_page)),
	lastLen: computed(() => state.total % state.params.per_page),
	skeletonLen: computed(() =>
		state.params.page <= state.totalPage ? state.params.per_page : state.lastLen
	),
	description: computed(() => `${route.params.owner} doesn’t have any public repositories yet.`)
})
const {
	isLoading,
	isPrevDisabled,
	isNextDisabled,
	repos,
	params,
	total,
	skeletonLen,
	description
} = toRefs(state)

// 用户输多页面时是否处理
// const totalPage = computed(() => Math.ceil(state.total / state.params.per_page))
// let cachePage = state.params.page

watch(
	() => state.params.page,
	val => {
		query.page = val > 1 ? val : null

		// router.replace({ query: { ...route.query, page: val ?? 1 } })
	}
)

getRepoList()
async function getRepoList() {
	// 无数据不请求
	if (!state.total) return

	state.isLoading = true
	try {
		const data = await ownerStore.apiGetRepoList(state.params)
		state.repos = data
	} catch (err) {
		console.log('[ err ] >', err)
		$message.error(err.message)
		Promise.reject(err)
	}
	state.isLoading = false
}

function handlePageChange(goPage) {
	state.params.page += goPage
	getRepoList()
}

function handleClick(path) {
	router.push(path)
}
</script>

<style lang="less" scoped>
.repo_item {
	& ~ .repo_item {
		margin-top: 10px;
	}

	.repo_title {
		margin-bottom: 0;
	}

	.repo-language-color {
		position: relative;
		top: 1px;
		display: inline-block;
		width: 12px;
		height: 12px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}
}
</style>
