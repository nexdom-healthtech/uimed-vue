# USectionContent

Componente utilizado para estruturar o conteúdo exibido dentro do `USection`.

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do componente. |

## Exemplo

```vue
<template>
  <u-section title="Título">
    <u-section-content> Conteúdo exibido dentro do card. </u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import { USectionContent, USection } from "@nexdom/uimed-vue/components";
</script>
```
