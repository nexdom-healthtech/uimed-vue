---
outline: deep
---

# Caixas de seleção

O componente para caixas de seleção se chama `Checkbox`.

## Propriedades

### Labels

A prop `label` aceita um texto que identifica a informação a ser selecionada na caixa.

<demo>
<u-checkbox label="Aceito os termos de uso" />
<u-checkbox label="Concordo com a política de privacidade" />
</demo>

```vue
<template>
  <u-checkbox label="Aceito os termos de uso" />
  <u-checkbox label="Concordo com a política de privacidade" />
</template>

<script lang="ts" setup>
import { UCheckbox } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para indicar ao usuário que não há possibilidade de interação com a caixa de seleção.

<demo>
<u-checkbox label="Desabilitado" disabled />
</demo>

```vue
<template>
  <u-checkbox label="Desabilitado" disabled />
</template>

<script lang="ts" setup>
import { UCheckbox } from "@nexdom/uimed-vue/components";
</script>
```

#### Somente leitura

Utilize a prop `readonly` para evitar que o valor presente em uma caixa de seleção seja alterado.

<demo>
<u-checkbox :model-value="true" label="Somente leitura (marcado)" readonly />
</demo>

```vue
<template>
  <u-checkbox :model-value="true" label="Somente leitura (marcado)" readonly />
</template>

<script lang="ts" setup>
import { UCheckbox } from "@nexdom/uimed-vue/components";
</script>
```

### Valores customizados

Por padrão, quando marcada, a caixa de seleção aplica o valor `true` ao modelo, e quando desmarcada, aplica `false`. É possível customizar esses valores utilizando as props `trueValue` e `falseValue`.

<demo>
<u-checkbox v-model="customValuesCheckbox" :label="customValuesCheckbox" true-value="Ativado" false-value="Desativado" data-testid="custom-values-checkbox" />
</demo>

```vue
<template>
  <u-checkbox
    v-model="customValuesCheckbox"
    :label="customValuesCheckbox"
    true-value="Ativado"
    false-value="Desativado"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UCheckbox } from "@nexdom/uimed-vue/components";

const customValuesCheckbox = ref("Ativado");
</script>
```

## Eventos

### Atualização

O evento `update:modelValue` será emitido toda vez que o valor da caixa for alterado pelo usuário, repassando o novo valor.

<demo data-testid="demo-update-event" items-center>
<u-checkbox label="Marque para se cadastrar" :model-value="modelValue" @update:modelValue="onUpdateValue" data-testid="checkbox-demo-update" />
<span data-testid="checkbox-demo-update-count">{{ changes }} alteração(ões)</span>
</demo>

```vue
<template>
  <u-checkbox
    label="Marque para se cadastrar"
    :model-value="modelValue"
    @update:modelValue="onUpdateValue"
  />
  {{ changes }} alteração(ões)
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UCheckbox } from "@nexdom/uimed-vue/components";

const modelValue = ref(false);
const changes = ref(0);

function onUpdateValue(newValue: boolean | undefined) {
  modelValue.value = newValue ?? false;
  changes.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-checkbox :label="playgroundActions.label.value" :disabled="playgroundActions.disabled.value" :readonly="playgroundActions.readonly.value" data-testid="checkbox-preview" />
</playground>

## Ver também

Consulte a referência de [API do UCheckbox](../../api/components/checkbox) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UCheckbox } from "../../../dist/components.js"

  const modelValue = ref(false);
  const changes = ref(0);
  const customValuesCheckbox = ref("Ativado");

  function onUpdateValue(newValue: boolean | undefined) {
    modelValue.value = newValue ?? false;
    changes.value++;
  }

  const playgroundActions = ref({
    label: {
      type: "text",
      label: "Label",
      value: "Aceito os termos",
      dataTestid: "checkbox-playground-label"
    },
    disabled: {
      type: "checkbox",
      value: false,
      label: "Desabilitado",
      dataTestid: "checkbox-playground-disabled"
    },
    readonly: {
      type: "checkbox",
      value: false,
      label: "Somente leitura",
      dataTestid: "checkbox-playground-readonly"
    },
  });
</script>
