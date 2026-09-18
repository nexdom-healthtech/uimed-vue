# Content

Componente utilizado para estruturar o conteúdo exibido dentro do `ContentSet`.

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do componente. |

## Exemplo

```vue
<template>
  <content-set title="Título">
    <content> Conteúdo exibido dentro do card. </content>
  </content-set>
</template>

<script lang="ts" setup>
import { Content, ContentSet } from "@nexdom/uimed-vue/components";
</script>
```
