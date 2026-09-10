# Root

Componente principal do projeto.

Responsável por carregar todos os estilos e componentes para as composables de [Toasts](../composables/use-toast).

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
