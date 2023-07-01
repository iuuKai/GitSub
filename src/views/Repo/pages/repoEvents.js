/*
 * @Author: iuukai
 * @Date: 2023-06-22 02:00:06
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-22 03:30:55
 * @FilePath: \gitsub\src\views\Repo\pages\repoEvents.js
 * @Description:
 * @QQ/微信: 790331286
 */
const typeMap = [
	{ model: 'CreateEvent', label: '创建了新的仓库、分支、标签等' },
	{ model: 'PushEvent', label: '提交了新的代码、分支' },
	{ model: 'PullRequestEvent', label: '发起了新的合并请求' },
	{ model: 'ForkEvent', label: '跟随了一个仓库' },
	{ model: 'WatchEvent', label: '关注了一个仓库' },
	{ module: 'IssuesEvent', label: '新建了一个问题，或对某个问题做了更改' },
	{ model: 'IssueCommentEvent', label: '对某个问题进行了评论' },
	{ model: 'DeleteEvent', label: '删除了某个分支或标签' },
	{ module: null, label: '仓库动态无法识别，可能是同步了仓库' }
]
