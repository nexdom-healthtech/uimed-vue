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

A prop `loading` exibe um indicador de carregamento e desabilita o botão enquanto ativa, assim como a prop `disabled`: não é possível clicar ou focar no botão, o evento `click` não é disparado e o formulário do botão não é enviado. Nesse estado, o botão tem a aparência de desabilitado, com o indicador de carregamento, e, se estiver focado, perde o foco ao entrar em carregamento, como qualquer botão desabilitado. O botão mantém o texto como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador. Veja também o [envio com carregamento](./form#envio-com-carregamento) de formulários.

Clique no botão abaixo para simular uma ação de 1,5 segundo. Novos cliques são ignorados enquanto ela é executada.

<demo data-testid="demo-loading" items-center>
<u-button :loading="isSaving" data-testid="btn-demo-loading" @click="onSave">Salvar</u-button>
<span data-testid="btn-demo-loading-count">{{ saves }} salvamento(s)</span>
</demo>

```vue
<template>
  <u-button :loading="isSaving" @click="onSave">Salvar</u-button>
  <span>{{ saves }} salvamento(s)</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UButton } from "@nexdom/uimed-vue/components";

const saves = ref(0);
const isSaving = ref(false);

async function onSave() {
  saves.value++;
  isSaving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isSaving.value = false;
}
</script>
```

### Largura total

Utilize a prop `fullWidth` (`full-width` no template) para fazer o botão ocupar 100% da largura do elemento em que está, como a única ação de um formulário em telas pequenas.

<demo>
<u-button full-width data-testid="btn-demo-full-width">Largura total</u-button>
</demo>

```vue
<template>
  <u-button full-width>Largura total</u-button>
</template>

<script lang="ts" setup>
import { UButton } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

### Clique

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled` ou `loading`.

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
<u-button :variant="playgroundActions.variant.value" :color="playgroundActions.color.value" :disabled="playgroundActions.disabled.value" :loading="playgroundActions.loading.value" :full-width="playgroundActions.fullWidth.value" data-testid="btn-preview">
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

  const saves = ref(0);
  const isSaving = ref(false);

  async function onSave() {
    saves.value++;
    isSaving.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    isSaving.value = false;
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
      value: playgroundVariantOptions[0],
      dataTestid: "btn-playground-variant",
      items: playgroundVariantOptions
    },
    color: {
      type: "combobox",
      label: "Cor",
      value: playgroundColorOptions[0],
      dataTestid: "btn-playground-color",
      items: playgroundColorOptions
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
    fullWidth: {
      type: "checkbox",
      value: false,
      label: "Largura total",
      dataTestid: "btn-playground-full-width"
    },
  });
</script>
