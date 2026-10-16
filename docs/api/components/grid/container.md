# UContainer

Principal componente do grid system.

Responsável por agrupar diversos [componentes de linha](./row).

## Props

| Prop         | Tipo      | Padrão  | Descrição                                                                                                                                                                                                             |
| ------------ | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fullHeight` | `boolean` | `false` | Faz o container ocupar 100% da altura do elemento em que está, que precisa ter uma altura própria, como a área de conteúdo do [`UMain`](../main). Veja [Altura total](../../../guide/components/layout#altura-total). |
| `dataTestid` | `string`  |         | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                         |

## Slots

| Slot      | Descrição                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `default` | Conteúdo a ser exibido dentro do componente. A raiz do mesmo deve conter apenas componentes [`URow`](./row). |

## Exemplo

```vue
<template>
  <u-container>
    <!-- ... -->
  </u-container>
</template>

<script lang="ts" setup>
import { UContainer } from "@nexdom/uimed-vue/components";
</script>
```
