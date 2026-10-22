# Iniciando

## Instação

### Pré-requisitos

- [Node.js](https://nodejs.org/) na versão 22 ou superior.
- [Vue.js](https://vuejs.org/) na versão 3 ou superior.
- [@nexdom/shared](https://nexdom-healthtech.github.io/shared/) na versão 2.1.1 ou superior.
- [vue-component-type-helpers](https://www.npmjs.com/package/vue-component-type-helpers) para tipagem de props.
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

Adicione o plugin ao arquivo de configurações do Vite. Ele compila os estilos dos componentes com a fonte e os ajustes visuais da biblioteca. Sem ele, os componentes perdem a fonte Unimed Slab:

```js [vite.config.ts]
import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import { vitePluginUimed } from "@nexdom/uimed-vue/plugins"; // [!code ++]

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

Os textos que os componentes geram por conta própria, como os anúncios para leitores de tela (por exemplo, `Carregando...`) e os rótulos da paginação, ficam em português.

## Tipagem de props

A biblioteca não exporta tipos de props diretamente. A forma recomendada é utilizar `ComponentProps` do pacote `vue-component-type-helpers`, instalado como dependência de pares (_peer dependency_) da biblioteca.

```vue [App.vue]
<template>
  <u-main :app-bar="appBar" :navigation-menu="navigationMenu">
    <u-section :actions="sectionActions">
      <!-- ... -->
    </u-section>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain, USection } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;
type AppBar = NonNullable<MainProps["appBar"]>;
type NavigationMenu = NonNullable<MainProps["navigationMenu"]>;
type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];

const appBar: AppBar = {
  title: "Meu App",
};

const navigationMenu: NavigationMenu = {
  items: [{ description: "Home", route: "/", icon: "home" }],
};

const sectionActions: SectionAction[] = [{ type: "submit", label: "Salvar" }];
</script>
```

`NonNullable` é necessário porque as props são opcionais: sem ele, o tipo também aceitaria `undefined`, impedindo o acesso a propriedades aninhadas (como `AppBar["user"]`) e o uso com `reactive<...>()` ou `computed<...>()`.

## Agentes de IA

O pacote traz um guia de uso para agentes de IA (como Claude Code, Codex, Cursor ou Copilot), no formato aberto de Agent Skills, em `node_modules/@nexdom/uimed-vue/skills/uimed-vue/SKILL.md`. Ele reúne a instalação, a configuração, as regras de uso, os pontos de entrada, as mudanças incompatíveis e esta documentação, todos na versão instalada no projeto: a cada atualização da biblioteca, o guia é atualizado junto.

Para que o agente do seu projeto use o guia, referencie-o uma vez nas instruções dele:

::: code-group

```md [CLAUDE.md]
@node_modules/@nexdom/uimed-vue/skills/uimed-vue/SKILL.md
```

```md [AGENTS.md]
Para usar a biblioteca `@nexdom/uimed-vue`, siga `node_modules/@nexdom/uimed-vue/skills/uimed-vue/SKILL.md`.
```

:::

O guia trata só do uso da biblioteca: as regras do seu projeto, como o fluxo de Git e os agentes, continuam nas instruções dele.

## E agora?

Importe o componente [`Main`](../api/components/main) para dentro do seu `App.vue`, conforme o exemplo a seguir e então você poderá utilizar todos os recursos do `@nexdom/uimed-vue` a vontade.

```vue [App.vue]
<template>
  <u-main>
    <!-- ... -->
  </u-main>
</template>

<script lang="ts" setup>
import { UMain } from "@nexdom/uimed-vue/components";
</script>
```

Acesse as [APIs](../api/) e saiba mais dos recursos que este framework dispõe.
