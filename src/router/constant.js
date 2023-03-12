/*
 * @Author: iuukai
 * @Date: 2022-10-21 06:49:43
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-02 15:15:31
 * @FilePath: \gitsub\src\router\constant.js
 * @Description:
 * @QQ/微信: 790331286
 */
// 命名路由
export const homeNamedRoutePath = '/:type'
export const namedRoutePath = ':owner'
export const namedRouteParam = 'owner'
export const namedRouteName = 'Home'

export const defaultRoutePath = '/'

export const LOGIN_NAME = 'Login'

export const REDIRECT_NAME = 'Redirect'

export const PARENT_LAYOUT_NAME = 'ParentLayout'

export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

// 路由白名单
export const whiteNameList = [LOGIN_NAME, 'Error404'] // no redirect whitelist
