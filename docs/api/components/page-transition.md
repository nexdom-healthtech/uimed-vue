# UPageTransition

Componente para animar a troca entre as páginas renderizadas pelo `<router-view>`: a página atual desaparece aos poucos e, só depois que ela sai, a nova página aparece.
Quando o sistema operacional pede movimento reduzido, as páginas trocam sem animação.
A página fica dentro de um `<div>` que ocupa toda a altura do elemento em que está, e a troca acontece quando o slot passa a renderizar outro componente, ou o mesmo com outra `key` (veja o [guia](../../guide/components/page-transition#elemento-em-volta-da-pagina)). Atributos como `class` e `style` não são repassados.

Não há props nem eventos.

## Slots

| Slot      | Descrição                                                                                  |
| --------- | ------------------------------------------------------------------------------------------ |
| `default` | Página a animar, normalmente o componente da rota atual (`<component :is="Component" />`). |

## Exemplo

```vue
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
