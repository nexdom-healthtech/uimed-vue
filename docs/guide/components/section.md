---
outline: deep
---

# Agrupador de Conteúdo

O componente padrão para agrupar conteúdo relacionado se chama `Section`.

Dentro do mesmo também podemos adicionar o [`SectionContent`](#componente-sectioncontent).

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao agrupador de conteúdo. O padrão é `primary`.

<demo>
<u-section variant="primary" title="Primary">Conteúdo do agrupador primary</u-section>
<u-section variant="secondary" title="Secondary">Conteúdo do agrupador secondary</u-section>
</demo>

```vue
<template>
  <u-section variant="primary" title="Primary">Conteúdo do agrupador primary</u-section>
  <u-section variant="secondary" title="Secondary">Conteúdo do agrupador secondary</u-section>
</template>

<script lang="ts" setup>
import { USection } from "@nexdom/uimed-vue/components";
</script>
```

### Título e Subtítulo

As props `title` e `subtitle` definem o título e o subtítulo exibidos no topo do agrupador.

<demo>
<u-section title="Título do Agrupador" subtitle="Subtítulo descritivo">
  Conteúdo do agrupador com título e subtítulo 
</u-section>
</demo>

```vue
<template>
  <u-section title="Título do Agrupador" subtitle="Subtítulo descritivo">
    Conteúdo do agrupador com título e subtítulo
  </u-section>
</template>

<script lang="ts" setup>
import { USection } from "@nexdom/uimed-vue/components";
</script>
```

### Dimensões

#### Largura Total

Utilize a prop `fullWidth` para fazer o agrupador ocupar 100% da largura do seu container.

<demo>
<u-section title="Agrupador com 100% de largura" full-width>
  Conteúdo preenchendo toda a largura disponível
</u-section>
</demo>

```vue
<template>
  <u-section title="Agrupador com 100% de largura" full-width>
    Conteúdo preenchendo toda a largura disponível
  </u-section>
</template>

<script lang="ts" setup>
import { USection } from "@nexdom/uimed-vue/components";
</script>
```

#### Altura Total

Utilize a prop `fullHeight` para fazer o agrupador ocupar 100% da altura do seu container.

<demo>
<div style="height: 300px;">
  <u-section title="Agrupador com 100% de altura" full-height>
    Conteúdo preenchendo toda a altura disponível
  </u-section>
</div>
</demo>

```vue
<template>
  <div style="height: 300px;">
    <u-section title="Agrupador com 100% de altura" full-height>
      Conteúdo preenchendo toda a altura disponível
    </u-section>
  </div>
</template>

<script lang="ts" setup>
import { USection } from "@nexdom/uimed-vue/components";
</script>
```

### Ações

A prop `actions` define uma lista de botões exibidos na área de ações (rodapé) do agrupador.

<demo>
<div style="height: 300px;">
  <u-section title="Agrupador com Ações" :actions="demoActions" full-height>
    Conteúdo com ações disponíveis no rodapé
  </u-section>
</div>
</demo>

```vue
<template>
  <div style="height: 300px;">
    <u-section title="Agrupador com Ações" :actions="actions" full-height>
      Conteúdo com ações disponíveis no rodapé
    </u-section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { USection } from "@nexdom/uimed-vue/components";

const actions = ref([
  {
    label: "Salvar",
    color: "positive",
    onClick: () => alert("Salvar clicado"),
  },
  {
    label: "Cancelar",
    variant: "ghost",
    onClick: () => alert("Cancelar clicado"),
  },
]);
</script>
```

### Carregamento

A prop `loading` exibe um skeleton loader no lugar do conteúdo enquanto uma operação está em andamento.

<demo col>
<u-section title="Carregando..." loading> Conteúdo do agrupador </u-section>
<u-section
  title="Carregando com actions..."
  :actions="[{ label: 'Salvar' }]"
  loading
>
  Conteúdo do agrupador com actions
</u-section>
</demo>

```vue
<template>
  <u-section title="Carregando..." loading> Conteúdo do agrupador </u-section>
  <u-section title="Carregando com actions..." :actions="[{ label: 'Salvar' }]" loading>
    Conteúdo do agrupador com actions
  </u-section>
</template>

<script lang="ts" setup>
import { USection } from "@nexdom/uimed-vue/components";
</script>
```

## Componente SectionContent

O componente `SectionContent` é utilizado para estruturar o conteúdo exibido dentro do `Section`.

<demo>
<u-section title="Título do Agrupador">
  <u-section-content>Conteúdo estruturado com o componente SectionContent</u-section-content>
</u-section>
</demo>

```vue
<template>
  <u-section title="Título do Agrupador">
    <u-section-content>Conteúdo estruturado com o componente SectionContent</u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import { USectionContent, USection } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-section
  :variant="(playgroundActions.variant.value as Props['variant'])"
  :title="playgroundActions.title.value"
  :subtitle="playgroundActions.subtitle.value"
  :full-width="playgroundActions.fullWidth.value"
  :full-height="playgroundActions.fullHeight.value"
  :loading="playgroundActions.loading.value"
  :actions="playgroundActions.showActions.value ? playgroundActionsData : undefined"
  data-testid="content-set-preview"
>
  {{ playgroundActions.content.value }}
</u-section>
</playground>

## Ver também

Consulte a referência de [API do USection](../../api/components/sections/section) e da [API do USectionContent](../../api/components/sections/section-content) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { USection } from "../../../dist/components.js"
import type { ComponentProps } from "vue-component-type-helpers";

  type Props = ComponentProps<typeof USection>;

  const demoActions = ref<Props["actions"]>([
    {
      label: "Salvar",
      color: "positive",
      onClick: () => alert("Salvar clicado"),
    },
    {
      label: "Cancelar",
      variant: "ghost",
      onClick: () => alert("Cancelar clicado"),
    },
  ]);

  const playgroundActions = ref({
    content: {
      type: "text",
      label: "Conteúdo",
      value: "Teste o componente Section com diferentes combinações de props",
      dataTestid: "content-set-playground-content"
    },
    title: {
      type: "text",
      label: "Título",
      value: "Título do Agrupador",
      dataTestid: "content-set-playground-title"
    },
    subtitle: {
      type: "text",
      label: "Subtítulo",
      value: "Subtítulo descritivo",
      dataTestid: "content-set-playground-subtitle"
    },
    variant: {
      type: "combobox",
      label: "Variante",
      value: "primary",
      dataTestid: "content-set-playground-variant",
      items: ["primary", "secondary"]
    },
    fullWidth: {
      type: "checkbox",
      value: false,
      label: "Largura Total",
      dataTestid: "content-set-playground-fullWidth"
    },
    fullHeight: {
      type: "checkbox",
      value: false,
      label: "Altura Total",
      dataTestid: "content-set-playground-fullHeight"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "content-set-playground-loading"
    },
    showActions: {
      type: "checkbox",
      value: true,
      label: "Exibir ações",
      dataTestid: "content-set-playground-actions"
    },
  });

  const playgroundActionsData = ref<Props["actions"]>([
    {
      label: "Salvar",
      color: "positive",
      onClick: () => alert("Salvar clicado"),
    },
    {
      label: "Cancelar",
      variant: "ghost",
      onClick: () => alert("Cancelar clicado"),
    },
  ]);
</script>
