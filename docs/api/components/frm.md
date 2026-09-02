# Frm

Componente para utilização de formulários.

## Props

| Prop         | Tipo     | Padrão | Descrição                                                                                                                    |
| ------------ | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `string` |        | Aplica atributo `id` no elemento [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form) nativo. |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente.                                                                |

## Eventos

| Evento   | Retorno                                                                       | Descrição                                                              |
| -------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `submit` | [`SubmitEvent`](https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent) | Disparado quando o formulário é submetido sem pendências de validação. |

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do formulário. |

## Exemplo

```vue
<template>
  <frm @submit="onSubmit">
    <text-field label="Nome" required />
    <text-field label="Sobrenome" required />

    <btn type="submit">Salvar</btn>
  </frm>
</template>

<script lang="ts" setup>
import { Frm, Btn, TextField } from "@nexdom/uimed-vue/components";

function onSubmit(event: SubmitEvent) {
  console.log("Formulário submetido!", event);
}
</script>
```
