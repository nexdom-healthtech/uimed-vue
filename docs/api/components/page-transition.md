# UPageTransition

Componente para animar a troca entre as páginas renderizadas pelo `<router-view>`: a página atual desaparece aos poucos e, só depois que ela sai, a nova página aparece.
Quando o sistema operacional pede movimento reduzido, as páginas trocam sem animação.
A página fica dentro de um `<div>` que ocupa toda a altura do elemento em que está (veja o [guia](../../guide/components/page-transition#elemento-em-volta-da-pagina)). Atributos como `class` e `style` não são repassados.

## Props

| Prop            | Tipo     | Padrão           | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `transitionKey` | `string` | `route.fullPath` | Identifica a página exibida: a troca é animada sempre que o valor muda. O padrão, o endereço completo da rota atual, anima toda navegação, inclusive as que só mudam os parâmetros, a consulta ou o fragmento (`#`) da rota. Informe outro valor para escolher quais navegações são animadas (exemplo: `route.path`, para não animar quando só a consulta ou o fragmento mudam; veja o [guia](../../guide/components/page-transition#quando-a-troca-e-animada), inclusive para rotas aninhadas). |

Não há eventos.

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
