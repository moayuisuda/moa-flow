// 配置参考文档：https://bigfish.alipay.com/doc
import { defineConfig } from '@alipay/bigfish';
import routes from './routes';
import hybrid from './hybrid';

export default defineConfig({
  // 中台最佳实践，关于最佳实践更多文档查看 https://bigfish.antfin-inc.com/doc/console-intro
  appType: 'console',
  deployMode: 'assets',

  // 关闭 dva，对于比较简单的中台项目，我们推荐使用轻量级的全局数据共享方案即可
  dva: false,
  // 最佳实践中内置了 Layout，你也可以配置为 false 关闭它
  layout: {
    logo:
      'https://gw-office.alipayobjects.com/basement_prod/c83c53ab-515e-43e2-85d0-4d0da16f11ef.svg',
    name: 'Bigfish',
  },

  title: 'Bigfish',
  favicon: 'https://i.alipayobjects.com/common/favicon/favicon.ico',
  // 路由配置
  routes,
  // OneAPI 文档：https://yuque.antfin-inc.com/oneapi/doc/handbook
  oneApi: {
    apps: [
      {
        name: 'afs2demo', // OneAPI 应用名
      },
    ],
    typescript: true, // 每个接口的类型定义，自动生成，默认 false
  },
  // 接口代理配置
  proxy: {
    '/api': {
      target: 'http://oneapidemo.inc.alipay.net',
    },
  },
  // 九色鹿埋点：https://bigfish.antfin-inc.com/doc/advanced-log-monitor
  deer: {
    spmAPos: '',
  },
  ctoken: true,
  locale: {},
  nodeModulesTransform: {
    type: 'none',
  },
  // 提速方案配置
  // mfsu: {},  
  // Fast Refresh 热更新
  fastRefresh: {},
  // 提升构建时压缩速度，减少 oom
  esbuild: {},
  // 优化 moment 包大小
  ignoreMomentLocale: true,
  // 混合研发配置
  ...hybrid,
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/react/16.12.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.12.0/umd/react-dom.production.min.js',
  ],
});
