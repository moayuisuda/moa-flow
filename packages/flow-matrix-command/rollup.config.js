import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";

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
    typescript({ tsconfig: "./tsconfig.json" }),
    alias({
      entries: resolveEntries(),
    }),
  ],
  external: ["@ali/flow-infra"],
};
