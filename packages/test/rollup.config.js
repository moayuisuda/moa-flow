import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import postcss from "rollup-plugin-postcss";
import { uglify } from "rollup-plugin-uglify";

import tsconfig from "./tsconfig.json";

const resolveEntries = () => {
  return Object.entries(tsconfig.compilerOptions.paths).map(
    ([find, [replacement]]) => ({ find, replacement })
  );
};

export default {
  // 会有默认的key-value指明某个module对应的哪个模块
  external: [
    "react",
    "konva",
    "mobx",
    "mobx-react",
    "react-konva",
    "react-konva-utils",
  ],
  input: "src/index.ts",
  output: {
    dir: "lib",
    preserveModules: true,
    preserveModulesRoot: "src",
    // tsconfig的module是项目使用的模块管理方式，target的是目标代码stage(如es5就是var)，format则是打包后的格式
    format: "esm",
    globals: {
      react: "React",
    },
  },
  plugins: [
    resolve(), // 解析外部依赖
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "lib",
    }),
    alias({
      entries: resolveEntries(),
    }),
    commonjs(),
    postcss({
      modules: true,
      plugins: [],
    }),
    // uglify(),
  ],
};
