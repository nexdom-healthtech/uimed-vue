---
outline: deep
---

# Campos de data e hora

O componente para campos de data e hora se chama `DateTimeField`.

Ao clicar no campo, um seletor é aberto para escolher a data, o horário ou ambos. O valor é exibido no formato brasileiro (`24/09/2026`, `14:30` ou `24/09/2026 14:30`), mas o `v-model` utiliza os formatos padrão dos campos nativos:

| Tipo       | Formato do `v-model` | Exemplo            |
| ---------- | -------------------- | ------------------ |
| `date`     | `YYYY-MM-DD`         | `2026-09-24`       |
| `time`     | `HH:mm` (24 horas)   | `14:30`            |
| `datetime` | `YYYY-MM-DDTHH:mm`   | `2026-09-24T14:30` |

Quando não há valor, o `v-model` é uma `string` vazia (`""`).

> [!Warning]
> Deve ser utilizado no lugar do `<input>` nativo dos tipos `date`, `time` e `datetime-local`.

## Propriedades

### Tipos

A prop `type` define quais seletores são apresentados e o formato do valor. O padrão é `datetime`.

<demo col data-testid="demo-types">
<u-date-time-field v-model="dateValue" label="Data" type="date" data-testid="date-time-field-demo-date" />
<u-date-time-field v-model="timeValue" label="Horário" type="time" data-testid="date-time-field-demo-time" />
<u-date-time-field v-model="dateTimeValue" label="Data e hora" type="datetime" data-testid="date-time-field-demo-datetime" />
<ul data-testid="date-time-field-demo-values">
<li>date: <span data-testid="date-time-field-demo-date-value">"{{ dateValue }}"</span></li>
<li>time: <span data-testid="date-time-field-demo-time-value">"{{ timeValue }}"</span></li>
<li>datetime: <span data-testid="date-time-field-demo-datetime-value">"{{ dateTimeValue }}"</span></li>
</ul>
</demo>

```vue
<template>
  <u-date-time-field v-model="dateValue" label="Data" type="date" />
  <u-date-time-field v-model="timeValue" label="Horário" type="time" />
  <u-date-time-field v-model="dateTimeValue" label="Data e hora" type="datetime" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDateTimeField } from "@nexdom/uimed-vue/components";

const dateValue = ref("2026-09-10");
const timeValue = ref("08:00");
const dateTimeValue = ref("2026-09-10T08:00");
</script>
```

O seletor é fechado assim que o valor estiver completo:

- `date`: ao escolher o dia;
- `time`: ao escolher os minutos;
- `datetime`: ao escolher o dia ou os minutos, desde que data e horário já estejam definidos.

> [!Tip]
> No tipo `datetime`, o `v-model` só é atualizado quando data e horário estão definidos. Ao escolher uma nova data, o horário atual é mantido. Se o seletor for fechado com apenas uma das partes escolhida, a seleção incompleta é descartada.

### Variantes

A prop `variant` define a variação de estilo aplicada ao campo. O padrão é `primary`.

<demo>
<u-date-time-field label="Primary" variant="primary" />
<u-date-time-field label="Secondary" variant="secondary" />
</demo>

```vue
<template>
  <u-date-time-field label="Primary" variant="primary" />
  <u-date-time-field label="Secondary" variant="secondary" />
</template>

<script lang="ts" setup>
import { UDateTimeField } from "@nexdom/uimed-vue/components";
</script>
```

### Labels, placeholders e mensagens

As props `label`, `placeholder` e `hint` funcionam da mesma forma que nos [campos de texto](./text-field).

<demo>
<u-date-time-field label="Data de nascimento" type="date" placeholder="dd/mm/aaaa" hint="Informe a data do documento" />
</demo>

```vue
<template>
  <u-date-time-field
    label="Data de nascimento"
    type="date"
    placeholder="dd/mm/aaaa"
    hint="Informe a data do documento"
  />
</template>

<script lang="ts" setup>
import { UDateTimeField } from "@nexdom/uimed-vue/components";
</script>
```

### Limites

As props `min` e `max` recebem valores no mesmo formato do `v-model` para o `type` atual. Opções fora do intervalo não podem ser escolhidas no seletor e, se o valor estiver fora do intervalo (por exemplo, quando definido pelo código), uma mensagem de erro é exibida.

<demo data-testid="demo-limits">
<u-date-time-field v-model="limitedValue" label="Data do retorno" type="date" min="2026-09-10" max="2026-09-20" hint="Entre 10/09/2026 e 20/09/2026" data-testid="date-time-field-demo-limits" />
<u-button variant="secondary" data-testid="date-time-field-demo-limits-out" @click="limitedValue = '2026-09-25'">Definir 25/09/2026</u-button>
</demo>

```vue
<template>
  <u-date-time-field
    v-model="limitedValue"
    label="Data do retorno"
    type="date"
    min="2026-09-10"
    max="2026-09-20"
    hint="Entre 10/09/2026 e 20/09/2026"
  />
  <u-button variant="secondary" @click="limitedValue = '2026-09-25'">Definir 25/09/2026</u-button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UButton, UDateTimeField } from "@nexdom/uimed-vue/components";

const limitedValue = ref("2026-09-15");
</script>
```

> [!Tip]
> No tipo `datetime`, a data do limite restringe o calendário, e o horário do limite só restringe o relógio quando a data escolhida é a própria data do limite. Por exemplo, com `min="2026-09-10T08:00"`, os horários antes das 08:00 só ficam indisponíveis no dia 10/09/2026.

### Obrigatório

A prop `required` impede o envio do [formulário](./form) enquanto o campo estiver vazio.

<demo col data-testid="demo-required">
<u-form>
<u-date-time-field label="Data da consulta" type="date" required data-testid="date-time-field-demo-required" />
<u-button type="submit" data-testid="date-time-field-demo-required-submit">Enviar</u-button>
</u-form>
</demo>

```vue
<template>
  <u-form>
    <u-date-time-field label="Data da consulta" type="date" required />
    <u-button type="submit">Enviar</u-button>
  </u-form>
</template>

<script lang="ts" setup>
import { UButton, UDateTimeField, UForm } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para indicar ao usuário que não há possibilidade de interação com o campo.

<demo>
<u-date-time-field label="Desabilitado" disabled data-testid="date-time-field-demo-disabled" />
</demo>

```vue
<template>
  <u-date-time-field label="Desabilitado" disabled />
</template>

<script lang="ts" setup>
import { UDateTimeField } from "@nexdom/uimed-vue/components";
</script>
```

#### Somente leitura

Utilize a prop `readonly` para evitar que o valor presente em um campo seja alterado. O seletor não é aberto.

<demo>
<u-date-time-field model-value="2026-09-24T14:30" label="Somente leitura" readonly data-testid="date-time-field-demo-readonly" />
</demo>

```vue
<template>
  <u-date-time-field model-value="2026-09-24T14:30" label="Somente leitura" readonly />
</template>

<script lang="ts" setup>
import { UDateTimeField } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento no campo enquanto ativa. Nesse estado, o campo mantém o rótulo como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador.

<demo>
<u-date-time-field label="Carregando" loading />
</demo>

```vue
<template>
  <u-date-time-field label="Carregando" loading />
</template>

<script lang="ts" setup>
import { UDateTimeField } from "@nexdom/uimed-vue/components";
</script>
```

#### Limpável

A prop `clearable` exibe um recurso para limpar o campo, que altera o `v-model` para uma `string` vazia. O recurso não é exibido enquanto o campo estiver somente leitura.

<demo col>
<u-date-time-field v-model="clearableValue" label="Limpável" type="date" clearable data-testid="date-time-field-demo-clearable" />
<p>v-model: <span data-testid="date-time-field-demo-clearable-value">"{{ clearableValue }}"</span></p>
</demo>

```vue
<template>
  <u-date-time-field v-model="clearableValue" label="Limpável" type="date" clearable />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDateTimeField } from "@nexdom/uimed-vue/components";

const clearableValue = ref("2026-09-24");
</script>
```

## Eventos

### Atualização

O evento `update:modelValue` será emitido toda vez que o usuário escolher um valor completo ou limpar o campo, repassando o novo valor como uma `string`.

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-date-time-field :label="playgroundActions.label.value" :placeholder="playgroundActions.placeholder.value" :hint="playgroundActions.hint.value" :min="playgroundActions.min.value" :max="playgroundActions.max.value" :type="playgroundActions.type.value" :variant="playgroundActions.variant.value" :disabled="playgroundActions.disabled.value" :readonly="playgroundActions.readonly.value" :loading="playgroundActions.loading.value" :clearable="playgroundActions.clearable.value" data-testid="date-time-field-preview" />
</playground>

## Ver também

Consulte a referência de [API do UDateTimeField](../../api/components/date-time-field) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UButton, UDateTimeField, UForm } from "../../../dist/components.js"
  import type { ComponentProps } from "vue-component-type-helpers"

  const dateValue = ref("2026-09-10");
  const timeValue = ref("08:00");
  const dateTimeValue = ref("2026-09-10T08:00");
  const limitedValue = ref("2026-09-15");
  const clearableValue = ref("2026-09-24");

  type Props = ComponentProps<typeof UDateTimeField>;
  const playgroundTypeOptions: Array<Props["type"]> = ["datetime", "date", "time"];
  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];

  const playgroundActions = ref({
    label: {
      type: "text",
      label: "Label",
      value: "Label",
      dataTestid: "date-time-field-playground-label"
    },
    placeholder: {
      type: "text",
      label: "Placeholder",
      value: "Placeholder",
      dataTestid: "date-time-field-playground-placeholder",
    },
    hint: {
      type: "text",
      label: "Mensagem",
      value: "Hint",
      dataTestid: "date-time-field-playground-hint"
    },
    min: {
      type: "text",
      label: "Mínimo",
      value: "",
      dataTestid: "date-time-field-playground-min"
    },
    max: {
      type: "text",
      label: "Máximo",
      value: "",
      dataTestid: "date-time-field-playground-max"
    },
    type: {
      type: "combobox",
      label: "Tipo",
      value: playgroundTypeOptions[0],
      dataTestid: "date-time-field-playground-type",
      items: playgroundTypeOptions
    },
    variant: {
      type: "combobox",
      label: "Tipo",
      value: playgroundVariantOptions[0],
      dataTestid: "date-time-field-playground-variant",
      items: playgroundVariantOptions
    },
    disabled: {
      type: "checkbox",
      value: false,
      label: "Desabilitado",
      dataTestid: "date-time-field-playground-disabled"
    },
    readonly: {
      type: "checkbox",
      value: false,
      label: "Somente leitura",
      dataTestid: "date-time-field-playground-readonly"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "date-time-field-playground-loading"
    },
    clearable: {
      type: "checkbox",
      value: false,
      label: "Limpável",
      dataTestid: "date-time-field-playground-clearable"
    },
  });
</script>
