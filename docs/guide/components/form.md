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
import { UForm, UTextField, USection, USectionContent } from "@nexdom/uimed-vue/components";
import type { SectionAction } from "@nexdom/uimed-vue/components";
import { ref, useId, computed } from "vue";

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

## Ver também

Consulte a referência de [API do UForm](../../api/components/form) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { UForm, UTextField, USection, USectionContent } from "../../../dist/components.js"
  import type { SectionAction } from "../../../dist/components.d.ts"
  import { ref, useId, computed } from "vue";

  const submits = ref(0);
  const formId = useId();

  const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

  const demoActions: SectionAction[] = [{type: "submit", dataTestid: "frm-demo-submit", label: "Enviar", form: formId}]

  function onSubmit() {
    submits.value++;
    alert('Enviado com sucesso!');
  }
</script>
