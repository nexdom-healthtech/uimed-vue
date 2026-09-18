---
outline: deep
---

# Formulários

O componente que engloba os formulários se chama `Frm` dentro do uimed-vue.

> [!Warning]
> Deve ser utilizado no lugar do `<form>` nativo.

## Eventos

### Envio

O evento `submit` é emitido quando o formulário é enviado, repassando o `SubmitEvent` nativo. Ele não é disparado quando restam campos com pendências de validação.

<demo col data-testid="demo-submit-event">
<content-set title="Cadastro" :subtitle :actions="demoActions" data-testid="frm-demo-submit-count">
<content>
<frm :id="formId" @submit="onSubmit">
<text-field label="Nome" data-testid="first-name-field-demo-submit" required />
<text-field label="Sobrenome" data-testid="last-name-field-demo-submit" required />
</frm>
</content>
</content-set>
</demo>

```vue
<template>
  <content-set title="Cadastro" :subtitle :actions>
    <content>
      <frm :id="formId" @submit="onSubmit">
        <text-field label="Nome" required />
        <text-field label="Sobrenome" required />
      </frm>
    </content>
  </content-set>
</template>

<script lang="ts" setup>
import { Frm, TextField, ContentSet, Content } from "@nexdom/uimed-vue/components";
import type { ContentSetAction } from "@nexdom/uimed-vue/components";
import { ref, useId, computed } from "vue";

const submits = ref(0);
const formId = useId();

const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

const actions: ContentSetAction[] = [{ type: "submit", label: "Enviar", form: formId }];

function onSubmit() {
  submits.value++;
  alert("Enviado com sucesso!");
}
</script>
```

## Ver também

Consulte a referência de [API do Frm](../../api/components/frm) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Frm, TextField, ContentSet, Content } from "../../../dist/components.js"
  import type { ContentSetAction } from "../../../dist/components.d.ts"
  import { ref, useId, computed } from "vue";

  const submits = ref(0);
  const formId = useId();

  const subtitle = computed(() => `Pessoa - ${submits.value} envio(s)`);

  const demoActions: ContentSetAction[] = [{type: "submit", dataTestid: "frm-demo-submit", label: "Enviar", form: formId}]

  function onSubmit() {
    submits.value++;
    alert('Enviado com sucesso!');
  }
</script>
