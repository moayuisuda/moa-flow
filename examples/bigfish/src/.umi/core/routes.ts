// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/dennis.zhang/Desktop/其它代码库/moa-flow/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('/Users/dennis.zhang/Desktop/其它代码库/moa-flow/examples/bigfish/src/.umi/plugin-layout/Layout.tsx').default,
    "routes": [
      {
        "path": "/",
        "redirect": "/home",
        "exact": true
      },
      {
        "name": "首页",
        "path": "/home",
        "component": require('/Users/dennis.zhang/Desktop/其它代码库/moa-flow/examples/bigfish/src/pages/Home').default,
        "exact": true
      },
      {
        "name": "权限演示",
        "path": "/access",
        "component": require('/Users/dennis.zhang/Desktop/其它代码库/moa-flow/examples/bigfish/src/pages/Access').default,
        "exact": true
      },
      {
        "name": " CRUD 示例",
        "path": "/table",
        "component": require('/Users/dennis.zhang/Desktop/其它代码库/moa-flow/examples/bigfish/src/pages/Table').default,
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
