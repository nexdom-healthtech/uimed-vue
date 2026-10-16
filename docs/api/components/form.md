# UForm

Componente para utilização de formulários.

## Props

| Prop         | Tipo     | Padrão | Descrição                                                                                                                    |
| ------------ | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `string` |        | Aplica atributo `id` no elemento [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form) nativo. |
| `dataTestid` | `string` |        | Aplica atributo `data-testid` para testes sobre o componente.                                                                |

## Eventos

| Evento   | Retorno                                                                       | Descrição                                                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit` | [`SubmitEvent`](https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent) | Disparado quando o formulário é submetido sem pendências de validação. O evento nativo já vem com o [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) |

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do formulário. |

## Exemplo

```vue
<template>
  <u-form @submit="onSubmit">
    <u-text-field label="Nome" required />
    <u-text-field label="Sobrenome" required />

    <u-button type="submit">Salvar</u-button>
  </u-form>
</template>

<script lang="ts" setup>
import { UForm, UButton, UTextField } from "@nexdom/uimed-vue/components";

function onSubmit(event: SubmitEvent) {
  console.log("Formulário submetido!", event);
}
</script>
```
