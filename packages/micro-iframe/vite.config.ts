import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import rollupVisualizer from "rollup-plugin-visualizer";
// https://vite.dev/config/
export default defineConfig({
  root: ".", //vite.config.ts文件所在位置为root文件
  plugins: [
    react(),
    dts({
      rollupTypes: true, //用Rollup聚合类型
      copyDtsFiles: true, //保留原始的 .d.ts文件结构
      tsconfigPath: "./tsconfig.app.json", //指定专用TS配置
    }),
    // 同时开启gzip和brotli压缩比较
    rollupVisualizer({
      gzipSize: true, //显示Gzip压缩后的体积
      brotliSize: true, //显示Brotli压缩后的文件体积
      filename: "report.html", //指定分析报告的输出路径和文件名
      open: false, //禁止构建完成后自动打开
      emitFile: false, //禁止将分析报告写入构建输出目录
    }),
  ],
  build: {
    lib: {
      entry: "packages/index.ts",
      name: "@micro-frontend/micro-iframe",
      fileName: "index",
      formats: ["es"],
    },
    minify: "esbuild", //用于客户端构建最小化
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
