/*
 * @Author: iuukai
 * @Date: 2023-02-15 11:39:12
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-09 09:42:03
 * @FilePath: \gitsub\src\utils\common.js
 * @Description:
 * @QQ/微信: 790331286
 */
/**
 * 字节单位换算
 * @param {*} bytes
 * @returns
 */
export function byteConvert(bytes) {
	if (isNaN(bytes)) {
		return ''
	}
	const symbols = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	let exp = Math.floor(Math.log(bytes) / Math.log(2))
	if (exp < 1) {
		exp = 0
	}
	const i = Math.floor(exp / 10)
	bytes = bytes / Math.pow(2, 10 * i)

	if (bytes.toString().length > bytes.toFixed(2).toString().length) {
		bytes = bytes.toFixed(2)
	}
	return `${bytes} ${symbols[i]}`
}

/**
 * 扁平化数据结构转树形结构
 * @param {String} child - 子标识
 * @param {String} parent - 父标识
 * returns Array
 */
export function arrFlatToTree(arr, { child = 'id', parent = 'pid' }) {
	if (!arr || !arr.length) return
	const result = []
	const itemMap = {}
	arr.forEach(item => {
		const id = item[child]
		const pid = item[parent]
		if (!itemMap[id]) {
			itemMap[id] = {
				children: []
			}
		}
		itemMap[id] = {
			...item,
			children: itemMap[id].children
		}
		const treeItem = itemMap[id]
		// 根据实际情况，这里顶级无pid，如果顶级 pid: 0，那就 pid === 0
		if (!pid) {
			result.push(treeItem)
		} else {
			if (!itemMap[pid]) {
				itemMap[pid] = {
					children: []
				}
			}
			itemMap[pid].children.push(treeItem)
		}
	})
	return result
}

/**
 * 转为普通flat结构：子标识 + 父标识
 * @param {String} child - 子标识
 * @param {String} parent - 父标识
 * returns Array
 */
export function fixFlatArr(arr, { child = 'id', parent = 'pid' }) {
	if (!arr || !arr.length) return
	// 根层级记录(当前层级只要大于其值皆为其后辈，后辈皆在该组处理，否则替换该值进行下一组)
	let rootLevel = 0
	// 作为暂时仓库(避免影响其他父根层级，分组先解决当前根层级之内，再去解决其他)，以列车命名，一趟趟出发
	let train = []
	return arr.reduce((res, cur, i, arr) => {
		// 解构浅拷贝防止影响原数据
		const item = { ...cur }
		if (train.length) {
			const prev = arr[i - 1]
			if (item.level > rootLevel) {
				/*
				 * 大于根层级则都为其后辈
				 */
				if (item.level > prev.level) {
					// 大于前项层级则为其后辈
					item[parent] = prev[child]
				} else if (item.level === prev.level) {
					// 等于前项层级则为其兄弟
					// 直接从仓库里拿末项的父即可
					item[parent] = train[train.length - 1][parent]
				} else {
					// 小于前项层级则为其父辈
					const find = train.find(r => r.level === item.level)
					item[parent] = find[parent]
				}
				train.push(item)
				if (i === arr.length - 1 && !res.length) res = [...train]
			} else {
				/*
				 * 小于根层级则为父或兄
				 */
				// 将集合填充进结果
				res.push(...train)
				if (i < arr.length - 1) {
					// 清空仓库，进行下一组
					train = []
					// 重置根层级记录
					rootLevel = item.level
					item[parent] = null
					train.push(item)
				} else {
					// 如果是末项，直接push
					res.push(item)
				}
			}
		} else {
			rootLevel = item.level
			item[parent] = null
			train.push(item)
		}
		return res
	}, [])
}
