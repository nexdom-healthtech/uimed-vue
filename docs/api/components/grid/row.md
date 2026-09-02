# Row

Componente para linhas do grid system.

Deve ser colocado exclusivamente dentro de [componentes de container](./container).

## Props

| Prop         | Tipo     | Padrão | Descrição                                                     |
| ------------ | -------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente. |

## Slots

| Slot      | Descrição                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `default` | Conteúdo a ser exibido dentro do componente. A raiz do mesmo deve conter apenas componentes [`column`](./column). |

## Exemplo

```vue
<template>
  <container>
    <row>
      <!-- ... -->
    </row>
  </container>
</template>

<script lang="ts" setup>
import { Container, Row } from "@nexdom/uimed-vue/components";
</script>
```
