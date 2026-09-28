# UDateTimeField

Componente para utilização de campos de data e/ou hora.

## Props

| Prop          | Tipo                             | Padrão       | Descrição                                                                                                                             |
| ------------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                         | `""`         | Valor do campo, nos formatos `YYYY-MM-DD` (`date`), `HH:mm` (`time`) ou `YYYY-MM-DDTHH:mm` (`datetime`).                              |
| `type`        | `"date" \| "time" \| "datetime"` | `"datetime"` | Define os seletores apresentados (data, horário ou ambos) e o formato do valor.                                                       |
| `variant`     | `"primary" \| "secondary"`       | `"primary"`  | Aplica uma variação de estilo distinta ao campo.                                                                                      |
| `min`         | `string`                         |              | Valor mínimo permitido, no mesmo formato do `modelValue`. No tipo `datetime`, o horário mínimo só se aplica à própria data do mínimo. |
| `max`         | `string`                         |              | Valor máximo permitido, no mesmo formato do `modelValue`. No tipo `datetime`, o horário máximo só se aplica à própria data do máximo. |
| `label`       | `string`                         |              | Título dado ao campo.                                                                                                                 |
| `placeholder` | `string`                         |              | Exemplo de valor para preenchimento do campo.                                                                                         |
| `hint`        | `string`                         |              | Dica, instrução ou mensagem relacionada ao campo.                                                                                     |
| `required`    | `boolean`                        | `false`      | Torna o campo obrigatório para a submissão do formulário.                                                                             |
| `disabled`    | `boolean`                        | `false`      | Remove a possibilidade de interação com o campo.                                                                                      |
| `readonly`    | `boolean`                        | `false`      | Remove a possibilidade de edição do campo. O seletor não é aberto.                                                                    |
| `loading`     | `boolean`                        | `false`      | Exibe um indicador de carregamento.                                                                                                   |
| `clearable`   | `boolean`                        | `false`      | Exibe recurso para limpar o campo, alterando o valor para `""`. Não é exibido enquanto o campo for `readonly`.                        |
| `dataTestid`  | `string`                         |              | Aplica atributo `data-testid` para testes sobre o componente.                                                                         |

## Eventos

| Event               | Retorno  | Descrição                                                                                |
| ------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `update:modelValue` | `string` | Retorna o novo valor do campo sempre que o usuário escolhe um valor completo ou o limpa. |

## Exemplo

```vue
<template>
  <u-date-time-field v-model="appointment" label="Data e hora da consulta" />
  Consulta agendada para: {{ appointment }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDateTimeField } from "@nexdom/uimed-vue/components";

const appointment = ref("");
</script>
```
