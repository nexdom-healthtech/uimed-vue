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

Atributos informados no `PageTransition`, como `class` e `style`, não são repassados ao `<div>` nem à página.

### Movimento reduzido

Quando o sistema operacional pede movimento reduzido (por exemplo, com a opção "Reduzir movimento" ou "Efeitos de animação" desligada), as páginas trocam sem animação. Nenhuma configuração é necessária, e a mudança da preferência com a aplicação aberta vale a partir da troca seguinte.

### Quando a troca é animada

A troca é animada sempre que a prop `transitionKey` muda. Por padrão, ela é o endereço completo da rota atual (`route.fullPath`), então toda navegação é animada, inclusive quando só mudam os parâmetros (de `/pacientes/1` para `/pacientes/2`), a consulta (de `/pacientes?pagina=1` para `/pacientes?pagina=2`) ou o fragmento (um link para uma âncora da mesma página, como `#consultas`). Nesses casos, a página é criada de novo, e o estado dela (como campos preenchidos) não é mantido.

Para escolher quais navegações são animadas, informe outro valor. Com o caminho da rota (`route.path`), por exemplo, mudanças só na consulta ou no fragmento, como a troca de página de uma lista, acontecem sem animação e mantêm a página:

```vue
<template>
  <u-main>
    <router-view v-slot="{ Component, route }">
      <u-page-transition :transition-key="route.path">
        <component :is="Component" />
      </u-page-transition>
    </router-view>
  </u-main>
</template>
```

#### Rotas aninhadas

Com rotas aninhadas, o endereço completo também muda quando só a rota filha muda. Com o valor padrão, navegar entre rotas filhas (de `/pacientes/1` para `/pacientes/2`) anima a página pai inteira, que sai com a filha anterior e é criada de novo com a nova, sem manter o seu estado.

Para animar só a troca da rota filha, informe no `PageTransition` de cima uma `transitionKey` que identifique apenas a rota pai, como o caminho dela (`route.matched[0]?.path`), e envolva o `<router-view>` da página pai com outro `PageTransition`:

```vue
<!-- App.vue -->
<template>
  <u-main>
    <router-view v-slot="{ Component, route }">
      <u-page-transition :transition-key="route.matched[0]?.path">
        <component :is="Component" />
      </u-page-transition>
    </router-view>
  </u-main>
</template>
```

```vue
<!-- PatientLayout.vue, página pai das rotas /pacientes/:id -->
<template>
  <router-view v-slot="{ Component }">
    <u-page-transition>
      <component :is="Component" />
    </u-page-transition>
  </router-view>
</template>
```

### Páginas mantidas em memória

Com um `<keep-alive>` dentro do `PageTransition`, a troca é animada, mas as páginas não são mantidas: o `<div>` em volta da página é criado de novo a cada troca, e o `<keep-alive>` dentro dele também. Para manter as páginas, informe uma `transitionKey` fixa (por exemplo, `transition-key="paginas"`). Nesse caso, a troca de páginas acontece sem animação.

## Ver também

Consulte a referência de [API do UPageTransition](../../api/components/page-transition) para mais informações.

<script lang="ts" setup>
  import { onMounted, provide } from "vue";
  import {
    createMemoryHistory,
    createRouter,
    RouterView,
    routeLocationKey,
    routerKey,
    routerViewLocationKey,
    type RouteLocationNormalizedLoaded,
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

  // Provides what installing the router in an app would, but only to the demo
  provide(routerKey, router);
  provide(routerViewLocationKey, router.currentRoute);

  // The current route, read by the page transition through `useRoute()`, as the app's router does
  provide(
    routeLocationKey,
    new Proxy({} as RouteLocationNormalizedLoaded, {
      get: (_, key) => router.currentRoute.value[key as keyof RouteLocationNormalizedLoaded],
    }),
  );
  onMounted(() => router.replace("/"));
</script>
