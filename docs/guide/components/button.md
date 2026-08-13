# Button

Componente utilizado como abstração do botão.
Deve ser utilizado ao invés do `<button>` nativo.

## Variantes

A prop `type` define a variação de estilo aplicada ao botão. O padrão é `elevated`.

::: raw
<div class="btn-demo-row">
  <btn type="elevated">Elevated</btn>
  <btn type="flat">Flat</btn>
  <btn type="outlined">Outlined</btn>
  <btn type="plain">Plain</btn>
  <btn type="text">Text</btn>
  <btn type="tonal">Tonal</btn>
</div>
:::

```vue
<template>
  <btn type="elevated">Elevated</btn>
  <btn type="flat">Flat</btn>
  <btn type="outlined">Outlined</btn>
  <btn type="plain">Plain</btn>
  <btn type="text">Text</btn>
  <btn type="tonal">Tonal</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Cores

A prop `color` aceita qualquer cor da paleta do tema ou um valor CSS válido (hexadecimal, `rgb()`, etc.).

::: raw
<div class="btn-demo-row">
  <btn color="primary">Primary</btn>
  <btn color="secondary">Secondary</btn>
  <btn color="success">Success</btn>
  <btn color="error">Error</btn>
  <btn color="warning">Warning</btn>
  <btn color="info">Info</btn>
</div>
:::

```vue
<template>
  <btn color="primary">Primary</btn>
  <btn color="secondary">Secondary</btn>
  <btn color="success">Success</btn>
  <btn color="error">Error</btn>
  <btn color="warning">Warning</btn>
  <btn color="info">Info</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

Também é possível utilizar uma cor customizada, informando diretamente um valor CSS:

::: raw
<div class="btn-demo-row">
  <btn color="#004f51">Cor customizada</btn>
</div>
:::

```vue
<template>
  <btn color="#004f51">Cor customizada</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Estados

### Desabilitado

Utilize a prop `disabled` para remover a possibilidade de clicar ou focar no botão.

::: raw
<div class="btn-demo-row">
  <btn disabled>Desabilitado</btn>
</div>
:::

```vue
<template>
  <btn disabled>Desabilitado</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um indicador de carregamento e desabilita a interação com o botão enquanto ativa.

::: raw
<div class="btn-demo-row">
  <btn loading>Carregando</btn>
</div>
:::

```vue
<template>
  <btn loading>Carregando</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Slots

### Loader customizado

Utilize o slot `loader` para substituir o indicador de carregamento padrão exibido enquanto a prop `loading` está ativa.

::: raw
<div class="btn-demo-row">
  <btn loading>
    Enviando
    <template #loader>
      <span>Enviando…</span>
    </template>
  </btn>
</div>
:::

```vue
<template>
  <btn loading>
    Enviando
    <template #loader>
      <span>Enviando…</span>
    </template>
  </btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Posicionamento

A prop `position` define a propriedade CSS `position` do botão, sendo útil, por exemplo, para fixar um botão de ação em um canto de um card.

::: warning
O componente não repassa atributos arbitrários (como `style`) para o elemento raiz. Para definir deslocamentos como `top`/`right` junto de `position="absolute"` ou `"fixed"`, utilize a prop `class` para aplicar uma classe customizada ao botão renderizado, como no exemplo abaixo. Apenas os valores `absolute` e `fixed` têm efeito visual.
:::

::: raw
<div class="btn-demo-card">
  <p>Conteúdo do card.</p>
  <btn position="absolute" color="secondary" class="card-action-btn">Ação</btn>
</div>
:::

```vue
<template>
  <div class="card">
    <p>Conteúdo do card.</p>
    <btn position="absolute" color="secondary" class="card-action-btn">Ação</btn>
  </div>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>

<style scoped>
.card {
  position: relative;
}

.card-action-btn {
  top: 12px;
  right: 12px;
}
</style>
```

## Classe customizada

A prop `class` aplica uma classe CSS customizada ao elemento raiz do botão, sendo mesclada com as classes geradas internamente pelo componente.

::: raw
<div class="btn-demo-row">
  <btn class="btn-demo-custom-class">Classe customizada</btn>
</div>
:::

```vue
<template>
  <btn class="my-custom-button">Classe customizada</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>

<style scoped>
.my-custom-button {
  outline: 2px dashed #ff5722;
  outline-offset: 2px;
}
</style>
```

## Eventos

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled`.

::: raw
<div class="btn-demo-row">
  <btn @click="onClick">Me clique</btn>
  <span>{{ clicks }} clique(s)</span>
</div>
:::

<script lang="ts" setup>
  import { computed, ref } from "vue"
  import { Button as Btn } from "../../../dist/components.js"
  import { VSelect, VSwitch, VTextField } from "vuetify/components"

  const clicks = ref(0)

  function onClick() {
    clicks.value++
  }

  type PlaygroundType = "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal"
  type PlaygroundPosition = "static" | "relative" | "absolute" | "fixed" | "sticky"

  const playgroundTypeOptions: PlaygroundType[] = ["elevated", "flat", "outlined", "plain", "text", "tonal"]
  const playgroundPaletteColorOptions = ["primary", "secondary", "success", "error", "warning", "info", "Customizada"]
  const playgroundPositionOptions: PlaygroundPosition[] = ["static", "relative", "absolute", "fixed", "sticky"]

  const playgroundType = ref<PlaygroundType>("elevated")
  const playgroundPaletteColor = ref("primary")
  const playgroundCustomColor = ref("#004f51")
  const playgroundColor = computed(() =>
    playgroundPaletteColor.value === "Customizada" ? playgroundCustomColor.value : playgroundPaletteColor.value
  )
  const playgroundLabel = ref("Me clique")
  const playgroundDisabled = ref(false)
  const playgroundLoading = ref(false)
  const playgroundCustomLoader = ref(false)
  const playgroundLoaderText = ref("Enviando…")
  const playgroundPosition = ref<PlaygroundPosition>("static")
</script>

```vue
<template>
  <btn @click="onClick">Me clique</btn>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Button as Btn } from "@nexdom/uimed-vue/components";

const clicks = ref(0);

function onClick() {
  clicks.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

::: raw
<div class="btn-playground">
  <div class="btn-playground-preview">
    <btn :type="playgroundType" :color="playgroundColor" :disabled="playgroundDisabled" :loading="playgroundLoading" :position="playgroundPosition">
      {{ playgroundLabel }}
      <template v-if="playgroundLoading && playgroundCustomLoader" #loader>
        <span>{{ playgroundLoaderText }}</span>
      </template>
    </btn>
  </div>
  <div class="btn-playground-controls">
    <v-select v-model="playgroundType" label="Variante" :items="playgroundTypeOptions" density="compact" />
    <v-select v-model="playgroundPaletteColor" label="Cor" :items="playgroundPaletteColorOptions" density="compact" />
    <v-text-field v-if="playgroundPaletteColor === 'Customizada'" v-model="playgroundCustomColor" label="Cor customizada (CSS)" density="compact" />
    <v-text-field v-model="playgroundLabel" label="Rótulo" density="compact" />
    <div class="btn-playground-switches">
      <v-switch v-model="playgroundDisabled" label="Desabilitado" density="compact" hide-details />
      <v-switch v-model="playgroundLoading" label="Carregando" density="compact" hide-details />
    </div>
    <v-switch v-if="playgroundLoading" v-model="playgroundCustomLoader" label="Loader customizado" density="compact" hide-details />
    <v-text-field v-if="playgroundLoading && playgroundCustomLoader" v-model="playgroundLoaderText" label="Texto do loader" density="compact" />
    <v-select v-model="playgroundPosition" label="Posição" :items="playgroundPositionOptions" hint="Apenas absolute e fixed têm efeito visual aqui; fixed é relativo à janela do navegador." persistent-hint density="compact" />
  </div>
</div>
:::

## Ver também

Consulte a [referência de API do Button](../../api/components/button.md) para a lista completa de props, slots e eventos.

<style scoped>
.btn-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.btn-demo-row :deep(.btn-demo-custom-class) {
  outline: 2px dashed #ff5722;
  outline-offset: 2px;
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

.btn-playground-preview :deep(.v-btn) {
  top: 12px;
  right: 12px;
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

.btn-demo-card {
  position: relative;
  padding: 16px;
  min-height: 96px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.btn-demo-card p {
  margin: 0;
  max-width: 75%;
}

.btn-demo-card :deep(.card-action-btn) {
  top: 12px;
  right: 12px;
}
</style>
