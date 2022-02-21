# 运行

现在是简陋的 monorepo ，之后会迁移

```
// 先安装package的依赖

cd src/packages/flow
tnpm i
npm link

// 再安装测试项目的依赖

cd ../../../
tnpm i
npm link flow

// 运行
tnpm run dev
```
