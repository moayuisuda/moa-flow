// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./../../dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---index-mdx": () => import("./../../../../index.mdx" /* webpackChunkName: "component---index-mdx" */),
  "component---pages-docs-alert-mdx": () => import("./../../../../pages/docs/Alert.mdx" /* webpackChunkName: "component---pages-docs-alert-mdx" */),
  "component---readme-md": () => import("./../../../../readme.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-pages-404-js": () => import("./../../../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

