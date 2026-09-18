---
outline: deep
---

# Agrupador de Conteúdo

O componente padrão para agrupar conteúdo relacionado se chama `ContentSet`.

Dentro do mesmo também podemos adicionar o [`Content`](#componente-content).

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao agrupador de conteúdo. O padrão é `primary`.

<demo>
<content-set variant="primary" title="Primary">Conteúdo do agrupador primary</content-set>
<content-set variant="secondary" title="Secondary">Conteúdo do agrupador secondary</content-set>
</demo>

```vue
<template>
  <content-set variant="primary" title="Primary">Conteúdo do agrupador primary</content-set>
  <content-set variant="secondary" title="Secondary">Conteúdo do agrupador secondary</content-set>
</template>

<script lang="ts" setup>
import { ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

### Título e Subtítulo

As props `title` e `subtitle` definem o título e o subtítulo exibidos no topo do agrupador.

<demo>
<content-set title="Título do Agrupador" subtitle="Subtítulo descritivo">
  Conteúdo do agrupador com título e subtítulo 
</content-set>
</demo>

```vue
<template>
  <content-set title="Título do Agrupador" subtitle="Subtítulo descritivo">
    Conteúdo do agrupador com título e subtítulo
  </content-set>
</template>

<script lang="ts" setup>
import { ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

### Dimensões

#### Largura Total

Utilize a prop `fullWidth` para fazer o agrupador ocupar 100% da largura do seu container.

<demo>
<content-set title="Agrupador com 100% de largura" full-width>
  Conteúdo preenchendo toda a largura disponível
</content-set>
</demo>

```vue
<template>
  <content-set title="Agrupador com 100% de largura" full-width>
    Conteúdo preenchendo toda a largura disponível
  </content-set>
</template>

<script lang="ts" setup>
import { ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

#### Altura Total

Utilize a prop `fullHeight` para fazer o agrupador ocupar 100% da altura do seu container.

<demo>
<div style="height: 300px;">
  <content-set title="Agrupador com 100% de altura" full-height>
    Conteúdo preenchendo toda a altura disponível
  </content-set>
</div>
</demo>

```vue
<template>
  <div style="height: 300px;">
    <content-set title="Agrupador com 100% de altura" full-height>
      Conteúdo preenchendo toda a altura disponível
    </content-set>
  </div>
</template>

<script lang="ts" setup>
import { ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

### Ações

A prop `actions` define uma lista de botões exibidos na área de ações (rodapé) do agrupador.

<demo>
<div style="height: 300px;">
  <content-set title="Agrupador com Ações" :actions="demoActions" full-height>
    Conteúdo com ações disponíveis no rodapé
  </content-set>
</div>
</demo>

```vue
<template>
  <div style="height: 300px;">
    <content-set title="Agrupador com Ações" :actions="actions" full-height>
      Conteúdo com ações disponíveis no rodapé
    </content-set>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ContentSet } from "@nexdom/uimed-vue/components";

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
<content-set title="Carregando..." loading> Conteúdo do agrupador </content-set>
<content-set
  title="Carregando com actions..."
  :actions="[{ label: 'Salvar' }]"
  loading
>
  Conteúdo do agrupador com actions
</content-set>
</demo>

```vue
<template>
  <content-set title="Carregando..." loading> Conteúdo do agrupador </content-set>
  <content-set title="Carregando com actions..." :actions="[{ label: 'Salvar' }]" loading>
    Conteúdo do agrupador com actions
  </content-set>
</template>

<script lang="ts" setup>
import { ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

## Componente Content

O componente `Content` é utilizado para estruturar o conteúdo exibido dentro do `ContentSet`.

<demo>
<content-set title="Título do Agrupador">
  <content>Conteúdo estruturado com o componente Content</content>
</content-set>
</demo>

```vue
<template>
  <content-set title="Título do Agrupador">
    <content>Conteúdo estruturado com o componente Content</content>
  </content-set>
</template>

<script lang="ts" setup>
import { Content, ContentSet } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<content-set
  :variant="playgroundVariant"
  :title="playgroundActions.title.value"
  :subtitle="playgroundActions.subtitle.value"
  :full-width="playgroundFullWidth"
  :full-height="playgroundFullHeight"
  :loading="playgroundLoading"
  :actions="showPlaygroundActions ? playgroundActionsData : undefined"
  data-testid="content-set-preview"
>
  {{ playgroundActions.content.value }}
</content-set>

<template #actions>
<v-select
  v-model="playgroundVariant"
  label="Variante"
  :items="playgroundVariantOptions"
  density="compact"
  data-testid="content-set-playground-variant"
/>

<v-checkbox
  v-model="playgroundFullWidth"
  label="Largura Total"
  density="compact"
  hide-details
  data-testid="content-set-playground-fullWidth"
/>

<v-checkbox
  v-model="playgroundFullHeight"
  label="Altura Total"
  density="compact"
  hide-details
  data-testid="content-set-playground-fullHeight"
/>

<v-checkbox
  v-model="playgroundLoading"
  label="Carregando"
  density="compact"
  hide-details
data-testid="content-set-playground-loading"
/>

<v-checkbox
  v-model="showPlaygroundActions"
  label="Exibir ações"
  density="compact"
  hide-details
  data-testid="content-set-playground-actions"
/>
</template>
</playground>

## Ver também

Consulte a referência de [API do ContentSet](../../api/components/content-set) e da [API do Content](../../api/components/content) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref, type ExtractPublicPropTypes } from "vue"
  import { Content, ContentSet } from "../../../dist/components.js"
  import { VSelect, VTextField, VCheckbox } from "vuetify/components"

  type Props = ExtractPublicPropTypes<InstanceType<typeof ContentSet>>

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

  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];
  
  const playgroundActions = ref({
    content: {
      label: "Conteúdo",
      value: "Teste o componente ContentSet com diferentes combinações de props",
      dataTestid: "content-set-playground-content"
    },
    title: {
      label: "Título",
      value: "Título do Agrupador",
      dataTestid: "content-set-playground-title"
    },
    subtitle: {
      label: "Subtítulo",
      value: "Subtítulo descritivo",
      dataTestid: "content-set-playground-subtitle"
    },
  });

  const playgroundVariant = ref(playgroundVariantOptions[0]);
  const playgroundFullWidth = ref(false);
  const playgroundFullHeight = ref(false);
  const playgroundLoading = ref(false);
  const showPlaygroundActions = ref(true);

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
