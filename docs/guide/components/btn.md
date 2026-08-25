# Btn

Componente para botão.

> [!Warning]
> Deve ser utilizado no lugar do `<button>` nativo.

## Variantes

A prop `variant` define a variação de estilo aplicada ao botão. O padrão é `primary`.

::: raw
<div class="btn-demo-row">
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
<div class="btn-demo-row" >
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
  <btn color="secondary">Secondary</btn>
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
<div class="btn-demo-row" >
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
<div class="btn-demo-row" >
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
<div class="btn-demo-row" >
  <btn data-testid="btn-demo-click" @click="onClick">Me clique</btn>
  <span data-testid="btn-demo-click-count">{{ clicks }} clique(s)</span>
</div>
:::

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
<playground>
<btn :variant="playgroundVariant" :color="playgroundColor" :disabled="playgroundDisabled" :loading="playgroundLoading" data-testid="btn-preview">
{{ playgroundLabel }}
</btn>

<template #actions>
<v-select v-model="playgroundVariant" label="Variante" :items="playgroundVariantOptions" density="compact" data-testid="btn-playground-variant" />

<v-select v-model="playgroundColor" label="Cor" :items="playgroundColorOptions" density="compact" data-testid="btn-playground-color" />

<v-text-field v-model="playgroundLabel" label="Texto" density="compact" data-testid="btn-playground-label" />

<v-checkbox v-model="playgroundDisabled" label="Desabilitado" density="compact" hide-details data-testid="btn-playground-disabled" />

<v-checkbox v-model="playgroundLoading" label="Carregando" density="compact" hide-details />
</template>
</playground>
:::

## Ver também

Consulte a [referência de API do Btn](../../api/components/btn) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { Btn } from "../../../dist/components.js"
  import { VSelect, VCheckbox, VTextField } from "vuetify/components"

  const clicks = ref(0);

  function onClick() {
    clicks.value++
  }

  const playgroundVariantOptions: Array<InstanceType<typeof Btn>["$props"]["variant"]> = ["primary", "secondary", "ghost"];
  const playgroundColorOptions: Array<InstanceType<typeof Btn>["$props"]["color"]> = ["primary", "secondary", "positive", "informative", "caution", "danger"];

  const playgroundVariant = ref(playgroundVariantOptions[0]);
  const playgroundColor = ref(playgroundColorOptions[0]);
  const playgroundLabel = ref("Me clique")
  const playgroundDisabled = ref(false)
  const playgroundLoading = ref(false)
</script>

<style lang="scss" scoped>
.btn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
</style>
