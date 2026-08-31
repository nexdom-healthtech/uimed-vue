# TextField

Componente para utilização de campos de text.

## Props

| Prop          | Tipo                                                               | Padrão      | Descrição                                                                                      |
| ------------- | ------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                                                           | `""`        | Aplica uma variação de estilo distinta ao botão.                                               |
| `variant`     | `"primary" \| "secondary"`                                         | `"primary"` | Aplica uma variação de estilo distinta ao campo.                                               |
| `type`        | `"text" \| "phone" \| "email" \| "url" \| "password" \| "search" ` | `"text"`    | Ajusta o tipo de campo de texto.                                                               |
| `label`       | `string`                                                           |             | Título dado ao campo.                                                                          |
| `placeholder` | `string`                                                           |             | Exemplo de valor para preenchimento do campo.                                                  |
| `hint`        | `string`                                                           |             | Dica, instrução ou mensagem relacionada ao campo.                                              |
| `required`    | `boolean`                                                          | `false`     | Torna o campo obrigatório para a submissão do formulário.                                      |
| `disabled`    | `boolean`                                                          | `false`     | Remove a possibilidade de interação com o campo.                                               |
| `readonly`    | `boolean`                                                          | `false`     | Remove a possibilidade de edição do campo.                                                     |
| `loading`     | `boolean`                                                          | `false`     | Exibe um indicador de carregamento.                                                            |
| `clearable`   | `boolean`                                                          | `false`     | Exibe recurso para limpar o campo. O valor padrão muda para `true` quando o `type` é `search`. |
| `dataTestid`  | `string`                                                           |             | Aplica atributo `data-testid` para testes sobre o componente.                                  |

## Eventos

| Event               | Retorno  | Descrição                                                          |
| ------------------- | -------- | ------------------------------------------------------------------ |
| `update:modelValue` | `string` | Retorna o novo valor do campo sempre que o usuário altera o mesmo. |

## Exemplo

```vue
<template>
  <text-field v-model="name" label="Nome" />
  Olá, {{ name }}!
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TextField } from "@nexdom/uimed-vue/components";

const name = ref("");
</script>
```
