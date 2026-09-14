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
<root :appBar @update:notifications-open="toggleNotifications">
  <h2>O conteúdo da página vai aqui...</h2>
</root>
</demo>

```vue
<template>
  <root :appBar @update:notifications-open="toggleNotifications">
    <h2>O conteúdo da página vai aqui...</h2>
  </root>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const today = new Date();

const appBar = reactive<AppBarConfig>({
  title: "Menu superior",
  help: "https://google.com",
  notifications: [
    {
      title: "v1.1",
      subtitle: "Nova versão disponível para instalação.",
      date: new Date(today),
      read: false,
    },
    {
      title: "v1",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 1)),
      read: false,
    },
    {
      title: "vBeta",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 2)),
      read: true,
    },
    {
      title: "vAlpha",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 3)),
      read: true,
    },
  ],
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
      {
        description: "GitHub NEXDOM",
        route: "https://github.com/nexdom-healthtech",
      },
      { description: "Sair", action: () => window.alert("Saindo...") },
    ],
  },
});

function toggleNotifications(open: boolean) {
  if (!open)
    appBar.notifications = appBar.notifications?.map((notification) => ({
      ...notification,
      read: true,
    }));
}
</script>
```

<!-- TODO: adicionar playground -->

## Ver também

Consulte a referência de [API do Root](../../api/components/root) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { reactive } from "vue"
  import { Root, type AppBarConfig } from "../../../dist/components.js"

  const today = new Date()
  
  const appBar = reactive<AppBarConfig>({
    title: "Menu superior",
    help: "https://google.com",
    dataTestid: "demo-root-app-bar",
    notifications: [
      {
        title: "v1.1",
        subtitle: "Nova versão disponível para instalação.",
        date: new Date(today),
        read: false,
      },
      {
        title: "v1",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 1)),
        read: false,
      },
      {
        title: "vBeta",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 2)),
        read: true,
      },
      {
        title: "vAlpha",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 3)),
        read: true,
      },
    ],
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
  });

  function toggleNotifications(open: boolean) {
    if (!open)
      appBar.notifications = appBar.notifications?.map((notification) => ({
        ...notification,
        read: true,
      }));
  }
</script>
