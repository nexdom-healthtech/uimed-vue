# Iniciando

## Instação

Para instalar no seu projeto, execute:

::: code-group

```sh [Vite+]
$ vp add @nexdom/uimed-vue
```

```sh [npm]
$ npm install @nexdom/uimed-vue
```

```sh [pnpm]
$ pnpm add @nexdom/uimed-vue
```

```sh [yarn]
$ yarn add @nexdom/uimed-vue
```

:::

## Configuração

Adicione o plugin ao arquivo de configurações do Vite:

```js [vite.config.js]
import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import { vitePluginUimed } from "@nexdom/uimed-vue/plugins.ts"; // [!code ++]

export default defineConfig({
  plugins: [
    vue(),
    vitePluginUimed() // [!code ++]
  ];
  // ...
});
```

Após atualizar as configurações do Vite, instale o plugin no seu app:

```ts [main.ts]
import { createApp } from "vue";
import { createUimed } from "@nexdom/uimed-vue"; // [!code ++]

import App from "./App.vue";

const uimed = createUimed(); // [!code ++]

createApp(App)
  .use(uimed) // [!code ++]
  .mount("#app");
```

## E agora?

Importe o componente [`Root`](../api/components/root.md) para dentro do seu `App.vue` e então os demais recursos que você precise, como no exemplo a seguir:

```vue [App.vue]
<template>
  <Root>
    <!-- ... -->
  </Root>
</template>

<script lang="ts" setup>
import { Root } from "@nexdom/uimed-vue/components";
</script>
```

Acesse as [APIs](../api/) e saiba mais dos recursos que este framework dispõe.
