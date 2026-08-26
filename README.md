# @nexdom/uimed-vue

[![CI](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/ci.yml)
[![CD](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/cd.yml/badge.svg)](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/cd.yml)
[![Dependabot](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/nexdom-healthtech/uimed-vue/actions/workflows/dependabot/dependabot-updates)

A ui framework for NEXDOM applications, based on [Material Design](https://m3.material.io/).

For more examples and information, check the [docs page](https://nexdom-healthtech.github.io/uimed-vue/).

## 💻 Get started

### Install

```bash
vp add @nexdom/uimed-vue
# But, if you're not using Vite+ yet...
npm i @nexdom/uimed-vue
# Or
pnpm add @nexdom/uimed-vue
# Or
yarn add @nexdom/uimed-vue
```

### Setup

Add Vite config:

```ts
// vite.config.ts
import { vitePluginUimed } from "@nexdom/uimed-vue/plugins.ts";

/// ...

plugins: [vue(), vitePluginUimed()];

// ...
```

Use Uimed inside the Vue app:

```ts
// main.js or main.ts
import { createApp } from "vue";
import { createUimed } from "@nexdom/uimed-vue";

import App from "./App.vue";

const uimed = createUimed();

createApp(App).use(uimed).mount("#app");
```

### Usage

Add the `Root` component to you `App.vue`, then add the rest of the components as needed:

```vue
<!-- App.vue -->
<template>
  <Root>
    <!-- ... -->
  </Root>
</template>

<script setup lang="ts">
import { Root } from "@nexdom/uimed-vue/components";
</script>
```

## 🧱 Contribute

Help us improve our community.

Report an [issue](https://github.com/nexdom-healthtech/uimed-vue/issues) you've found or check our [Contribution Guide](./CONTRIBUTING.md) to learn how to code in our project and open your own PRs to us.

## 📄 License

[MIT License](./LICENSE) © 2026-PRESENT NEXDOM
