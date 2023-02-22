// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "moa-flow",
      // the proper extensions will be added
      fileName: "moa-flow",
      // The 'module'of tsconfig is the module management method used by the project(es or amd), the 'target' is the target code stage(es5 is var), and the 'format' is the packaged format(es, amd, umd)
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "mobx", "mobx-react", "uuid"],
    },
  },
});
