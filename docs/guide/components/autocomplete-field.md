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
<u-autocomplete-field :label="playgroundActions.label.value" :placeholder="playgroundActions.placeholder.value" :hint="playgroundActions.hint.value" :variant="playgroundVariant" :disabled="playgroundDisabled" :readonly="playgroundReadonly" :loading="playgroundLoading" :clearable="playgroundClearable" :strict="playgroundStrict" :multiple="playgroundMultiple" :items="playgroundItems" data-testid="autocomplete-field-preview" />

<template #actions>
<v-select v-model="playgroundVariant" label="Variante" :items="playgroundVariantOptions" density="compact" data-testid="autocomplete-field-playground-variant" />

<v-checkbox v-model="playgroundStrict" label="Modo restrito (strict)" density="compact" hide-details data-testid="autocomplete-field-playground-strict" />

<v-checkbox v-model="playgroundMultiple" label="Seleção múltipla" density="compact" hide-details data-testid="autocomplete-field-playground-multiple" />

<v-checkbox v-model="playgroundDisabled" label="Desabilitado" density="compact" hide-details data-testid="autocomplete-field-playground-disabled" />

<v-checkbox v-model="playgroundReadonly" label="Somente leitura" density="compact" hide-details data-testid="autocomplete-field-playground-readonly" />

<v-checkbox v-model="playgroundLoading" label="Carregando" density="compact" hide-details data-testid="autocomplete-field-playground-loading" />

<v-checkbox v-model="playgroundClearable" label="Limpável" density="compact" hide-details data-testid="autocomplete-field-playground-clearable" />
</template>
</playground>

## Ver também

Consulte a referência de [API do UAutocompleteField](../../api/components/autocomplete-field) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { UAutocompleteField } from '../../../dist/components.js';
import { VSelect, VCheckbox } from 'vuetify/components';

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
});

const playgroundVariant = ref<'primary' | 'secondary'>('primary');
const playgroundVariantOptions = [
  { value: 'primary', title: 'Primary' },
  { value: 'secondary', title: 'Secondary' },
];

const playgroundStrict = ref(false);
const playgroundMultiple = ref(false);
const playgroundDisabled = ref(false);
const playgroundReadonly = ref(false);
const playgroundLoading = ref(false);
const playgroundClearable = ref(false);

const playgroundItems = ['Brasil', 'Portugal', 'Moçambique'];

const countryItems = [
  { label: 'Brasil', value: 'BR' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Moçambique', value: 'MZ' },
];
</script>
