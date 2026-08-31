# Iniciando

## Instação

### Pré-requisitos

- [Node.js](https://nodejs.org/) na versão 22 ou superior.
- [Vue.js](https://vuejs.org/) na versão 3.5 ou superior.
- Editor de texto com suporte a sintaxe [Markdown](https://en.wikipedia.org/wiki/Markdown).
  - [VSCode](https://code.visualstudio.com/) é recomendado, junto com a [extensão oficial Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

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

```js [vite.config.ts]
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

Importe o componente [`Root`](../api/components/root) para dentro do seu `App.vue`, conforme o exemplo a seguir e então você poderá utilizar todos os recursos do `@nexdom/uimed-vue` a vontade.

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
