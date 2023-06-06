<!--
 * @Author: iuukai
 * @Date: 2023-02-24 00:42:49
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-17 02:15:25
 * @FilePath: \gitsub\src\views\Repo\err.md
 * @Description:
 * @QQ/微信: 790331286
-->

- [] 目录路径有问题，github/gitee 是重定向的，当前不适合，应该改用自己专属的路由

```tree
|-- 仓库
|   |-- 文件夹
|   |   |-- 文件
```

# github 路径分多种

1. blob/分支 文件
2. tree/分支 目录

## 仓库主页内容 Portal

1. 标签
2. 目录
3. readme
4. 简介
5. 仓库成员、贡献者
6. 语言类型

### 仓库目录页内容 Tree

1. 如果存在 readme 就渲染

### 仓库文件页内容 Blob

1. 贡献者
2. 文件内容

```html
<template>
	<div>123</div>
</template>
```

## 优化

1. 锚点变更会重新调用请求
