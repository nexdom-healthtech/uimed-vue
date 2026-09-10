---
outline: deep
---

# Root

Componente principal do projeto.

Responsável por carregar todos os estilos e componentes para as composables de [Toasts](../composables/use-toast).

## Props

| Prop         | Tipo                | Padrão | Descrição                                                     |
| ------------ | ------------------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string`            |        | Aplica atributo `data-testid` para testes sobre o componente. |
| `appBar`     | [`appBar`](#appbar) |        | Conjunto de propriedades para aplicar à barra superior.       |

### `appBar`

| Prop         | Tipo                                                                                              | Padrão | Descrição                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataTestid` | `string`                                                                                          |        | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                |
| `title`      | `string`                                                                                          |        | Título para o cabeçalho, seja da página atual ou da aplicação como um todo.                                                                                  |
| `help`       | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |        | Rota para direcionar o usuário em necessidade de "ajuda", podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/help"`). |

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do componente. |

## Exemplo

```vue
<template>
  <root :app-bar="appBar">
    <!-- ... -->
  </root>
</template>

<script lang="ts" setup>
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const appBar: AppBarConfig = {
  title: "Aplicação uimed-vue",
  help: "https://google.com",
};
</script>
```
