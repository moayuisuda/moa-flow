const { override, fixBabelImports, addWebpackAlias } = require("customize-cra");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = override(
  addWebpackAlias({
    // "flow": path.resolve(__dirname, "Flow/index.js"),
  })
);
