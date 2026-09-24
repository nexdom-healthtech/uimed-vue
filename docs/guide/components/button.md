---
outline: deep
---

# Botões

O componente padrão para botões se chama `Button`.

> [!Warning]
> Deve ser utilizado no lugar do `<button>` nativo.

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao botão. O padrão é `primary`.

<demo>
<u-button variant="primary">Primary</u-button>
<u-button variant="secondary">Secondary</u-button>
<u-button variant="ghost">Ghost</u-button>
</demo>

```vue
<template>
  <u-button variant="primary">Primary</u-button>
  <u-button variant="secondary">Secondary</u-button>
  <u-button variant="ghost">Ghost</u-button>
</template>

<script lang="ts" setup>
import { UButton } from "@nexdom/uimed-vue/components";
</script>
```

### Cores

A prop `color` aceita um dos valores da paleta do componente: `primary`, `secondary`, `positive`, `informative`, `caution` ou `danger`.

<demo>
<u-button color="primary">Primary</u-button>
<u-button color="secondary">Secondary</u-button>
<u-button color="positive">Positive</u-button>
<u-button color="informative">Informative</u-button>
<u-button color="caution">Caution</u-button>
<u-button color="danger">Danger</u-button>
</demo>

```vue
<template>
  <u-button color="primary">Primary</u-button>
  <u-button color="secondary">Secondary</u-button>
  <u-button color="positive">Positive</u-button>
  <u-button color="informative">Informative</u-button>
  <u-button color="caution">Caution</u-button>
  <u-button color="danger">Danger</u-button>
</template>

<script lang="ts" setup>
import { UButton } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para remover a possibilidade de clicar ou focar no botão.

<demo>
<u-button disabled>Desabilitado</u-button>
</demo>

```vue
<template>
  <u-button disabled>Desabilitado</u-button>
</template>

<script lang="ts" setup>
import { UButton } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento e desabilita a interação com o botão enquanto ativa.

<demo>
<u-button loading>Carregando</u-button>
</demo>

```vue
<template>
  <u-button loading>Carregando</u-button>
</template>

<script lang="ts" setup>
import { UButton } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

### Clique

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled`.

<demo data-testid="demo-click-event" items-center>
<u-button data-testid="btn-demo-click" @click="onClick">Me clique</u-button>
<span data-testid="btn-demo-click-count">{{ clicks }} clique(s)</span>
</demo>

```vue
<template>
  <u-button @click="onClick">Me clique</u-button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UButton } from "@nexdom/uimed-vue/components";

const clicks = ref(0);

function onClick() {
  clicks.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-button :variant="playgroundActions.variant.value" :color="playgroundActions.color.value" :disabled="playgroundActions.disabled.value" :loading="playgroundActions.loading.value" data-testid="btn-preview">
{{ playgroundActions.label.value }}
</u-button>
</playground>

## Ver também

Consulte a referência de [API do UButton](../../api/components/button) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UButton } from "../../../dist/components.js"
import type { ComponentProps } from "vue-component-type-helpers";

  const clicks = ref(0);

  function onClick() {
    clicks.value++
  }

type Props = ComponentProps<typeof UButton>;
  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary", "ghost"];
  const playgroundColorOptions: Array<Props["color"]> = ["primary", "secondary", "positive", "informative", "caution", "danger"];

  const playgroundActions = ref({
    label: {
      type: "text",
      label: "Texto",
      value: "Me clique",
      dataTestid: "btn-playground-label"
    },
    variant: {
      type: "combobox",
      label: "Variante",
      value: "primary",
      dataTestid: "btn-playground-variant",
      items: ["primary", "secondary", "ghost"]
    },
    color: {
      type: "combobox",
      label: "Cor",
      value: "primary",
      dataTestid: "btn-playground-color",
      items: ["primary", "secondary", "positive", "informative", "caution", "danger"]
    },
    disabled: {
      type: "checkbox",
      value: false,
      label: "Desabilitado",
      dataTestid: "btn-playground-disabled"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "btn-playground-loading"
    },
  });
</script>
