# ULink

Componente para exibir links de texto avulsos, sem sublinhado.
Rotas da aplicação navegam sem recarregar a página, e endereços que começam com `http` navegam pelo navegador, na mesma aba.

## Props

| Prop         | Tipo                                                                                  | Padrão | Descrição                                                                                                                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `route`      | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) |        | **Obrigatória.** Destino do link. Uma rota da aplicação (exemplo: `"/login"` ou `{ name: "forgot-password" }`) navega pelo [Vue Router](https://router.vuejs.org/) da aplicação; um endereço que começa com `http` (exemplo: `"https://google.com"`) navega pelo navegador, na mesma aba. |
| `dataTestid` | `string`                                                                              |        | Id do componente para uso em testes automatizados.                                                                                                                                                                                                                                        |

Não há eventos.

## Slots

| Slot      | Descrição                                                        |
| --------- | ---------------------------------------------------------------- |
| `default` | Texto do link, também lido como seu nome pelos leitores de tela. |

## Exemplo

```vue
<template>
  <u-link :route="{ name: 'forgot-password' }">Esqueceu sua senha?</u-link>
</template>

<script lang="ts" setup>
import { ULink } from "@nexdom/uimed-vue/components";
</script>
```
