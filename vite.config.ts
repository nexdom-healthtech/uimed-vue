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
        command: "vpx vitepress preview docs",
        dependsOn: ["docs:build"],
      },
      "test:e2e": {
        command: "vpx playwright test",
        dependsOn: ["docs:build"],
        cache: false,
      },
    },
  },
  pack: {
    entry: {
      index: "src/index.ts",
      plugins: "src/plugins.ts",
      components: "src/components/index.ts",
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
      typeCheck: true,
    },
  },
  fmt: {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    coverage: { reporter: ["text"] },
    setupFiles: ["src/__tests__/setup.ts"],
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
  },
});
