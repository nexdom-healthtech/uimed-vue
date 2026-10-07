---
outline: deep
---

# Campos com máscara

O componente para campos com máscara se chama `MaskField`.

Ele funciona como um [campo de texto](./text-field), mas formata o valor enquanto o usuário digita, inserindo automaticamente os separadores da máscara (`.`, `-`, `/`, `(`, `)`, espaço). O `v-model` recebe **somente os dígitos** do valor (por exemplo, `12345678909` para o CPF `123.456.789-09`), que é o formato normalmente enviado ao backend.

> [!Warning]
> Deve ser utilizado no lugar do `<input>` nativo e do `UTextField` sempre que o valor tiver uma máscara.

## Propriedades

### Máscaras predefinidas

A prop `mask` é obrigatória e define a máscara aplicada ao campo. A biblioteca oferece as seguintes máscaras predefinidas:

| `mask`  | Máscara              | Exemplo exibido      | `v-model`        |
| ------- | -------------------- | -------------------- | ---------------- |
| `cpf`   | `###.###.###-##`     | `123.456.789-09`     | `12345678909`    |
| `cnpj`  | `##.###.###/####-##` | `12.345.678/0001-95` | `12345678000195` |
| `cep`   | `#####-###`          | `01310-100`          | `01310100`       |
| `phone` | `(##) #####-####`    | `(11) 91234-5678`    | `11912345678`    |
| `date`  | `##/##/####`         | `31/12/2026`         | `31122026`       |

<demo col data-testid="demo-presets">
<u-mask-field v-model="cpfValue" label="CPF" mask="cpf" data-testid="mask-field-demo-cpf" />
<u-mask-field v-model="cnpjValue" label="CNPJ" mask="cnpj" data-testid="mask-field-demo-cnpj" />
<u-mask-field v-model="cepValue" label="CEP" mask="cep" data-testid="mask-field-demo-cep" />
<u-mask-field v-model="phoneValue" label="Celular" mask="phone" data-testid="mask-field-demo-phone" />
<u-mask-field v-model="dateValue" label="Data" mask="date" data-testid="mask-field-demo-date" />
<ul data-testid="mask-field-demo-values">
<li>cpf: <span data-testid="mask-field-demo-cpf-value">"{{ cpfValue }}"</span></li>
<li>cnpj: <span data-testid="mask-field-demo-cnpj-value">"{{ cnpjValue }}"</span></li>
<li>cep: <span data-testid="mask-field-demo-cep-value">"{{ cepValue }}"</span></li>
<li>phone: <span data-testid="mask-field-demo-phone-value">"{{ phoneValue }}"</span></li>
<li>date: <span data-testid="mask-field-demo-date-value">"{{ dateValue }}"</span></li>
</ul>
</demo>

```vue
<template>
  <u-mask-field v-model="cpf" label="CPF" mask="cpf" />
  <u-mask-field v-model="cnpj" label="CNPJ" mask="cnpj" />
  <u-mask-field v-model="cep" label="CEP" mask="cep" />
  <u-mask-field v-model="phone" label="Celular" mask="phone" />
  <u-mask-field v-model="date" label="Data" mask="date" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const cpf = ref("");
const cnpj = ref("");
const cep = ref("");
const phone = ref("");
const date = ref("");
</script>
```

> [!Tip]
> A máscara `phone` tem 11 dígitos (DDD e celular). Um telefone fixo, com 10 dígitos, é considerado incompleto e exibe a mensagem "Valor incompleto".

> [!Warning]
> O campo não valida os dígitos verificadores do CPF e do CNPJ nem a existência do documento: ele só confere o formato. Valide o documento no backend da aplicação.

> [!Warning]
> A máscara `cnpj` aceita somente dígitos. Desde julho de 2026 (IN RFB nº 2.229/2024), o CNPJ pode conter letras nas 12 primeiras posições, formato que ainda não é suportado.

> [!Tip]
> A máscara `date` apenas formata o valor: ela não valida se a data existe (`31/02/2026` é aceito) e o `v-model` fica no formato `DDMMAAAA` (por exemplo, `31122026`). Para datas, prefira os [campos de data e hora](./date-time-field), que oferecem seletor, limites e o formato padrão `YYYY-MM-DD`.

### Máscaras personalizadas

A prop `mask` também aceita a própria máscara, em que `#` representa um dígito (0–9) e qualquer outro caractere é um separador fixo, inserido automaticamente e fora do `v-model`. Os separadores podem ser símbolos, espaços ou letras: em `####-##/####`, o valor `1234561234` é exibido como `1234-56/1234`, e em `Nº ####`, o valor `1234` é exibido como `Nº 1234`. Uma máscara personalizada precisa ter pelo menos um `#`: o tipo da prop `mask` rejeita uma máscara sem ele, assim como o nome de uma máscara predefinida escrito errado (como `cpff`).

<demo col data-testid="demo-custom">
<u-mask-field v-model="protocolValue" label="Protocolo" mask="####-##/####" data-testid="mask-field-demo-custom" />
<p>v-model: <span data-testid="mask-field-demo-custom-value">"{{ protocolValue }}"</span></p>
<u-mask-field v-model="numberValue" label="Número" mask="Nº ####" data-testid="mask-field-demo-number" />
<p>v-model: <span data-testid="mask-field-demo-number-value">"{{ numberValue }}"</span></p>
</demo>

```vue
<template>
  <u-mask-field v-model="protocol" label="Protocolo" mask="####-##/####" />
  <u-mask-field v-model="number" label="Número" mask="Nº ####" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const protocol = ref("");
const number = ref("");
</script>
```

> [!Warning]
> Evite separadores fixos que o usuário também poderia digitar, como os dígitos de `0800 ###-####` ou o `55` de `+55 (##) #####-####`: quando o campo espera um desses separadores, o caractere igual a ele é lido como o separador, e não como valor. Por exemplo, digitar `0` no campo vazio de `0800 ###-####` não tem efeito, e o `v-model` `0800123` é exibido como `0800 123-`. Nesses casos, deixe o trecho fixo fora da máscara (por exemplo, no `label` ou no `hint`).

### Comportamento ao digitar

- Somente dígitos são aceitos: letras e símbolos digitados são descartados, sem atualizar o `v-model`. O número de dígitos é limitado pela quantidade de `#` da máscara.
- Um separador aparece assim que a posição anterior a ele é preenchida (`123` vira `123.`). Se o usuário digitar o próprio separador na posição dele, ele não é duplicado.
- Com a máscara completa, um dígito digitado no final é ignorado. Digitado no meio, ele é inserido, e o último dígito do valor é descartado.
- `Backspace` logo após um separador apenas move o cursor para antes dele, e o próximo `Backspace` apaga o dígito anterior. Da mesma forma, `Delete` logo antes de um separador move o cursor para depois dele. Ao apagar uma seleção, somente os dígitos selecionados são removidos (uma seleção só com separadores não apaga nada), e o valor é formatado novamente.
- Ao colar um valor, com ou sem formatação, o resultado é o mesmo: os caracteres que não são dígitos são descartados e o excesso é cortado no final.
- O cursor permanece após o mesmo dígito ao digitar, apagar ou colar no meio do valor, inclusive com teclados com composição de texto (IME).
- Em dispositivos móveis, o teclado numérico é exibido.

> [!Warning]
> Como o valor é reescrito a cada alteração, o histórico de desfazer do navegador (`Ctrl+Z`) não fica disponível no campo.

### Valor inicial

Quando o `v-model` chega fora do formato (com a máscara, por exemplo), o campo exibe o valor normalizado, sem alterar o `v-model`. Quando ele não cabe na máscara, por ter mais dígitos do que ela comporta ou caracteres fora do formato dela (como letras), o campo exibe somente a parte que cabe, e a validação falha com a mensagem "Valor inválido", exibida assim que o campo é validado (ao sair dele ou ao enviar o [formulário](./form)). Em todos os casos, o `v-model` só é alterado quando o usuário altera o valor exibido: colar o mesmo valor que já está exibido não o altera.

<demo col data-testid="demo-initial-value">
<u-mask-field v-model="initialValue" label="CPF com máscara" mask="cpf" data-testid="mask-field-demo-initial" />
<p>v-model: <span data-testid="mask-field-demo-initial-value">"{{ initialValue }}"</span></p>
<u-mask-field v-model="initialExcessValue" label="CPF com dígitos a mais" mask="cpf" data-testid="mask-field-demo-initial-excess" />
<p>v-model: <span data-testid="mask-field-demo-initial-excess-value">"{{ initialExcessValue }}"</span></p>
</demo>

```vue
<template>
  <u-mask-field v-model="maskedCpf" label="CPF com máscara" mask="cpf" />
  <u-mask-field v-model="longCpf" label="CPF com dígitos a mais" mask="cpf" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const maskedCpf = ref("123.456.789-09");
const longCpf = ref("123456789099");
</script>
```

> [!Important]
> Trocar a prop `mask` com o campo preenchido (por exemplo, de `cnpj` para `cpf`) não altera o `v-model`: um valor que não cabe na nova máscara é exibido cortado e falha na validação com a mensagem "Valor inválido". Ao trocar a máscara, ajuste ou limpe o valor na aplicação.

### Variantes

A prop `variant` define a variação de estilo aplicada ao campo. O padrão é `primary`.

<demo>
<u-mask-field label="Primary" mask="cpf" variant="primary" />
<u-mask-field label="Secondary" mask="cpf" variant="secondary" />
</demo>

```vue
<template>
  <u-mask-field label="Primary" mask="cpf" variant="primary" />
  <u-mask-field label="Secondary" mask="cpf" variant="secondary" />
</template>

<script lang="ts" setup>
import { UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

### Labels, placeholders e mensagens

As props `label`, `placeholder` e `hint` funcionam da mesma forma que nos [campos de texto](./text-field).

Sem a prop `placeholder`, o campo exibe a própria máscara como placeholder, com `0` no lugar de cada `#` e os separadores fixos como na máscara: `000.000.000-00` para `cpf`, `00000-000` para `cep` e `Nº 0000` para `Nº ####`. Um `placeholder` informado substitui o padrão, e `placeholder=""` remove o placeholder. Como nos campos de texto, com um `label`, o placeholder só aparece quando o campo está em foco.

<demo col data-testid="demo-placeholder">
<u-mask-field label="CEP" mask="cep" hint="Somente os dígitos são salvos" data-testid="mask-field-demo-placeholder-default" />
<u-mask-field label="CPF" mask="cpf" placeholder="Somente números" data-testid="mask-field-demo-placeholder-custom" />
</demo>

```vue
<template>
  <u-mask-field label="CEP" mask="cep" hint="Somente os dígitos são salvos" />
  <u-mask-field label="CPF" mask="cpf" placeholder="Somente números" />
</template>

<script lang="ts" setup>
import { UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

### Validação

Enquanto houver um valor sem que a máscara esteja completa, o campo exibe a mensagem "Valor incompleto", e um valor que não cabe na máscara (veja [Valor inicial](#valor-inicial)) exibe a mensagem "Valor inválido". A validação confere somente o formato, e não se o documento é válido. Com a prop `required`, o campo também impede o envio do [formulário](./form) enquanto estiver vazio, exibindo a mensagem "Campo obrigatório".

<demo col data-testid="demo-required">
<u-form>
<u-mask-field label="CPF" mask="cpf" required data-testid="mask-field-demo-required" />
<u-button type="submit" data-testid="mask-field-demo-required-submit">Enviar</u-button>
</u-form>
</demo>

```vue
<template>
  <u-form>
    <u-mask-field label="CPF" mask="cpf" required />
    <u-button type="submit">Enviar</u-button>
  </u-form>
</template>

<script lang="ts" setup>
import { UButton, UForm, UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

### Estados

#### Desabilitado

Utilize a prop `disabled` para indicar ao usuário que não há possibilidade de interação com o campo.

<demo>
<u-mask-field model-value="12345678909" label="Desabilitado" mask="cpf" disabled data-testid="mask-field-demo-disabled" />
</demo>

```vue
<template>
  <u-mask-field model-value="12345678909" label="Desabilitado" mask="cpf" disabled />
</template>

<script lang="ts" setup>
import { UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

#### Somente leitura

Utilize a prop `readonly` para evitar que o valor presente em um campo seja alterado.

<demo>
<u-mask-field model-value="12345678909" label="Somente leitura" mask="cpf" readonly data-testid="mask-field-demo-readonly" />
</demo>

```vue
<template>
  <u-mask-field model-value="12345678909" label="Somente leitura" mask="cpf" readonly />
</template>

<script lang="ts" setup>
import { UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

#### Carregamento

A prop `loading` exibe um indicador de carregamento no campo enquanto ativa. Nesse estado, o campo mantém o rótulo como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador.

<demo>
<u-mask-field label="Carregando" mask="cpf" loading data-testid="mask-field-demo-loading" />
</demo>

```vue
<template>
  <u-mask-field label="Carregando" mask="cpf" loading />
</template>

<script lang="ts" setup>
import { UMaskField } from "@nexdom/uimed-vue/components";
</script>
```

#### Limpável

A prop `clearable` exibe um recurso para limpar o campo, que altera o `v-model` para uma `string` vazia.

<demo col>
<u-mask-field v-model="clearableValue" label="Limpável" mask="cep" clearable data-testid="mask-field-demo-clearable" />
<p>v-model: <span data-testid="mask-field-demo-clearable-value">"{{ clearableValue }}"</span></p>
</demo>

```vue
<template>
  <u-mask-field v-model="cep" label="Limpável" mask="cep" clearable />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const cep = ref("01310100");
</script>
```

## Eventos

### Atualização

O evento `update:modelValue` será emitido toda vez que o valor do campo for alterado pelo usuário, repassando somente os dígitos do valor, sem os separadores, como uma `string`. Caracteres descartados e separadores digitados não emitem o evento.

<demo col data-testid="demo-update-event">
<u-mask-field label="Celular" mask="phone" :model-value="updateValue" data-testid="mask-field-demo-update" @update:model-value="onUpdateValue" />
<p data-testid="mask-field-demo-update-count">{{ updateChanges }} alteração(ões): "{{ updateValue }}"</p>
</demo>

```vue
<template>
  <u-mask-field label="Celular" mask="phone" :model-value @update:model-value="onUpdateValue" />
  <p>{{ changes }} alteração(ões): "{{ modelValue }}"</p>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const modelValue = ref("1191234567");
const changes = ref(0);

function onUpdateValue(newValue: string) {
  modelValue.value = newValue;
  changes.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-mask-field :label="playgroundActions.label.value" :placeholder="playgroundActions.placeholder.value || undefined" :hint="playgroundActions.hint.value" :mask="playgroundActions.mask.value" :variant="playgroundActions.variant.value" :disabled="playgroundActions.disabled.value" :readonly="playgroundActions.readonly.value" :loading="playgroundActions.loading.value" :clearable="playgroundActions.clearable.value" data-testid="mask-field-preview" />
</playground>

## Ver também

Consulte a referência de [API do UMaskField](../../api/components/mask-field) para a lista completa de props e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UButton, UForm, UMaskField } from "../../../dist/components.js"
  import type { ComponentProps } from "vue-component-type-helpers"

  const cpfValue = ref("");
  const cnpjValue = ref("");
  const cepValue = ref("");
  const phoneValue = ref("");
  const dateValue = ref("");
  const protocolValue = ref("");
  const numberValue = ref("");
  const initialValue = ref("123.456.789-09");
  const initialExcessValue = ref("123456789099");
  const clearableValue = ref("01310100");

  const updateValue = ref("1191234567");
  const updateChanges = ref(0);

  function onUpdateValue(newValue: string) {
    updateValue.value = newValue;
    updateChanges.value++;
  }

  type Props = ComponentProps<typeof UMaskField>;
  const playgroundMaskOptions: Array<Props["mask"]> = ["cpf", "cnpj", "cep", "phone", "date", "####-##/####"];
  const playgroundVariantOptions: Array<Props["variant"]> = ["primary", "secondary"];

  const playgroundActions = ref({
    label: {
      type: "text",
      label: "Label",
      value: "Label",
      dataTestid: "mask-field-playground-label"
    },
    placeholder: {
      type: "text",
      label: "Placeholder",
      value: "",
      dataTestid: "mask-field-playground-placeholder",
    },
    hint: {
      type: "text",
      label: "Mensagem",
      value: "Hint",
      dataTestid: "mask-field-playground-hint"
    },
    mask: {
      type: "combobox",
      label: "Máscara",
      value: playgroundMaskOptions[0],
      dataTestid: "mask-field-playground-mask",
      items: playgroundMaskOptions
    },
    variant: {
      type: "combobox",
      label: "Variante",
      value: playgroundVariantOptions[0],
      dataTestid: "mask-field-playground-variant",
      items: playgroundVariantOptions
    },
    disabled: {
      type: "checkbox",
      value: false,
      label: "Desabilitado",
      dataTestid: "mask-field-playground-disabled"
    },
    readonly: {
      type: "checkbox",
      value: false,
      label: "Somente leitura",
      dataTestid: "mask-field-playground-readonly"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "mask-field-playground-loading"
    },
    clearable: {
      type: "checkbox",
      value: false,
      label: "Limpável",
      dataTestid: "mask-field-playground-clearable"
    },
  });
</script>
