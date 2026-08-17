# Btn

Componente utilizado como abstração do botão.
Deve ser utilizado ao invés do `<button>` nativo.

## Variantes

A prop `variant` define a variação de estilo aplicada ao botão. O padrão é `primary`.

::: raw
<div class="btn-demo-row" data-test="btn-demo-variants">
  <btn variant="primary">Primary</btn>
  <btn variant="secondary">Secondary</btn>
  <btn variant="ghost">Ghost</btn>
</div>
:::

```vue
<template>
  <btn variant="primary">Primary</btn>
  <btn variant="secondary">Secondary</btn>
  <btn variant="ghost">Ghost</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Cores

A prop `color` aceita um dos valores da paleta do componente: `primary`, `secondary`, `positive`, `informative`, `caution` ou `danger`.

::: raw
<div class="btn-demo-row" data-test="btn-demo-colors">
  <btn color="primary">Primary</btn>
  <btn color="secondary">Secondary</btn>
  <btn color="positive">Positive</btn>
  <btn color="informative">Informative</btn>
  <btn color="caution">Caution</btn>
  <btn color="danger">Danger</btn>
</div>
:::

```vue
<template>
  <btn color="primary">Primary</btn>
  <btn color="Secondary">Secondary</btn>
  <btn color="positive">Positive</btn>
  <btn color="informative">Informative</btn>
  <btn color="caution">Caution</btn>
  <btn color="danger">Danger</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Estados

### Desabilitado

Utilize a prop `disabled` para remover a possibilidade de clicar ou focar no botão.

::: raw
<div class="btn-demo-row" data-test="btn-demo-disabled">
  <btn disabled>Desabilitado</btn>
</div>
:::

```vue
<template>
  <btn disabled>Desabilitado</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um indicador de carregamento e desabilita a interação com o botão enquanto ativa.

::: raw
<div class="btn-demo-row" data-test="btn-demo-loading">
  <btn loading>Carregando</btn>
</div>
:::

```vue
<template>
  <btn loading>Carregando</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled`.

::: raw
<div class="btn-demo-row" data-test="btn-demo-click">
  <btn @click="onClick">Me clique</btn>
  <span data-test="btn-demo-click-count">{{ clicks }} clique(s)</span>
</div>
:::

<script lang="ts" setup>
  import { ref } from "vue"
  import { Btn } from "../../../dist/components.js"
  import { VSelect, VSwitch, VTextField } from "vuetify/components"

  const clicks = ref(0)

  function onClick() {
    clicks.value++
  }

  type PlaygroundVariant = "primary" | "secondary" | "ghost"
  type PlaygroundColor = "primary" | "secondary" | "positive" | "informative" | "caution" | "danger"

  const playgroundVariantOptions: PlaygroundVariant[] = ["primary", "secondary", "ghost"]
  const playgroundColorOptions: PlaygroundColor[] = ["primary", "secondary", "positive", "informative", "caution", "danger"]

  const playgroundVariant = ref<PlaygroundVariant>("primary")
  const playgroundColor = ref<PlaygroundColor>("primary")
  const playgroundLabel = ref("Me clique")
  const playgroundDisabled = ref(false)
  const playgroundLoading = ref(false)
</script>

```vue
<template>
  <btn @click="onClick">Me clique</btn>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Btn } from "@nexdom/uimed-vue/components";

const clicks = ref(0);

function onClick() {
  clicks.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

::: raw
<div class="btn-playground" data-test="btn-playground">
  <div class="btn-playground-preview" data-test="btn-playground-preview">
    <btn :variant="playgroundVariant" :color="playgroundColor" :disabled="playgroundDisabled" :loading="playgroundLoading">
      {{ playgroundLabel }}
    </btn>
  </div>
  <div class="btn-playground-controls" data-test="btn-playground-controls">
    <v-select v-model="playgroundVariant" label="Variante" :items="playgroundVariantOptions" density="compact" data-test="btn-playground-variant" />
    <v-select v-model="playgroundColor" label="Cor" :items="playgroundColorOptions" density="compact" data-test="btn-playground-color" />
    <v-text-field v-model="playgroundLabel" label="Rótulo" density="compact" data-test="btn-playground-label" />
    <div class="btn-playground-switches">
      <v-switch v-model="playgroundDisabled" label="Desabilitado" density="compact" hide-details data-test="btn-playground-disabled" />
      <v-switch v-model="playgroundLoading" label="Carregando" density="compact" hide-details data-test="btn-playground-loading" />
    </div>
  </div>
</div>
:::

## Ver também

Consulte a [referência de API do Btn](../../api/components/btn.md) para a lista completa de props, slots e eventos.

<style scoped>
.btn-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.btn-playground {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  grid-template-areas: "preview controls";
  gap: 16px;
}

@media (max-width: 719px) {
  .btn-playground {
    grid-template-columns: 1fr;
    grid-template-areas:
      "preview"
      "controls";
  }
}

.btn-playground-preview {
  grid-area: preview;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.btn-playground-controls {
  grid-area: controls;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-playground-switches {
  display: flex;
  gap: 16px;
}
</style>
