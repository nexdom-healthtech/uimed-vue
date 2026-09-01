# Root

Componente principal do projeto.

## Props

| Prop         | Tipo     | Padrão | Descrição                                                     |
| ------------ | -------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente. |

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do componente. |

## Exemplo

```vue
<template>
  <root>
    <!-- ... -->
  </root>
</template>

<script lang="ts" setup>
import { Root } from "@nexdom/uimed-vue/components";
</script>
```
