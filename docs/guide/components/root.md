---
outline: deep
---

# Componente base

O componente destinado a raiz do projeto se chama `Root`.

É responsável por carregar o menu superior, o componente utilizado pelos composables de [Toasts](../composables/use-toast) e os estilos necessários para os demais componentes.

## Propriedades

### Menu superior

A prop `app-bar` define as configurações para apresentação do menu superior.

Para ocultar o menu superior, basta omitir essa prop.

<demo contained>
<root :appBar>
  <h2>O conteúdo da página vai aqui...</h2>
</root>
</demo>

```vue
<template>
  <root :appBar>
    <h2>O conteúdo da página vai aqui...</h2>
  </root>
</template>

<script lang="ts" setup>
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const appBar: AppBarConfig = {
  title: "Menu superior",
  help: "https://google.com",
  user: {
    title: "Rafael Perini",
    subtitle: "UIMed-Vue Co-Creator",
    img: "/uimed-vue/avatar.jpg",
    options: [
      {
        description: "Bibliotecas",
        items: [
          {
            description: "Pkg-template",
            route: "https://nexdom-healthtech.github.io/pkg-template/",
          },
          {
            description: "Shared",
            route: "https://nexdom-healthtech.github.io/shared/",
          },
          {
            description: "UIMed-Vue",
            route: "https://nexdom-healthtech.github.io/uimed-vue/",
          },
        ],
      },
      { description: "GitHub NEXDOM", route: "https://github.com/nexdom-healthtech" },
      { description: "Sair", action: () => window.alert("Saindo...") },
    ],
  },
};
</script>
```

<!-- TODO: adicionar playground -->

## Ver também

Consulte a referência de [API do Root](../../api/components/root) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Root, type AppBarConfig } from "../../../dist/components.js"
  
  const appBar: AppBarConfig = {
    title: "Menu superior",
    help: "https://google.com",
    dataTestid: "demo-root-app-bar",
    user: {
      title: "Rafael Perini",
      subtitle: "UIMed-Vue Co-Creator",
      img: "/uimed-vue/avatar.jpg",
      options: [
        {
          description: "Bibliotecas",
          items: [
            {
              description: "Pkg-template",
              route: "https://nexdom-healthtech.github.io/pkg-template/",
            },
            {
              description: "Shared",
              route: "https://nexdom-healthtech.github.io/shared/",
            },
            {
              description: "UIMed-Vue",
              route: "https://nexdom-healthtech.github.io/uimed-vue/",
            },
          ],
        },
        { description: "GitHub NEXDOM", route: "https://github.com/nexdom-healthtech" },
        { description: "Sair", action: () => window.alert("Saindo...") },
      ],
    },
  };
</script>
