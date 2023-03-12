/*
 * @Author: iuukai
 * @Date: 2023-01-02 16:44:40
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-02 16:48:22
 * @FilePath: \gitsub\src\utils\awaitTo.js
 * @Description:
 * @QQ/微信: 790331286
 */
// reference https://github.com/scopsy/await-to-js

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to(promise, errorExt) {
	return promise
		.then(data => [null, data])
		.catch(err => {
			if (errorExt) {
				const parsedError = Object.assign({}, err, errorExt)
				return [parsedError, undefined]
			}

			return [err, undefined]
		})
}

export default to
