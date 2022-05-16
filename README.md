运行：

```
// 如果已经有了ayarn和lerna可以跳过
tnpm i lerna ayarn -g

lerna bootstrap

lerna run watch --parallel // 监听flow包的更改以便于重新build

lerna run start --parallel // 运行示例项目
```
