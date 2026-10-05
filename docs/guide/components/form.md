---
outline: deep
---

# Formulários

O componente que engloba os formulários se chama `Form` dentro do uimed-vue.

> [!Warning]
> Deve ser utilizado no lugar do `<form>` nativo.

## Eventos

### Envio

O evento `submit` é emitido quando o formulário é enviado, repassando o `SubmitEvent` nativo. Ele não é disparado quando restam campos com pendências de validação.

<demo col data-testid="demo-submit-event">
<u-section title="Cadastro" :subtitle :actions="demoActions" data-testid="frm-demo-submit-count">
<u-section-content>
<u-form :id="formId" @submit="onSubmit">
<u-text-field label="Nome" data-testid="first-name-field-demo-submit" required />
<u-text-field label="Sobrenome" data-testid="last-name-field-demo-submit" required />
</u-form>
</u-section-content>
</u-section>
</demo>

```vue
<template>
  <u-section title="Cadastro" :subtitle :actions>
    <u-section-content>
      <u-form :id="formId" @submit="onSubmit">
        <u-text-field label="Nome" required />
        <u-text-field label="Sobrenome" required />
      </u-form>
    </u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UForm, UTextField, USection, USectionContent } from "@nexdom/uimed-vue/components";
import { ref, useId, computed } from "vue";

type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];

const submits = ref(0);
const formId = useId();

const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

const actions: SectionAction[] = [{ type: "submit", label: "Enviar", form: formId }];

function onSubmit() {
  submits.value++;
  alert("Enviado com sucesso!");
}
</script>
```

### Envio com carregamento

Um botão de envio com `loading` fica desabilitado e não envia o formulário. Quando ele é o primeiro botão de envio do formulário, pressionar `Enter` em um dos campos também não envia o formulário. Isso vale também para os botões de fora do formulário relacionados a ele pela prop `form`, como as ações de uma seção. Assim, basta manter o botão de envio com `loading` enquanto o envio é executado para evitar envios repetidos. Com mais de um botão de envio, mantenha todos com `loading` ou `disabled` durante o envio.

> [!Tip]
> O `isRunning` do [`useRunOrToast`](../composables/use-run-or-toast) pode controlar o `loading` do botão enquanto o envio é executado.

Preencha os campos e pressione `Enter` em um deles, ou clique em "Enviar", para simular um envio de 1,5 segundo.

<demo col data-testid="demo-loading-submit">
<u-section title="Cadastro" :subtitle="loadingSubtitle" :actions="loadingDemoActions" data-testid="frm-demo-loading-submit-count">
<u-section-content>
<u-form :id="loadingFormId" @submit="onLoadingSubmit">
<u-text-field label="Nome" data-testid="first-name-field-demo-loading-submit" required />
<u-text-field label="Sobrenome" data-testid="last-name-field-demo-loading-submit" required />
</u-form>
</u-section-content>
</u-section>
</demo>

```vue
<template>
  <u-section title="Cadastro" :subtitle :actions>
    <u-section-content>
      <u-form :id="formId" @submit="onSubmit">
        <u-text-field label="Nome" required />
        <u-text-field label="Sobrenome" required />
      </u-form>
    </u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UForm, UTextField, USection, USectionContent } from "@nexdom/uimed-vue/components";
import { ref, useId, computed } from "vue";

type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];

const submits = ref(0);
const isSubmitting = ref(false);
const formId = useId();

const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

const actions = computed<SectionAction[]>(() => [
  { type: "submit", label: "Enviar", form: formId, loading: isSubmitting.value },
]);

async function onSubmit() {
  submits.value++;
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isSubmitting.value = false;
}
</script>
```

## Ver também

Consulte a referência de [API do UForm](../../api/components/form) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UForm, UTextField, USection, USectionContent } from "../../../dist/components.js"
  import { ref, useId, computed } from "vue";

  type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];

  const submits = ref(0);
  const formId = useId();

  const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

  const demoActions: SectionAction[] = [{type: "submit", dataTestid: "frm-demo-submit", label: "Enviar", form: formId}]

  function onSubmit() {
    submits.value++;
    alert('Enviado com sucesso!');
  }

  const loadingSubmits = ref(0);
  const isSubmitting = ref(false);
  const loadingFormId = useId();

  const loadingSubtitle = computed(() => `Pessoa - ${loadingSubmits.value} envio(s)`);

  const loadingDemoActions = computed<SectionAction[]>(() => [
    { type: "submit", dataTestid: "frm-demo-loading-submit", label: "Enviar", form: loadingFormId, loading: isSubmitting.value },
  ]);

  async function onLoadingSubmit() {
    loadingSubmits.value++;
    isSubmitting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    isSubmitting.value = false;
  }
</script>
