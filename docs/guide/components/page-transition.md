---
outline: deep
---

# Transição de páginas

O componente para animar a troca entre as páginas da aplicação se chama `PageTransition`. A página atual desaparece aos poucos e, só depois que ela sai, a nova página aparece da mesma forma.

> [!Warning]
> Feito para envolver a página renderizada pelo `<router-view>` do [Vue Router](https://router.vuejs.org/).

## Uso

Coloque o `<router-view>` dentro do [Componente base](./main) e envolva a página da rota atual com o `PageTransition`.

Só a troca de páginas é animada. A primeira página aparece sem animação quando a aplicação é montada depois que o roteador carrega a primeira rota (com `await router.isReady()` antes do `app.mount`). Se a aplicação for montada antes, a área de conteúdo começa vazia e a primeira página aparece com a animação, como na demonstração abaixo.

Navegue entre as páginas da demonstração.

<demo col contained>
  <u-main>
    <router-view v-slot="{ Component }">
      <u-page-transition>
        <component :is="Component" />
      </u-page-transition>
    </router-view>
  </u-main>
</demo>

A demonstração tem duas páginas com um roteador próprio. Por isso, a navegação entre elas não altera o endereço do navegador. A página "Pacientes" é uma section, e a página "Agenda" centraliza a sua section na altura da tela, com um container e uma linha com `full-height` (veja [Altura total](./layout#altura-total)).

```vue
<!-- App.vue -->
<template>
  <u-main>
    <router-view v-slot="{ Component }">
      <u-page-transition>
        <component :is="Component" />
      </u-page-transition>
    </router-view>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, UPageTransition } from "@nexdom/uimed-vue/components";
</script>
```

### Elemento em volta da página

O `PageTransition` coloca a página dentro de um `<div>`, e é esse elemento que aparece e desaparece. Assim, qualquer página é animada, seja qual for o seu conteúdo: uma section, mais de um elemento (por exemplo, o conteúdo e uma [janela modal](./dialog) ao lado dele) ou comentários fora do elemento principal.

```vue
<!-- PatientList.vue, página renderizada pelo <router-view> -->
<template>
  <u-section title="Pacientes" :actions>
    <u-section-content>Lista de pacientes cadastrados.</u-section-content>
  </u-section>
  <u-dialog v-model="open" title="Novo paciente">...</u-dialog>
</template>
```

O `<div>` ocupa toda a altura do elemento em que está. Por isso, containers e linhas com `full-height` continuam ocupando a altura da área de conteúdo do [Componente base](./main), como na página "Agenda" da demonstração.

Com um `<keep-alive>` dentro do `PageTransition`, a troca de páginas não é animada, porque o conteúdo do `PageTransition` passa a ser sempre o mesmo `<keep-alive>`.

Atributos informados no `PageTransition`, como `class` e `style`, não são repassados ao `<div>` nem à página.

### Movimento reduzido

Quando o sistema operacional pede movimento reduzido (por exemplo, com a opção "Reduzir movimento" ou "Efeitos de animação" desligada), as páginas trocam sem animação. Nenhuma configuração é necessária, e a mudança da preferência com a aplicação aberta vale a partir da troca seguinte.

### Mesma rota com outros parâmetros

Quando só os parâmetros da rota mudam (por exemplo, de `/pacientes/1` para `/pacientes/2`), o Vue Router reaproveita a página, e a troca acontece sem animação. Para animar também esses casos, informe o endereço da rota como `key` da página. A página passa a ser criada de novo a cada navegação, então o estado dela (como campos preenchidos) não é mantido:

```vue
<template>
  <u-main>
    <router-view v-slot="{ Component, route }">
      <u-page-transition>
        <component :is="Component" :key="route.fullPath" />
      </u-page-transition>
    </router-view>
  </u-main>
</template>
```

## Ver também

Consulte a referência de [API do UPageTransition](../../api/components/page-transition) para mais informações.

<script lang="ts" setup>
  import { onMounted, provide } from "vue";
  import {
    createMemoryHistory,
    createRouter,
    RouterView,
    routerKey,
    routerViewLocationKey,
  } from "vue-router";
  import { UMain, UPageTransition } from "../../../dist/components.js";
  import FirstPage from "./demos/page-transition/first-page.vue";
  import SecondPage from "./demos/page-transition/second-page.vue";

  // Router restricted to the demo, so it doesn't change the browser's address nor the other demos
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: FirstPage },
      { path: "/agenda", component: SecondPage },
    ],
  });

  // Only what the demo uses is provided. Without `routeLocationKey`, `useRoute()` and `RouterLink`
  // don't work inside it
  provide(routerKey, router);
  provide(routerViewLocationKey, router.currentRoute);
  onMounted(() => router.replace("/"));
</script>
