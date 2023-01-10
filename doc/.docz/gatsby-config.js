const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Moa Flow Doc',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root:
          '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Moa Flow Doc',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc',
          templates:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/node_modules/docz-core/dist/templates',
          docz:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz',
          cache:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/.cache',
          app:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app',
          appPackageJson:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/package.json',
          appTsConfig:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/tsconfig.json',
          gatsbyConfig:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/gatsby-config.js',
          gatsbyBrowser:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/gatsby-browser.js',
          gatsbyNode:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/gatsby-node.js',
          gatsbySSR:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/gatsby-ssr.js',
          importsJs:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app/imports.js',
          rootJs:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app/root.jsx',
          indexJs:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app/index.jsx',
          indexHtml:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app/index.html',
          db:
            '/Users/admin/code/moa-flow/moa-fow-version-dom/moa-flow/doc/.docz/app/db.json',
        },
        include: ['pages', 'src', 'public', 'index.mdx', 'plugin'],
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
