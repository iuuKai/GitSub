/*
 * @Author: iuukai
 * @Date: 2023-03-08 06:04:06
 * @LastEditors: iuukai
 * @LastEditTime: 2023-06-13 00:11:22
 * @FilePath: \gitsub\src\hooks\useDayjs.js
 * @Description:
 * @QQ/微信: 790331286
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

export function useDayjs() {
	// console.log(langEN)
	const customFrom = time => {
		const now = dayjs()
		const diffInMs = now.diff(dayjs(time))
		const diffInDays = now.diff(dayjs(time), 'day')

		// 小于 1 分钟
		if (diffInMs < 60000) {
			return 'just now'
		}

		// 小于 1 小时
		if (diffInMs < 3600000) {
			return `${now.to(dayjs(time), true)} ago`
		}

		// 小于 1 天（但不是昨天）
		if (diffInDays < 1) {
			return `${now.to(dayjs(time), true)} ago`
		}

		// 昨天
		if (diffInDays === 1) {
			return 'yesterday'
		}

		// 小于 1 星期
		if (diffInDays < 7) {
			return `${dayjs(time).format('dddd')}`
		}

		// 小于 1 年
		if (diffInDays < 365) {
			return dayjs(time).format('MMM D')
		}

		return dayjs(time).format('MMM D, YYYY')
	}

	const setLocale = lang => dayjs.locale(/^zh/.test(lang) ? 'zh-cn' : 'en')

	return dayjs
}
