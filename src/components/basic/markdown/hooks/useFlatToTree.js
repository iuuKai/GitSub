/*
 * @Author: iuukai
 * @Date: 2023-05-16 22:07:52
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-17 04:23:29
 * @FilePath: \gitsub\src\components\basic\markdown\hooks\useFlatToTree.js
 * @Description:
 * @QQ/微信: 790331286
 */
import { onUnmounted } from 'vue'
import { isArray } from 'lodash-es'

export function useFlatToTree(flatList) {
	const treeList = []
	const config = { key: 'href', level: 'level' }
	const mark = {
		// 当前层级
		curDeep: 0,
		// 目标层级
		targetDeep: null,
		// 当前父
		parentObj: null,
		// 映射数组
		maps: []
	}

	const clearMark = () => {
		mark.curDeep = 0
		mark.targetDeep = null
		mark.parentObj = null
		mark.maps.length = 0
		treeList.length = 0
	}

	arrFlatToTree(flatList, treeList, mark, config)

	onUnmounted(() => {
		clearMark()
	})

	return {
		treeList
	}
}

function arrFlatToTree(arr, newArr, mark, config) {
	if (!isArray(arr) || !arr.length) return
	arr.forEach(item => loopPush(newArr, item, mark, config))
}

/**
 * @param {array} tree - tree数组。需要填充数据的容器
 * @param {object} raw - 需要填充的数据
 * @param {object} config - key: string 标识; level: number|strinig 标题的级数 (h1-h6)
 */
function loopPush(tree, raw, mark, config = {}) {
	if (!isArray(tree) || !raw) return

	// 解构
	const { parentObj, curDeep, targetDeep, maps } = mark
	const { key, level } = config
	const k = key || 'href'
	const l = level || 'level'

	// 存在 targetDeep 说明需要递归查找
	if (targetDeep) {
		// 如果 curDeep 与 targetDeep 不等，则继续递归
		if (curDeep !== targetDeep) {
			// 当前层末尾项作为 parentObj, 递归其 children
			const lastObj = tree[tree.length - 1]
			mark.parentObj = lastObj
			// 递归进入下一层
			mark.curDeep++
			return loopPush(lastObj.children, raw, mark, config)
		} else {
			// 关闭 targetDeep
			mark.targetDeep = null
			// 重新递归，执行数据填充
			return loopPush(tree, raw, mark, config)
		}
	} else {
		// 处理数据，当前数据，作为 child 子项，并且增加 children 方便后继其子级的填充
		const childObj = Object.assign({ children: [] }, raw)
		const isFindMap = maps.find(map => map[k] === childObj[k])
		// 当前映射项
		const mapItem = isFindMap || { [k]: childObj[k], [l]: childObj[l], deep: curDeep }

		// 记录当前映射项
		!isFindMap && maps.push(mapItem)

		if (tree.length) {
			/**
			 * 只有第一个判断条件 (childObj.level > parentObj.level) 才进行 push 操作
			 * 其余条件则执行递归，直到当前子确实大于当前父，为父子关系
			 */
			if (childObj[l] > parentObj[l]) {
				// 子等级大于父等级，即为父的子

				parentObj.children.push(childObj)
				// 每push一层，curDeep 就要增加 1，作为当前 childObj 的 deep 层数
				mark.curDeep++
				// 并且，当前子，作为下次的父
				mark.parentObj = childObj
				// 修改当前映射的 deep 等于当前 deep 层数
				mapItem.deep = mark.curDeep
			} else if (childObj[l] < parentObj[l]) {
				// 子等级小于父等级，即子 deep 层级比当前父大（即当前子可能是当前父的父...）

				// 映射数组从右向左，找到最接近并且小于当前子等级的映射项
				const p = maps.reverse().find(item => item[l] < childObj[l])
				// reverse 会改变原数组，所以需要再次执行，还原顺序，这样后继 push 操作才不会有问题
				maps.reverse()

				if (p) {
					// 找到的映射项，则把其 deep 层级，作为 targetDeep，初始 curDeep，开始递归

					mark.targetDeep = p.deep
					mark.curDeep = 0
					return loopPush(tree, childObj, mark, config)
				} else {
					// 如果找不到父，说明是最顶级，直接push
					tree.push(childObj)
					// push后，所以其层级为 1
					mark.curDeep = 1
					mark.parentObj = childObj
					mapItem.deep = mark.curDeep
				}
			} else {
				// 如果当前子的等级 等于 当前父的等级，说明它俩是同级，同父

				// 如果层级大于 1，则需要递归找其父
				if (curDeep > 1) {
					// 目标层为当前层-1
					mark.targetDeep = curDeep - 1
					// 重置当前层
					mark.curDeep = 0
					// 递归
					return loopPush(tree, raw, mark, config)
				} else {
					tree.push(childObj)
				}
			}
		} else {
			// 空数组，直接push
			tree.push(childObj)
			// push后，进入下一层
			mark.curDeep++
			// 当前子，作为下次的父
			mark.parentObj = childObj
			// 修改当前映射的 deep 等于当前 deep 层数
			mapItem.deep = mark.curDeep
		}
	}
}
