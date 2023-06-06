<!--
 * @Author: iuukai
 * @Date: 2023-03-08 04:04:31
 * @LastEditors: iuukai
 * @LastEditTime: 2023-05-29 07:16:37
 * @FilePath: \gitsub\src\views\Repo\components\test.md
 * @Description:
 * @QQ/微信: 790331286
-->

```jsx
<a-list-item
 v-slots={{
  default: () => (
   <a-space size={10}>
    {h(icon, iconProps)}
    <a onClick={() => emit('file-click', item)} title={item.name}>
     {item.name}
    </a>
   </a-space>
  ),
  actions: () => (
   <>
    <a key="list-loadmore-edit">edit</a>
    <a key="list-loadmore-more">more</a>
   </>
  )
 }}
></a-list-item>
```

```jsx
<a-list-item>
 <a-row gutter={10} class={style['list-item_wrap']}>
  <a-col span={8}>
   <a-space size={10}>
    {h(icon, iconProps)}
    <a onClick={() => emit('file-click', item)} title={item.name}>
     {item.name}
    </a>
   </a-space>
  </a-col>
  <a-col span={13}></a-col>
  <a-col span={3} style={{ textAlign: 'right' }}>
   大小|下载|删除
  </a-col>
 </a-row>
</a-list-item>
```
