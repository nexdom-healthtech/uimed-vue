# UCheckbox

Componente para utilização de caixas de seleção.

## Props

| Prop         | Tipo      | Padrão  | Descrição                                                                 |
| ------------ | --------- | ------- | ------------------------------------------------------------------------- |
| `modelValue` | `any`     | `false` | Valor selecionado pela caixa de seleção.                                  |
| `label`      | `string`  |         | Título dado à caixa de seleção.                                           |
| `disabled`   | `boolean` | `false` | Remove a possibilidade de interação com a caixa de seleção.               |
| `readonly`   | `boolean` | `false` | Remove a possibilidade de alteração do valor da caixa de seleção.         |
| `trueValue`  | `any`     | `true`  | Valor aplicado ao `modelValue` quando a caixa de seleção está marcada.    |
| `falseValue` | `any`     | `false` | Valor aplicado ao `modelValue` quando a caixa de seleção está desmarcada. |
| `dataTestid` | `string`  |         | Aplica atributo `data-testid` para testes sobre o componente.             |

## Eventos

| Evento              | Retorno | Descrição                                                               |
| ------------------- | ------- | ----------------------------------------------------------------------- |
| `update:modelValue` | `T`     | Retorna o novo valor da caixa de seleção sempre que o usuário o altera. |

## Exemplo

```vue
<template>
  <u-checkbox v-model="accepted" label="Aceito os termos de uso" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UCheckbox } from "@nexdom/uimed-vue/components";

const accepted = ref(false);
</script>
```
