import { vitestServerPluginUimed } from "./src/plugins.ts";
import path from "path";
import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  run: {
    tasks: {
      docs: {
        command: "vpr docs:dev",
        dependsOn: ["build"],
        cache: false,
      },
      "docs:build": {
        command: "vpx vitepress build docs",
        dependsOn: ["build"],
      },
      "docs:preview": {
        command: "vpx vitepress preview docs  --host --port 4173 --strictPort",
        dependsOn: ["docs:build"],
      },
    },
  },
  pack: {
    entry: {
      index: "src/index.ts",
      plugins: "src/plugins.ts",
      "unit-test": "src/unit-test.ts",
      components: "src/components/index.ts",
      composables: "src/composables/index.ts",
    },
    platform: "neutral",
    plugins: [vue()],
    dts: {
      vue: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      // False only until the following issue gets fixed: https://github.com/oxc-project/oxc/issues/15761
      // As a workaround, we added vue-tsc to perform type-check.
      typeCheck: false,
    },
  },
  fmt: {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@e2e": path.resolve(__dirname, "./e2e"),
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    exclude: [".pnpm-store/", "e2e/**", "**/node_modules/**", "**/.git/**", "**/.stryker-tmp/**"],
    coverage: {
      reporter: ["text"],
      thresholds: {
        lines: 95,
      },
    },
    setupFiles: ["src/__tests__/setup.ts"],
    server: vitestServerPluginUimed(),
  },
});
