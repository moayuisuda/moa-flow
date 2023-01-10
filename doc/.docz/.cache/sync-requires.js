const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/.cache/dev-404-page.js"))),
  "component---index-mdx": hot(preferDefault(require("/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/index.mdx"))),
  "component---pages-document-api-mdx": hot(preferDefault(require("/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/pages/document/Api.mdx"))),
  "component---readme-md": hot(preferDefault(require("/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/readme.md"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/src/pages/404.js")))
}

