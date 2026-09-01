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
<frm @submit="onSubmit">
<text-field label="Nome" data-testid="first-name-field-demo-submit" required />
<text-field label="Sobrenome" data-testid="last-name-field-demo-submit" required />

<btn type="submit" data-testid="btn-demo-submit">Enviar</btn> <span data-testid="btn-demo-submit-count">{{ submits }} envio(s)</span>
</frm>
</demo>

```vue
<template>
  <frm @submit="onSubmit">
    <text-field label="Nome" required />
    <text-field label="Sobrenome" required />

    <btn type="submit" data-testid="btn-demo-submit">Enviar</btn>
    <span data-testid="btn-demo-submit-count">{{ submits }} envio(s)</span>
  </frm>
</template>

<script lang="ts" setup>
import { Frm, Btn, TextField } from "@nexdom/uimed-vue/components";
import { ref } from "vue";

const submits = ref(0);

function onSubmit() {
  submits.value++;
  alert("Enviado com sucesso!");
}
</script>
```

## Ver também

Consulte a referência de [API do Frm](../../api/components/frm) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Frm, Btn, TextField } from "../../../dist/components.js"
  import { ref } from "vue";

  const submits = ref(0);

  function onSubmit() {
    submits.value++;
    alert('Enviado com sucesso!');
  }
</script>
