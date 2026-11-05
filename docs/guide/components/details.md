---
outline: deep
---

# Conteúdo Expansível

O componente padrão para exibir conteúdo que pode ser expandido e recolhido se chama `Details`. Ele agrupa itens (`DetailsItem`), cada um com um título e o seu conteúdo, em um acordeão.

> [!Warning]
> Deve ser utilizado no lugar do `<details>` nativo.

Os itens iniciam recolhidos, e o conteúdo de cada um é exibido ao clicar no seu título. Apenas um item fica expandido por vez: expandir um item recolhe o que estava expandido.

> [!Note]
> Até a versão 2, o `UDetails` recebia a prop `title` e exibia um único conteúdo. Agora, cada conteúdo é um `UDetailsItem` dentro do `UDetails`, com o seu próprio `title`.

## Itens

Cada `DetailsItem` recebe na prop `title` o texto exibido no seu cabeçalho, e o seu conteúdo no slot padrão.

<demo col>
<u-details data-testid="demo-details-items">
  <u-details-item title="Dados pessoais" data-testid="demo-details-item-personal">Nome, data de nascimento e documentos</u-details-item>
  <u-details-item title="Endereço" data-testid="demo-details-item-address">Rua, número, bairro e CEP</u-details-item>
  <u-details-item title="Contato" data-testid="demo-details-item-contact">Telefone e e-mail</u-details-item>
</u-details>
</demo>

```vue
<template>
  <u-details>
    <u-details-item title="Dados pessoais">Nome, data de nascimento e documentos</u-details-item>
    <u-details-item title="Endereço">Rua, número, bairro e CEP</u-details-item>
    <u-details-item title="Contato">Telefone e e-mail</u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```

## Propriedades

### Variantes

A prop `variant` do `Details` define a variação de estilo aplicada a todos os seus itens. O padrão é `primary`.

<demo col>
<u-details variant="primary">
  <u-details-item title="Primary">Conteúdo expansível primary</u-details-item>
</u-details>
<u-details variant="secondary">
  <u-details-item title="Secondary">Conteúdo expansível secondary</u-details-item>
</u-details>
</demo>

```vue
<template>
  <u-details variant="primary">
    <u-details-item title="Primary">Conteúdo expansível primary</u-details-item>
  </u-details>
  <u-details variant="secondary">
    <u-details-item title="Secondary">Conteúdo expansível secondary</u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` do `Details` exibe um skeleton loader no lugar dos itens enquanto uma operação está em andamento.

<demo col>
<u-details loading>
  <u-details-item title="Carregando...">Conteúdo expansível</u-details-item>
</u-details>
</demo>

```vue
<template>
  <u-details loading>
    <u-details-item title="Carregando...">Conteúdo expansível</u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-details
  :variant="playgroundActions.variant.value"
  :loading="playgroundActions.loading.value"
  data-testid="details-preview"
>
  <u-details-item :title="playgroundActions.title.value" data-testid="details-preview-item">
    {{ playgroundActions.content.value }}
  </u-details-item>
  <u-details-item title="Outro item">Conteúdo de outro item</u-details-item>
</u-details>
</playground>

## Ver também

Consulte a referência de API do [UDetails](../../api/components/details) e do [UDetailsItem](../../api/components/details-item) para a lista completa de props e slots.

<script lang="ts" setup>
  import { ref, type ExtractPublicPropTypes } from "vue"
  import { UDetails, UDetailsItem } from "../../../dist/components.js"

  type Props = ExtractPublicPropTypes<InstanceType<typeof UDetails>>

  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];

  const playgroundActions = ref({
    title: {
      label: "Título do primeiro item",
      value: "Título do conteúdo expansível",
      dataTestid: "details-playground-title"
    },
    content: {
      label: "Conteúdo do primeiro item",
      value: "Teste o componente Details com diferentes combinações de props",
      dataTestid: "details-playground-content"
    },
    variant: {
      type: "combobox",
      label: "Variante",
      value: playgroundVariantOptions[0],
      dataTestid: "details-playground-variant",
      items: playgroundVariantOptions
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "details-playground-loading"
    },
  });
</script>
