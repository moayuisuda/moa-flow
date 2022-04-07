import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import postcss from "rollup-plugin-postcss";

import tsconfig from "./tsconfig.json";

const resolveEntries = () => {
  return Object.entries(tsconfig.compilerOptions.paths).map(
    ([find, [replacement]]) => ({ find, replacement })
  );
};

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "es",
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      modules: true,
      plugins: [],
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
    alias({
      entries: resolveEntries(),
    }),
  ],
  external: ["react-konva", "konva", "mobx", "react", "mobx-react"],
};
