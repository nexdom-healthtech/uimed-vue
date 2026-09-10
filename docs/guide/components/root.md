---
outline: deep
---

# Componente base

O componente destinado a raiz do projeto se chama `Root`.

É responsável por carregar o menu superior, menu lateral, o componente utilizado pelos composables de [Toasts](../composables/use-toast) e os estilos necessários para os demais componentes.

## Propriedades

### Menu superior

A prop `app-bar` define as configurações para apresentação do menu superior.

Para ocultar o menu superior, basta omitir essa prop.

<demo contained>
<root :appBar>
  <h2>Testando...</h2>
</root>
</demo>

```vue
<template>
  <root :appBar>
    <h2>Testando...</h2>
  </root>
</template>

<script lang="ts" setup>
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const appBar: AppBarConfig = {
  title: "Componente base",
  help: "https://google.com",
};
</script>
```

## Ver também

Consulte a referência de [API do Root](../../api/components/root) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Root, type AppBarConfig } from "../../../dist/components.js"
  
  const appBar: AppBarConfig = {
    title: "Componente base",
    help: "https://google.com",
    dataTestid: "demo-root-app-bar",
  };
</script>
