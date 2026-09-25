---
outline: deep
---

# Campos com preenchimento automático

O componente para campos com preenchimento automático (autocomplete) se chama `AutocompleteField`.

> [!Warning]
> Deve ser utilizado no lugar do `<select>` nativo ou da combinação `<input>` com lista de sugestões.

## Propriedades

### Variantes

A prop `variant` define a variação de estilo aplicada ao campo. O padrão é `primary`.

<demo>
<u-autocomplete-field label="Primary" variant="primary" :items="['Brasil', 'Portugal', 'Moçambique']" />
<u-autocomplete-field label="Secondary" variant="secondary" :items="['Brasil', 'Portugal', 'Moçambique']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    label="Primary"
    variant="primary"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
  <u-autocomplete-field
    label="Secondary"
    variant="secondary"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

### Labels

A prop `label` aceita um texto que identifica a informação a ser preenchida no campo.

<demo>
<u-autocomplete-field label="País" :items="['Brasil', 'Portugal']" />
<u-autocomplete-field label="Cidade" :items="['São Paulo', 'Rio de Janeiro']" />
</demo>

```vue
<template>
  <u-autocomplete-field label="País" :items="['Brasil', 'Portugal']" />
  <u-autocomplete-field label="Cidade" :items="['São Paulo', 'Rio de Janeiro']" />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

### Placeholders

A prop `placeholder` aceita um texto que fornece um exemplo ou instrução sobre o dado que pode ser selecionado no campo.

<demo>
<u-autocomplete-field label="Selecione um país" placeholder="Ex: Brasil" :items="['Brasil', 'Portugal', 'Moçambique']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    label="Selecione um país"
    placeholder="Ex: Brasil"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

### Mensagens

A prop `hint` recebe um texto que será apresentado como uma dica para oferecer mais instruções ao usuário.

<demo>
<u-autocomplete-field label="País" hint="Selecione um país da lista" :items="['Brasil', 'Portugal', 'Moçambique']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    label="País"
    hint="Selecione um país da lista"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para indicar ao usuário que não há possibilidade de interação com o campo.

<demo>
<u-autocomplete-field label="Desabilitado" disabled :items="['Brasil', 'Portugal']" />
</demo>

```vue
<template>
  <u-autocomplete-field label="Desabilitado" disabled :items="['Brasil', 'Portugal']" />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

#### Somente leitura

Utilize a prop `readonly` para evitar que o valor presente em um campo seja alterado.

<demo>
<u-autocomplete-field modelValue="Brasil" label="Somente leitura" readonly :items="['Brasil', 'Portugal']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    modelValue="Brasil"
    label="Somente leitura"
    readonly
    :items="['Brasil', 'Portugal']"
  />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento no campo enquanto ativa.

<demo>
<u-autocomplete-field label="Carregando" loading :items="['Brasil', 'Portugal']" />
</demo>

```vue
<template>
  <u-autocomplete-field label="Carregando" loading :items="['Brasil', 'Portugal']" />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

#### Limpável

A prop `clearable` exibe um recurso para limpar o campo.

<demo>
<u-autocomplete-field label="Limpável" clearable :items="['Brasil', 'Portugal']" />
</demo>

```vue
<template>
  <u-autocomplete-field label="Limpável" clearable :items="['Brasil', 'Portugal']" />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

## Comportamentos específicos

### Modo restrito vs digitação livre

A prop `strict` controla o comportamento do campo:

- Quando `strict` é `false` (padrão), permite digitar valores não presentes na lista
- Quando `strict` é `true`, força a seleção de itens da lista

<demo>
<u-autocomplete-field label="Modo freeform (strict=false)" :strict="false" :items="['Brasil', 'Portugal', 'Moçambique']" />
<u-autocomplete-field label="Modo restrito (strict=true)" :strict="true" :items="['Brasil', 'Portugal', 'Moçambique']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    label="Modo freeform"
    :strict="false"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
  <u-autocomplete-field
    label="Modo restrito"
    :strict="true"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";
</script>
```

### Seleção múltipla

A prop `multiple` permite a seleção de mais de um valor.

<demo>
<u-autocomplete-field v-model="multipleValue" label="Selecione países" :multiple="true" :items="['Brasil', 'Portugal', 'Moçambique']" />
</demo>

```vue
<template>
  <u-autocomplete-field
    v-model="multipleValue"
    label="Selecione países"
    :multiple="true"
    :items="['Brasil', 'Portugal', 'Moçambique']"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UAutocompleteField } from "@nexdom/uimed-vue/components";

const multipleValue = ref<string[]>([]);
</script>
```

### Itens com label e value

Os itens podem ser objetos com `label` (texto exibido) e `value` (valor interno).

<demo>
<u-autocomplete-field label="País" :items="countryItems" />
</demo>

```vue
<template>
  <u-autocomplete-field label="País" :items="countryItems" />
</template>

<script lang="ts" setup>
import { UAutocompleteField } from "@nexdom/uimed-vue/components";

const countryItems = [
  { label: "Brasil", value: "BR" },
  { label: "Portugal", value: "PT" },
  { label: "Moçambique", value: "MZ" },
];
</script>
```

## Eventos

### Atualização

O evento `update:modelValue` será emitido toda vez que o valor do campo for alterado pelo usuário.

<demo data-testid="demo-update-event">
<u-autocomplete-field label="País" :model-value :hint data-testid="autocomplete-field-demo-update" :items="['Brasil', 'Portugal']" @update:modelValue="onUpdateValue" />
</demo>

```vue
<template>
  <u-autocomplete-field
    label="País"
    :model-value
    :hint
    :items="items"
    @update:modelValue="onUpdateValue"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { UAutocompleteField } from "@nexdom/uimed-vue/components";

const items = ["Brasil", "Portugal"];
const modelValue = ref("Brasil");
const changes = ref(0);
const hint = computed(() => `${changes.value} alteração(ões)`);

function onUpdateValue(newValue: string | undefined) {
  modelValue.value = newValue ?? "";
  changes.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-autocomplete-field :label="playgroundActions.label.value" :placeholder="playgroundActions.placeholder.value" :hint="playgroundActions.hint.value" :variant="(playgroundActions.variant.value as 'primary' | 'secondary')" :disabled="playgroundActions.disabled.value" :readonly="playgroundActions.readonly.value" :loading="playgroundActions.loading.value" :clearable="playgroundActions.clearable.value" :strict="playgroundActions.strict.value" :multiple="playgroundActions.multiple.value" :items="playgroundItems" data-testid="autocomplete-field-preview" />
</playground>

## Ver também

Consulte a referência de [API do UAutocompleteField](../../api/components/autocomplete-field) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { UAutocompleteField } from '../../../dist/components.js';

const modelValue = ref('Brasil');
const changes = ref(0);
const hint = computed(() => `${changes.value} alteração(ões)`);

const multipleValue = ref<string[]>([]);

function onUpdateValue(newValue: string | undefined) {
  modelValue.value = newValue ?? "";
  changes.value++;
}

const playgroundActions = ref({
  label: {
    label: 'Label',
    value: 'País',
    dataTestid: 'autocomplete-field-playground-label',
  },
  placeholder: {
    label: 'Placeholder',
    value: 'Selecione',
    dataTestid: 'autocomplete-field-playground-placeholder',
  },
  hint: {
    label: 'Mensagem',
    value: 'Dica: Digite ou selecione',
    dataTestid: 'autocomplete-field-playground-hint',
  },
  variant: {
    type: "combobox",
    label: "Variante",
    value: "primary",
    dataTestid: "autocomplete-field-playground-variant",
    items: [
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" }
    ]
  },
  strict: {
    type: "checkbox",
    label: "Modo restrito (strict)",
    value: false,
    dataTestid: "autocomplete-field-playground-strict",
  },
  multiple: {
    type: "checkbox",
    label: "Seleção múltipla",
    value: false,
    dataTestid: "autocomplete-field-playground-multiple",
  },
  disabled: {
    type: "checkbox",
    label: "Desabilitado",
    value: false,
    dataTestid: "autocomplete-field-playground-disabled",
  },
  readonly: {
    type: "checkbox",
    label: "Somente leitura",
    value: false,
    dataTestid: "autocomplete-field-playground-readonly",
  },
  loading: {
    type: "checkbox",
    label: "Carregando",
    value: false,
    dataTestid: "autocomplete-field-playground-loading",
  },
  clearable: {
    type: "checkbox",
    label: "Limpável",
    value: false,
    dataTestid: "autocomplete-field-playground-clearable",
  },
});

const playgroundItems = ['Brasil', 'Portugal', 'Moçambique'];

const countryItems = [
  { label: 'Brasil', value: 'BR' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Moçambique', value: 'MZ' },
];
</script>
