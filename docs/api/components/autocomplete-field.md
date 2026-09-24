# UAutocompleteField

Componente para campos com preenchimento automático (autocomplete/combobox).

## Props

| Prop          | Tipo                                           | Padrão      | Descrição                                                                                |
| ------------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `modelValue`  | `T` ou `T[]`                                   |             | Valor selecionado ou digitado. Vira array automaticamente quando `multiple` é `true`.    |
| `variant`     | `"primary" \| "secondary"`                     | `"primary"` | Aplica uma variação de estilo distinta ao campo.                                         |
| `label`       | `string`                                       |             | Título dado ao campo.                                                                    |
| `placeholder` | `string`                                       |             | Exemplo de valor para preenchimento do campo.                                            |
| `hint`        | `string`                                       |             | Dica, instrução ou mensagem relacionada ao campo.                                        |
| `required`    | `boolean`                                      | `false`     | Torna o campo obrigatório para a submissão do formulário.                                |
| `disabled`    | `boolean`                                      | `false`     | Remove a possibilidade de interação com o campo.                                         |
| `readonly`    | `boolean`                                      | `false`     | Remove a possibilidade de edição do campo.                                               |
| `loading`     | `boolean`                                      | `false`     | Exibe um indicador de carregamento.                                                      |
| `clearable`   | `boolean`                                      | `false`     | Exibe recurso para limpar o campo.                                                       |
| `strict`      | `boolean`                                      | `false`     | Quando `true`, força seleção de itens da lista. Quando `false`, permite digitação livre. |
| `multiple`    | `boolean`                                      | `false`     | Permite a seleção de múltiplos valores.                                                  |
| `items`       | `Array<string \| { label: string; value: T }>` | `[]`        | Lista de itens disponíveis para seleção. Pode ser strings ou objetos com label/value.    |
| `dataTestid`  | `string`                                       |             | Aplica atributo `data-testid` para testes sobre o componente.                            |

## Eventos

| Event               | Retorno                                   | Descrição                                                 |
| ------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `update:modelValue` | `T` (ou `T[]` quando `multiple` é `true`) | Retorna o novo valor sempre que o usuário altera o campo. |

## Exemplo

```vue
<template>
  <u-autocomplete-field v-model="selectedCountry" label="País" :items="countries" />
  Selecionado: {{ selectedCountry }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UAutocompleteField } from "@nexdom/uimed-vue/components";

const selectedCountry = ref("");
const countries = ["Brasil", "Portugal", "Moçambique"];
</script>
```
