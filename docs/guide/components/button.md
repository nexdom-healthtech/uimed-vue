# Button

Componente utilizado como abstração do botão.
Deve ser utilizado ao invés do `<button>` nativo.

## Uso

::: raw
<btn>
Me clique
</btn>
:::

```vue
<template>
  <btn> Me clique </btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

<script lang="ts" setup>
  import { Button as Btn } from "../../../dist/components.js"
</script>
