<!--
 * @Author: iuukai
 * @Date: 2023-07-04 10:21:41
 * @LastEditors: iuukai
 * @LastEditTime: 2023-07-12 23:52:14
 * @FilePath: \gitsub\src\views\Repo\pages\Issues.vue
 * @Description: 
 * @QQ/微信: 790331286
-->
<template>
	<div class="issues_body">
		<Gradients type="border" />
		<a-card :style="{ marginBottom: '10px' }">
			<a-list
				v-if="route.params.number"
				class="comment-list"
				item-layout="horizontal"
				:data-source="comments"
				:loading="false"
			>
				<template #header>
					<a-typography-title v-html="issuesTitleFormat(details.title)"></a-typography-title>
				</template>
				<template #renderItem="{ item }">
					<a-list-item>
						<a-skeleton active avatar :loading="isCommentLoading">
							<a-comment :style="{ width: '100%' }">
								<template #actions>
									<template v-for="(v, k) in item.reactions" :key="k">
										<template v-if="!['total_count', 'url'].includes(k)">
											<span>
												<img
													class="emoji"
													:src="emojis[k === 'laugh' ? 'laughing' : k === 'hooray' ? 'tada' : k]"
												/>
												<span>{{ v }}</span>
											</span>
										</template>
									</template>
								</template>
								<template #author>
									<a>{{ item.user?.name || item.user.login }}</a>
									<a-tag v-if="item.user.login === details.user.login">楼主</a-tag>
									<a-tag v-else>{{ item.author_association }}</a-tag>
								</template>
								<template #avatar>
									<a-avatar size="large" :src="item?.user?.avatar_url" :alt="item?.user?.login" />
								</template>
								<template #content>
									<MarkDownPreview
										:isDark="isDark"
										:content="item.body"
										@copied="handleClickCopy"
										@link-before="handleClickLink"
									/>
								</template>
								<template #datetime>
									<a-tooltip :title="dayjs().format('YYYY-MM-DD HH:mm:ss')">
										<span>{{ dayjs().fromNow() }}</span>
									</a-tooltip>
								</template>
							</a-comment>
						</a-skeleton>
					</a-list-item>
				</template>
				<template #loadMore>
					<div
						v-if="!initCommentLoading && !isCommentLoading"
						:style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
					>
						<a-button @click="handleLoadMoreComments">loading more</a-button>
					</div>
				</template>
			</a-list>
			<template v-else>
				<a-list item-layout="horizontal" :data-source="issuses">
					<template #header>
						<a-tabs v-model:activeKey="activeKey">
							<a-tab-pane key="1" tab="Tab 1" />
							<a-tab-pane key="2" tab="Tab 2" />
							<a-tab-pane key="3" tab="Tab 3" />
						</a-tabs>
					</template>
					<template #renderItem="{ item }">
						<a-list-item>
							<a-list-item-meta>
								<template #title>
									<span v-if="item.pull_request">⭐</span>
									<a
										v-html="issuesTitleFormat(item.title)"
										@click="handleClickTitle(item.number)"
									></a>
									<span v-if="item.labels?.length">
										<a-tag v-for="label in item.labels" :color="`#${label.color}`">
											{{ label.name }}
										</a-tag>
									</span>

									<span v-if="item.task">
										<FileDoneOutlined />
										{{ item.task }} task
									</span>
								</template>
								<!-- <template #avatar>
								<a-avatar src="https://joeschmoe.io/api/v1/random" />
							</template> -->
								<template #description>
									<div>
										#{{ item.number }} {{ item.state }}
										<span
											v-if="item.closed_at"
											:title="dayjs(item.closed_at).format('MMM D, YYYY[, ]h:mm A [GMT]ZZ')"
										>
											{{ dayjs(item.closed_at).from() }}
										</span>
										<span
											v-else
											:title="dayjs(item.created_at).format('MMM D, YYYY[, ]h:mm A [GMT]ZZ')"
										>
											{{ dayjs(item.created_at).from() }}
										</span>
										by
										{{ item.user.name || item.user.login }}
										<span v-if="item.comments">
											<MessageOutlined />
											{{ item.comments }}
										</span>
										【{{ item?.pull_request?.merged_at }}】
									</div>
								</template>
							</a-list-item-meta>
						</a-list-item>
					</template>

					<template #footer>
						<div :style="{ textAlign: 'center' }">
							<a-pagination
								v-model:current="current"
								:total="queryIssues.total"
								:showSizeChanger="false"
								@change="handleIssuesPageChange"
							>
								<template #itemRender="{ type, originalElement }">
									<a v-if="type === 'prev'">
										<LeftOutlined />
										Previous
									</a>
									<a v-else-if="type === 'next'">
										Next
										<RightOutlined />
									</a>
									<component :is="originalElement" v-else></component>
								</template>
							</a-pagination>
						</div>
					</template>
				</a-list>
			</template>
		</a-card>
		<template v-if="route.params.number">
			<Gradients type="border" />
			<a-card>
				<a-typography-title :level="3">发表评论</a-typography-title>
				<a-comment>
					<template #avatar>
						<a-avatar :src="curUser.avatar_url" alt="Han Solo" />
					</template>
					<template #content>
						<a-form-item>
							<a-textarea v-model:value="value" :rows="4" />
						</a-form-item>
						<a-form-item>
							<a-button html-type="submit" type="primary">Add Comment</a-button>
						</a-form-item>
					</template>
				</a-comment>
			</a-card>
		</template>
	</div>
</template>

<script setup>
import {
	StarOutlined,
	MessageOutlined,
	FileDoneOutlined,
	LikeFilled,
	LikeOutlined,
	DislikeFilled,
	DislikeOutlined,
	LeftOutlined,
	RightOutlined
} from '@ant-design/icons-vue'
import { MarkDownPreview } from '@/components/basic/markdown'

import { reactive, toRefs, watch, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepoStore } from '@/store/modules/repo'
import { useThemeStore } from '@/store/modules/theme'
import { useAccountStore } from '@/store/modules/account'
import { useDayjs } from '@/hooks/useDayjs'
import emojis from '@/utils/emojis.json'
import { getRepoIssues, getRepoIssueComments } from '../script/repo-issues'

const route = useRoute()
const router = useRouter()
const dayjs = useDayjs()
const repoStore = useRepoStore()
const themeStore = useThemeStore()
const accountStore = useAccountStore()
const curUser = accountStore.getUserInfo

// 优先级priority 0 1 2 3 4

const state = reactive({
	isDark: computed(() => themeStore.getTheme === 'dark'),
	initCommentLoading: false,
	isCommentLoading: false,
	issuses: [],
	details: {},
	comments: [],
	queryIssues: {
		page: 1,
		per_page: 30,
		state: 'open',
		total: computed(() => repoStore.issuesTotal)
	},
	queryComments: {
		page: 1,
		per_page: 30
	}
})
const {
	isDark,
	initCommentLoading,
	isCommentLoading,
	issuses,
	details,
	comments,
	queryIssues,
	queryComments
} = toRefs(state)
const value = ref()
const current = ref(1)
const activeKey = ref(1)
// const initCommentLoading = ref(true)
// const isCommentLoading = ref(false)
const handleClickCopy = () => {}
const handleClickLink = () => {}
const handleIssuesPageChange = (page, pageSize) => {
	state.queryIssues.page = page
	getData()
}
const handleLoadMoreComments = () => {}

getData()
async function getData() {
	console.log(123)
	const { owner, repo, number } = route.params
	if (number) {
		state.initCommentLoading = true
		state.isCommentLoading = true
		const params = Object.assign(state.queryComments, { owner, repo, number })
		const list = await getRepoIssueComments(params)
		state.details = list[0]
		state.comments = list.flat()
		state.initCommentLoading = false
		state.isCommentLoading = false
	} else {
		const params = Object.assign(state.queryIssues, { owner, repo })
		const list = await getRepoIssues(params)
		state.issuses = list
	}
}

function handleClickTitle(number) {
	router.push({ params: { number } })
}

function issuesTitleFormat(title) {
	if (!title) return
	return title
		.replace(/(`{1,3})([^`]*)\1/g, (match, _, code) =>
			match ? `<code class="title-code">${code.trim()}</code>` : match
		)
		.replace(
			/:([\w\d]*):/g,
			(match, code) => `<img alt="${code}" class="emoji" src="${emojis[code]}" >`
		)
}
</script>

<style lang="less" scoped>
.issues_body {
	:deep(.title-code) {
		@apply m-0 py-2px px-1 rounded-md whitespace-pre-wrap bg-gray-200 dark:bg-dark-100;
	}

	:deep(h1) {
		@apply text-3xl;
	}

	:deep(h2) {
		@apply text-2xl;
	}

	:deep(h3) {
		@apply text-xl;
	}

	:deep(h4) {
		@apply text-base;
	}

	:deep(h5) {
		@apply text-sm;
	}

	:deep(h6) {
		@apply text-xs;
	}

	:deep(.ant-comment-avatar img) {
		@apply w-full h-full;
	}
}
</style>
