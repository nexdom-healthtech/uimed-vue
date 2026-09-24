---
outline: deep
---

# Conteúdo Expansível

O componente padrão para exibir conteúdo que pode ser expandido e recolhido se chama `Details`.

O conteúdo inicia recolhido e é exibido ao clicar no título.

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao conteúdo expansível. O padrão é `primary`.

<demo col>
<u-details variant="primary" title="Primary">Conteúdo expansível primary</u-details>
<u-details variant="secondary" title="Secondary">Conteúdo expansível secondary</u-details>
</demo>

```vue
<template>
  <u-details variant="primary" title="Primary">Conteúdo expansível primary</u-details>
  <u-details variant="secondary" title="Secondary">Conteúdo expansível secondary</u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```

### Título

A prop `title` define o texto exibido no cabeçalho. Ao clicar nele, o conteúdo é expandido ou recolhido.

<demo col>
<u-details title="Mais informações" data-testid="demo-details-title">
  Conteúdo exibido ao expandir
</u-details>
</demo>

```vue
<template>
  <u-details title="Mais informações">Conteúdo exibido ao expandir</u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um skeleton loader no lugar do conteúdo expansível enquanto uma operação está em andamento.

<demo col>
<u-details title="Carregando..." loading>Conteúdo expansível</u-details>
</demo>

```vue
<template>
  <u-details title="Carregando..." loading>Conteúdo expansível</u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```

### Vários conteúdos expansíveis

Cada `Details` é independente: vários podem ficar abertos ao mesmo tempo.

<demo col>
<u-details title="Primeiro" data-testid="demo-details-first">Conteúdo do primeiro</u-details>
<u-details title="Segundo" data-testid="demo-details-second">Conteúdo do segundo</u-details>
</demo>

```vue
<template>
  <u-details title="Primeiro">Conteúdo do primeiro</u-details>
  <u-details title="Segundo">Conteúdo do segundo</u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-details
  :variant="playgroundVariant"
  :title="playgroundActions.title.value"
  :loading="playgroundLoading"
  data-testid="details-preview"
>
  {{ playgroundActions.content.value }}
</u-details>

<template #actions>
<v-select
  v-model="playgroundVariant"
  label="Variante"
  :items="playgroundVariantOptions"
  density="compact"
  data-testid="details-playground-variant"
/>

<v-checkbox
  v-model="playgroundLoading"
  label="Carregando"
  density="compact"
  hide-details
  data-testid="details-playground-loading"
/>
</template>
</playground>

## Ver também

Consulte a referência de [API do UDetails](../../api/components/details) para a lista completa de props e slots.

<script lang="ts" setup>
  import { ref, type ExtractPublicPropTypes } from "vue"
  import { UDetails } from "../../../dist/components.js"
  import { VSelect, VCheckbox } from "vuetify/components"

  type Props = ExtractPublicPropTypes<InstanceType<typeof UDetails>>

  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];

  const playgroundActions = ref({
    title: {
      label: "Título",
      value: "Título do conteúdo expansível",
      dataTestid: "details-playground-title"
    },
    content: {
      label: "Conteúdo",
      value: "Teste o componente Details com diferentes combinações de props",
      dataTestid: "details-playground-content"
    },
  });

  const playgroundVariant = ref(playgroundVariantOptions[0]);
  const playgroundLoading = ref(false);
</script>
