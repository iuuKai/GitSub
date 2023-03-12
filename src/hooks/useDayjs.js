/*
 * @Author: iuukai
 * @Date: 2023-03-08 06:04:06
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-08 06:04:25
 * @FilePath: \gitsub\src\hooks\useDayjs.js
 * @Description:
 * @QQ/微信: 790331286
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function useDayjs() {
	return dayjs
}
