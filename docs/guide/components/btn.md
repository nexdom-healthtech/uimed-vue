---
outline: deep
---

# Botões

O componente padrão para botões se chama `Btn`.

> [!Warning]
> Deve ser utilizado no lugar do `<button>` nativo.

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao botão. O padrão é `primary`.

<demo>
<btn variant="primary">Primary</btn>
<btn variant="secondary">Secondary</btn>
<btn variant="ghost">Ghost</btn>
</demo>

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

### Cores

A prop `color` aceita um dos valores da paleta do componente: `primary`, `secondary`, `positive`, `informative`, `caution` ou `danger`.

<demo>
<btn color="primary">Primary</btn>
<btn color="secondary">Secondary</btn>
<btn color="positive">Positive</btn>
<btn color="informative">Informative</btn>
<btn color="caution">Caution</btn>
<btn color="danger">Danger</btn>
</demo>

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

### Estados

#### Desabilitado

Utilize a prop `disabled` para remover a possibilidade de clicar ou focar no botão.

<demo>
<btn disabled>Desabilitado</btn>
</demo>

```vue
<template>
  <btn disabled>Desabilitado</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento e desabilita a interação com o botão enquanto ativa.

<demo>
<btn loading>Carregando</btn>
</demo>

```vue
<template>
  <btn loading>Carregando</btn>
</template>

<script lang="ts" setup>
import { Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

### Clique

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled`.

<demo data-testid="demo-click-event">
<btn data-testid="btn-demo-click" @click="onClick">Me clique</btn>
<span data-testid="btn-demo-click-count">{{ clicks }} clique(s)</span>
</demo>

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

<playground v-model:actions="playgroundActions">
<btn :variant="playgroundVariant" :color="playgroundColor" :disabled="playgroundDisabled" :loading="playgroundLoading" data-testid="btn-preview">
{{ playgroundActions.label.value }}
</btn>

<template #actions>
<v-select v-model="playgroundVariant" label="Variante" :items="playgroundVariantOptions" density="compact" data-testid="btn-playground-variant" />

<v-select v-model="playgroundColor" label="Cor" :items="playgroundColorOptions" density="compact" data-testid="btn-playground-color" />

<v-checkbox v-model="playgroundDisabled" label="Desabilitado" density="compact" hide-details data-testid="btn-playground-disabled" />

<v-checkbox v-model="playgroundLoading" label="Carregando" density="compact" hide-details data-testid="btn-playground-loading" />
</template>
</playground>

## Ver também

Consulte a referência de [API do Btn](../../api/components/btn) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref, type ExtractPublicPropTypes } from "vue"
  import { Btn } from "../../../dist/components.js"
  import { VSelect, VCheckbox } from "vuetify/components"

  const clicks = ref(0);

  function onClick() {
    clicks.value++
  }

type Props = ExtractPublicPropTypes<InstanceType<typeof Btn>>
  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary", "ghost"];
  const playgroundColorOptions: Array<Props["color"]> = ["primary", "secondary", "positive", "informative", "caution", "danger"];

  const playgroundActions = ref({
    label: {
      label: "Texto",
      value: "Me clique",
      dataTestid: "btn-playground-label"
    },
  });

  const playgroundVariant = ref(playgroundVariantOptions[0]);
  const playgroundColor = ref(playgroundColorOptions[0]);
  const playgroundDisabled = ref(false)
  const playgroundLoading = ref(false)
</script>
