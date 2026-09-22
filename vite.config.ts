import { vitestServerPluginUimed } from "./src/plugins.ts";
import { resolve } from "node:path";
import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  run: {
    tasks: {
      check: {
        command: "vp check && vpx vue-tsc",
        dependsOn: ["build"],
        cache: false,
      },
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
      sonar: {
        command: "vpx @sonar/scan",
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
    copy: "src/styles",
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
      "@": resolve(__dirname, "./src"),
      "@e2e": resolve(__dirname, "./e2e"),
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    exclude: [".pnpm-store/", "e2e/**", "**/node_modules/**", "**/.git/**", "**/.stryker-tmp/**"],
    coverage: {
      reporter: process.env.CI ? ["text", "lcov"] : ["text", "html"],
      thresholds: {
        "100": true,
      },
    },
    setupFiles: ["src/__tests__/setup.ts"],
    server: vitestServerPluginUimed(),
  },
});
