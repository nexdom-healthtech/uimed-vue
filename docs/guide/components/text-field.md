---
outline: deep
---

# Campos de texto

O componente para campos de texto se chama `TextField`.

> [!Warning]
> Deve ser utilizado no lugar do `<input>` nativo.

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao campo. O padrão é `primary`.

<demo>
<u-text-field label="Primary" variant="primary" />
<u-text-field label="Secondary" variant="secondary" />
</demo>

```vue
<template>
  <u-text-field label="Primary" variant="primary" />
  <u-text-field label="Secondary" variant="secondary" />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

### Labels

A prop `label` aceita um texto que identifica a informação a ser preenchida no campo.

<demo>
<u-text-field label="Primeiro nome" />
<u-text-field label="Sobrenome" />
</demo>

```vue
<template>
  <u-text-field label="Primeiro nome" />
  <u-text-field label="Sobrenome" />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

### Placeholders

A prop `placeholder` aceita um texto que fornece um exemplo ou instrução sobre o formato do dado que pode ser preenchido no campo.

<demo>
<u-text-field label="E-mail" type="email" placeholder="me.nexdom@gmail.com" />
</demo>

```vue
<template>
  <u-text-field label="E-mail" type="email" placeholder="me.nexdom@gmail.com" />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

### Mensagens

A prop `hint` recebe um texto que será apresentado como uma dica para oferecer mais instruções ao usuário que virá a preencher o campo.

<demo>
<u-text-field label="URL" type="url" hint="https://google.com ou http://localhost:8080" />
</demo>

```vue
<template>
  <u-text-field label="URL" type="url" hint="https://google.com ou http://localhost:8080" />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para indicar ao usuário que não há possibilidade de interação com o campo.

<demo>
<u-text-field label="Desabilitado" disabled />
</demo>

```vue
<template>
  <u-text-field label="Desabilitado" disabled />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

#### Somente leitura

Utilize a prop `readonly` para evitar que o valor presente em um campo seja alterado.

<demo>
<u-text-field modelValue="Valor inicial" label="Somente leitura" readonly />
</demo>

```vue
<template>
  <u-text-field modelValue="Valor inicial" label="Somente leitura" readonly />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento no campo enquanto ativa.

<demo>
<u-text-field label="Carregando" loading />
</demo>

```vue
<template>
  <u-text-field label="Carregando" loading />
</template>

<script lang="ts" setup>
import { UTextField } from "@nexdom/uimed-vue/components";
</script>
```

## Eventos

### Atualização

O evento `update:modelValue` será emitido toda vez que o valor do campo for alterado pelo usuário, repassando o novo valor como uma `string`.

<demo data-testid="demo-update-event">
<u-text-field label="Texto" :model-value :hint data-testid="text-field-demo-update" @update:modelValue="onUpdateValue" />
</demo>

```vue
<template>
  <u-text-field label="Texto" :model-value :hint @update:modelValue="onUpdateValue" />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { UTextField } from "@nexdom/uimed-vue/components";

const modelValue = ref("Me altere!");
const changes = ref(0);
const hint = computed(() => `${changes.value} alteração(ões)`);

function onUpdateValue(newValue: string) {
  modelValue.value = newValue;
  changes.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-text-field :label="playgroundActions.label.value" :placeholder="playgroundActions.placeholder.value" :hint="playgroundActions.hint.value" :variant="playgroundVariant" :disabled="playgroundActions.disabled.value" :readonly="playgroundActions.readonly.value" :loading="playgroundActions.loading.value" :clearable="playgroundActions.clearable.value" data-testid="text-field-preview" />

<template #actions>
<v-select v-model="playgroundVariant" label="Variante" :items="playgroundVariantOptions" density="compact" data-testid="text-field-playground-variant" />
</template>
</playground>

## Ver também

Consulte a referência de [API do UTextField](../../api/components/text-field) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { computed, ref } from "vue"
  import { UTextField } from "../../../dist/components.js"
  import { VSelect } from "vuetify/components"
import type { ComponentProps } from "vue-component-type-helpers";

  const modelValue = ref("Me altere!");
  const changes = ref(0);
  const hint = computed(() => `${changes.value} alteração(ões)`);

  function onUpdateValue(newValue: string) {
    modelValue.value = newValue;
    changes.value++;
  }

  type Props = ComponentProps<typeof UTextField>;
  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];

  const playgroundActions = ref({
    label: {
      type: "text",
      label: "Label",
      value: "Label",
      dataTestid: "text-field-playground-label"
    },
    placeholder: {
      type: "text",
      label: "Placeholder",
      value: "Placeholder",
      dataTestid: "text-field-playground-placeholder",
    },
    hint: {
      type: "text",
      label: "Mensagem",
      value: "Hint",
      dataTestid: "text-field-playground-hint"
    },
    disabled: {
      type: "checkbox",
      value: false,
      label: "Desabilitado",
      dataTestid: "text-field-playground-disabled"
    },
    readonly: {
      type: "checkbox",
      value: false,
      label: "Somente leitura",
      dataTestid: "text-field-playground-readonly"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "text-field-playground-loading"
    },
    clearable: {
      type: "checkbox",
      value: false,
      label: "Limpável",
      dataTestid: "text-field-playground-clearable"
    },
  });

  const playgroundVariant = ref(playgroundVariantOptions[0]);
</script>
