# `flow-infra`

> TODO: description

## Usage

```
// G的api文档：https://g-next.antv.vision/en/docs/api/basic/display-object，G的整体api是和svg一样的

import { Flow } from '@ali/flow-infra-g';

// 引用
<Flow
  width={800}
  height={800}
  canvasData={{
    scale: 1,
    x: 0,
    y: 0,
    cells: [
      {
        label: 'hello',
        id: 'TEST_NODE',
        component: 'CommonNode',
        cellType: 'node',
        x: 100,
        y: 100,
        ports: []
      },
    ],
  }}
/>
```

## TODO

- [ ] 监听画布是否有除了 x,y 之外的变动 变动了的使用 requestIdleCallback 分片缓存
  - [ ] 方案一，定义所有会触发画布变动的行为，并且以事件通知缓存行为
  - [ ] 方案二，mobx 深度监听 canvasData 除了 x，y 之外的变动，autorun 缓存行为
- [ ] 大数据量下的多选性能，使用二级分区（空间换时间）
- [ ] Portal 看有无更好的方案支持跨渲染器
