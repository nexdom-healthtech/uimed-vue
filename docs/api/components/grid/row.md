# URow

Componente para linhas do grid system.

Deve ser colocado exclusivamente dentro de [componentes de container](./container).

## Props

| Prop         | Tipo     | Padrão | Descrição                                                     |
| ------------ | -------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente. |

## Slots

| Slot      | Descrição                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `default` | Conteúdo a ser exibido dentro do componente. A raiz do mesmo deve conter apenas componentes [`UColumn`](./column). |

## Exemplo

```vue
<template>
  <u-container>
    <u-row>
      <!-- ... -->
    </u-row>
  </u-container>
</template>

<script lang="ts" setup>
import { UContainer, URow } from "@nexdom/uimed-vue/components";
</script>
```
