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
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "mobx", "mobx-react"],
    },
  },
});
