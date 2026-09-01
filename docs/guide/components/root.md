# Componente base

O componente destinado a raiz do projeto se chama `Root`.

É responsável por carregar os estilos necessários para os demais componentes.

## Uso

<demo>
<root>
  <h2>Testando...</h2>
</root>
</demo>

```vue
<template>
  <root>
    <h2>Testando...</h2>
  </root>
</template>

<script lang="ts" setup>
import { Root } from "@nexdom/uimed-vue/components";
</script>
```

## Ver também

Consulte a referência de [API do Root](../../api/components/root) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Root } from "../../../dist/components.js"
</script>
