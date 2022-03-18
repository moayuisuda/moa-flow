运行：

```
// 如果已经有了ayarn和lerna可以跳过
tnpm i lerna ayarn -g

lerna bootstrap

lerna run watch --parallel // 监听flow包的更改以便于重新build

lerna run start --parallel // 运行示例项目
```

## TODO

- requestIdleCallback 分片缓存
- 大数据量下的多选性能，使用二级分区（空间换时间）
- 大数据两下的选择清空，会触发每一个节点的更新
- 缓存上一次 cache 的 imageData，下次如画布无更新则不用重新 cache
