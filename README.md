运行：

```
// 如果已经有了ayarn和lerna可以跳过
tnpm i lerna ayarn -g

lerna bootstrap

lerna run watch --parallel // 监听flow包的更改以便于重新build

lerna run start --parallel // 运行示例项目
```

## TODO

- 监听画布是否有除了 x,y 之外的变动 变动了的使用 requestIdleCallback 分片缓存
  - 方案一，定义所有会触发画布变动的行为，并且以事件通知缓存行为
  - 方案二，mobx 深度监听 canvasData 除了 x，y 之外的变动，autorun 缓存行为
- 大数据量下的多选性能，使用二级分区（空间换时间）
- 大数据两下的选择清空，会触发每一个节点的更新
