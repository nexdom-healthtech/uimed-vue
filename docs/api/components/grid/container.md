# Container

Principal componente do grid system.

Responsável por agrupar diversos [componentes de linha](./row).

## Props

| Prop         | Tipo     | Padrão | Descrição                                                     |
| ------------ | -------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente. |

## Slots

| Slot      | Descrição                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| `default` | Conteúdo a ser exibido dentro do componente. A raiz do mesmo deve conter apenas componentes [`row`](./row). |

## Exemplo

```vue
<template>
  <container>
    <!-- ... -->
  </container>
</template>

<script lang="ts" setup>
import { Container } from "@nexdom/uimed-vue/components";
</script>
```
