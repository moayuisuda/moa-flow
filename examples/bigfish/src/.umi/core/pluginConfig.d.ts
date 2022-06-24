// Created by Umi Plugin

export interface IConfigFromPlugins {
"404"?: boolean
appType?: string
routes?: {
/**
 * Any valid URL path
 */
path?: string
/**
 * A React component to render only when the location matches.
 */
component?: (string | (() => any))
wrappers?: string[]
/**
 * navigate to a new location
 */
redirect?: string
/**
 * When true, the active class/style will only be applied if the location is matched exactly.
 */
exact?: boolean
routes?: any[]
[k: string]: any
}[]
history?: {
type?: ("browser" | "hash" | "memory")
options?: {

}
}
polyfill?: {
imports?: string[]
}
alias?: {

}
analyze?: {
analyzerMode?: ("server" | "static" | "disabled")
analyzerHost?: string
analyzerPort?: any
openAnalyzer?: boolean
generateStatsFile?: boolean
statsFilename?: string
logLevel?: ("info" | "warn" | "error" | "silent")
defaultSizes?: ("stat" | "parsed" | "gzip")
[k: string]: any
}
/**
 * postcss autoprefixer, default flexbox: no-2009
 */
autoprefixer?: {

}
base?: string
chainWebpack?: (() => any)
chunks?: string[]
/**
 * more css-loader options see https://webpack.js.org/loaders/css-loader/#options
 */
cssLoader?: {
url?: (boolean | (() => any))
import?: (boolean | (() => any))
modules?: (boolean | string | {

})
sourceMap?: boolean
importLoaders?: number
onlyLocals?: boolean
esModule?: boolean
localsConvention?: ("asIs" | "camelCase" | "camelCaseOnly" | "dashes" | "dashesOnly")
}
cssModulesTypescriptLoader?: {
mode?: ("emit" | "verify")
}
cssnano?: {

}
copy?: any[]
define?: {

}
devScripts?: {

}
/**
 * devServer configs
 */
devServer?: {
/**
 * devServer port, default 8000
 */
port?: number
host?: string
https?: ({
key?: string
cert?: string
[k: string]: any
} | boolean)
headers?: {

}
writeToDisk?: (boolean | (() => any))
[k: string]: any
}
devtool?: string
/**
 * Code splitting for performance optimization
 */
dynamicImport?: {
/**
 * loading the component before loaded
 */
loading?: string
}
/**
 * Code splitting for import statement syntax
 */
dynamicImportSyntax?: {

}
exportStatic?: {
htmlSuffix?: boolean
dynamicRoot?: boolean
supportWin?: boolean
/**
 * extra render paths only enable in ssr
 */
extraRoutePaths?: (() => any)
}
externals?: ({

} | string | (() => any))
extraBabelIncludes?: any[]
extraBabelPlugins?: any[]
extraBabelPresets?: any[]
extraPostCSSPlugins?: any[]
/**
 * fork-ts-checker-webpack-plugin options see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options
 */
forkTSChecker?: {
async?: boolean
typescript?: (boolean | {

})
eslint?: {

}
issue?: {

}
formatter?: (string | {

})
logger?: {

}
[k: string]: any
}
fastRefresh?: {

}
hash?: boolean
ignoreMomentLocale?: boolean
inlineLimit?: number
lessLoader?: {

}
manifest?: {
fileName?: string
publicPath?: ""
basePath?: string
writeToFileEmit?: boolean
}
/**
 * open mfsu feature
 */
mfsu?: {
development?: {
output?: string
}
production?: {
output?: string
}
mfName?: string
exportAllMembers?: {

}
chunks?: string[]
ignoreNodeBuiltInModules?: boolean
}
mountElementId?: ""
mpa?: {

}
nodeModulesTransform?: {
type?: ("all" | "none")
exclude?: string[]
}
outputPath?: ""
plugins?: string[]
postcssLoader?: {

}
presets?: string[]
proxy?: {

}
publicPath?: string
runtimePublicPath?: boolean
ssr?: {
/**
 * force execing Page getInitialProps functions
 */
forceInitial?: boolean
/**
 * remove window.g_initialProps in html
 */
removeWindowInitialProps?: boolean
/**
 * disable serve-side render in umi dev mode.
 */
devServerRender?: boolean
mode?: ("stream" | "string")
/**
 * static markup in static site
 */
staticMarkup?: boolean
}
singular?: boolean
styleLoader?: {

}
targets?: {

}
terserOptions?: {

}
theme?: {

}
runtimeHistory?: {

}
webpack5?: {
lazyCompilation?: {
entries?: boolean
imports?: boolean
test?: any
}
}
workerLoader?: {

}
favicon?: string
headScripts?: any[]
links?: any[]
metas?: any[]
scripts?: any[]
styles?: any[]
title?: string
mock?: {
exclude?: string[]
}
antd?: {
dark?: boolean
compact?: boolean
mobile?: boolean
disableBabelPluginImport?: boolean
config?: {

}
}
dva?: {
disableModelsReExport?: boolean
/**
 * lazy load dva model avoiding the import modules from umi undefined
 */
lazyLoad?: boolean
extraModels?: string[]
hmr?: boolean
immer?: (boolean | {

})
skipModelValidate?: boolean
}
locale?: {
default?: string
useLocalStorage?: boolean
baseNavigator?: boolean
title?: boolean
antd?: boolean
baseSeparator?: string
}
layout?: {

}
request?: {
dataField?: ""
}
deployMode?: (string | {

})
bmwAutoExternals?: {
excludes?: any[]
comboResources?: boolean
chartset?: string
}
bigfly?: {

}
browserUpdate?: {

}
clue?: {
pid?: string
type?: string
[k: string]: any
}
cnzz?: {
src?: string
}
strict?: {
rules?: {

}
}
ctoken?: boolean
deer?: {

}
h5data?: boolean
qiankun?: {
slave?: {

}
master?: {

}
}
linkS?: {
appId?: string
origin?: string
}
mobileUtils?: (boolean | {
bucFreeLogin?: {
type?: "dingtalk"
appName?: string
env?: ("dev" | "prod")
corpId?: string
ssoExceptionInterceptor?: string
}[]
})
monacoEditor?: {
languages?: string[]
features?: string[]
}
monitor?: {

}
oneApi?: {
apps?: {
name: string
tag: string
source: string
popProduct: string
rename: boolean
filter: ({
include?: string[]
exclude?: string[]
skipExist?: boolean
} | (() => any))
defaultMockScene: string
namespace: string
apiPrefix: (string | (() => any))
generateHttp: {

}
generateTr: {
invokeFnImportStatement?: string
}
[k: string]: any
}[]
requestLibPath?: string
requestImportStatement?: string
typescript?: boolean
disableRuntimeMock?: boolean
disableTypeCheck?: boolean
mockGenPath?: string
serviceGenPath?: string
typeMod?: (() => any)
[k: string]: any
}
tern?: {
authType?: ("antbuservice" | "custom" | "alipay")
allowOrigins?: string[]
proxy?: {
mode?: ("cors" | "hosting" | "noproxy")
DEV?: {

}
TEST?: {

}
STABLE?: {

}
PRE?: {

}
PROD?: {

}
}
localApiGwGroupId?: string
localDevAuth?: boolean
localDevProxy?: boolean
localTernFrameworkUrl?: string
localTernBaseUrl?: string
externalQiankun?: boolean
siteAppName?: string
_runtimeProps?: {

}
}
tracert?: {

}
esbuild?: {
target?: (string | string[])
}
[k: string]: any
}
