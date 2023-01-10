// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./../../dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---index-mdx": () => import("./../../../../index.mdx" /* webpackChunkName: "component---index-mdx" */),
  "component---pages-document-api-mdx": () => import("./../../../../pages/document/Api.mdx" /* webpackChunkName: "component---pages-document-api-mdx" */),
  "component---pages-test-i-18-n-mdx": () => import("./../../../../pages/test/i18n.mdx" /* webpackChunkName: "component---pages-test-i-18-n-mdx" */),
  "component---readme-md": () => import("./../../../../readme.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-pages-404-js": () => import("./../../../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

