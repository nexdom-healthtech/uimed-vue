---
outline: deep
---

# Botões de ícone

O componente para botões que exibem apenas um ícone se chama `IconButton`.

Use-o para ações que o ícone basta para identificar, como editar um registro de uma listagem. Quando a ação precisa de um texto para ser entendida, use o [Button](./button).

O ícone é ignorado pelos leitores de tela, que anunciam no lugar dele o texto da prop `label`, obrigatória. Por isso, esse texto deve descrever a ação do botão (por exemplo, "Editar paciente"), e não o desenho do ícone (por exemplo, "Lápis").

## Propriedades

### Ícone

A prop `icon`, obrigatória, recebe o nome de um dos ícones listados em [Ícones](../icons).

<demo data-testid="demo-icon">
<u-icon-button icon="home" label="Início" />
<u-icon-button icon="calendar" label="Agenda" />
<u-icon-button icon="cog-alternative" label="Configurações" />
</demo>

```vue
<template>
  <u-icon-button icon="home" label="Início" />
  <u-icon-button icon="calendar" label="Agenda" />
  <u-icon-button icon="cog-alternative" label="Configurações" />
</template>

<script lang="ts" setup>
import { UIconButton } from "@nexdom/uimed-vue/components";
</script>
```

### Cores

A prop `color` aceita um dos valores da paleta do componente: `primary`, `secondary`, `positive`, `informative`, `caution` ou `danger`. O padrão é `primary`.

<demo data-testid="demo-colors">
<u-icon-button icon="account" label="Perfil" color="primary" />
<u-icon-button icon="cog" label="Configurações" color="secondary" />
<u-icon-button icon="calendar" label="Agenda" color="positive" />
<u-icon-button icon="file-document" label="Documentos" color="informative" />
<u-icon-button icon="folder" label="Cadastros" color="caution" />
<u-icon-button icon="wallet" label="Financeiro" color="danger" />
</demo>

```vue
<template>
  <u-icon-button icon="account" label="Perfil" color="primary" />
  <u-icon-button icon="cog" label="Configurações" color="secondary" />
  <u-icon-button icon="calendar" label="Agenda" color="positive" />
  <u-icon-button icon="file-document" label="Documentos" color="informative" />
  <u-icon-button icon="folder" label="Cadastros" color="caution" />
  <u-icon-button icon="wallet" label="Financeiro" color="danger" />
</template>

<script lang="ts" setup>
import { UIconButton } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

### Clique

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo.

<demo data-testid="demo-click-event" items-center>
<u-icon-button icon="account-group" label="Adicionar paciente" data-testid="icon-btn-demo-click" @click="onClick" />
<span data-testid="icon-btn-demo-click-count">{{ clicks }} paciente(s)</span>
</demo>

```vue
<template>
  <u-icon-button icon="account-group" label="Adicionar paciente" @click="onClick" />
  <span>{{ clicks }} paciente(s)</span>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UIconButton } from "@nexdom/uimed-vue/components";

const clicks = ref(0);

function onClick() {
  clicks.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-icon-button :icon="playgroundActions.icon.value" :color="playgroundActions.color.value" label="Pré-visualização" data-testid="icon-btn-preview" />
</playground>

## Ver também

Consulte a referência de [API do UIconButton](../../api/components/icon-button) para a lista completa de props e eventos, e [Ícones](../icons) para todos os ícones disponíveis.

<script lang="ts" setup>
  import { ref } from "vue"
  import { icons } from "../../../dist/index.js"
  import { UIconButton } from "../../../dist/components.js"
  import type { ComponentProps } from "vue-component-type-helpers"

  const clicks = ref(0)

  function onClick() {
    clicks.value++
  }

  type Props = ComponentProps<typeof UIconButton>
  const playgroundIconOptions: Array<Props["icon"]> = [...icons]
  const playgroundColorOptions: Array<Props["color"]> = ["primary", "secondary", "positive", "informative", "caution", "danger"]

  const playgroundActions = ref({
    icon: {
      type: "combobox",
      label: "Ícone",
      value: playgroundIconOptions[0],
      dataTestid: "icon-btn-playground-icon",
      items: playgroundIconOptions
    },
    color: {
      type: "combobox",
      label: "Cor",
      value: playgroundColorOptions[0],
      dataTestid: "icon-btn-playground-color",
      items: playgroundColorOptions
    },
  })
</script>
