# UMaskField

Componente para utilização de campos de texto com máscara, como CPF, CNPJ, CEP e telefone.

## Props

| Prop          | Tipo                                                                         | Padrão      | Descrição                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                                                                     | `""`        | Somente os dígitos do valor, sem os separadores da máscara (por exemplo, `12345678909` para `123.456.789-09`).                                                                                                                                                                              |
| `mask`        | `` "cpf" \| "cnpj" \| "cep" \| "phone" \| "date" \| `${string}#${string}` `` |             | **Obrigatória.** Máscara predefinida ou a própria máscara, em que `#` representa um dígito (0–9) e qualquer outro caractere, inclusive uma letra, é um separador fixo inserido automaticamente (ex.: `####-##/####` ou `Nº ####`). Uma máscara personalizada precisa ter pelo menos um `#`. |
| `variant`     | `"primary" \| "secondary"`                                                   | `"primary"` | Aplica uma variação de estilo distinta ao campo.                                                                                                                                                                                                                                            |
| `label`       | `string`                                                                     |             | Título dado ao campo.                                                                                                                                                                                                                                                                       |
| `placeholder` | `string`                                                                     | A máscara   | Exemplo de valor para preenchimento do campo. Sem ela, é a máscara com `0` no lugar de cada `#`, como `000.000.000-00` para `cpf` e `Nº 0000` para `Nº ####`.                                                                                                                               |
| `hint`        | `string`                                                                     |             | Dica, instrução ou mensagem relacionada ao campo.                                                                                                                                                                                                                                           |
| `required`    | `boolean`                                                                    | `false`     | Torna o campo obrigatório para a submissão do formulário.                                                                                                                                                                                                                                   |
| `disabled`    | `boolean`                                                                    | `false`     | Remove a possibilidade de interação com o campo.                                                                                                                                                                                                                                            |
| `readonly`    | `boolean`                                                                    | `false`     | Remove a possibilidade de edição do campo.                                                                                                                                                                                                                                                  |
| `loading`     | `boolean`                                                                    | `false`     | Exibe um indicador de carregamento. O campo mantém o rótulo como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador.                                                                                                                                        |
| `clearable`   | `boolean`                                                                    | `false`     | Exibe recurso para limpar o campo, alterando o valor para `""`.                                                                                                                                                                                                                             |
| `dataTestid`  | `string`                                                                     |             | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                                                                                               |

As máscaras predefinidas são:

| `mask`  | Máscara              | Exemplo              |
| ------- | -------------------- | -------------------- |
| `cpf`   | `###.###.###-##`     | `123.456.789-09`     |
| `cnpj`  | `##.###.###/####-##` | `12.345.678/0001-95` |
| `cep`   | `#####-###`          | `01310-100`          |
| `phone` | `(##) #####-####`    | `(11) 91234-5678`    |
| `date`  | `##/##/####`         | `31/12/2026`         |

Em dispositivos móveis, o teclado numérico é exibido. Evite separadores fixos que o usuário também poderia digitar, como os dígitos de `0800 ###-####`: quando o campo espera um desses separadores, o caractere igual a ele é lido como o separador, e não como valor.

Enquanto a máscara não estiver completa, o campo exibe a mensagem "Valor incompleto", e um `modelValue` que não cabe na máscara (por exemplo, após trocar a prop `mask` de `cnpj` para `cpf`) exibe a mensagem "Valor inválido". Ao trocar a prop `mask` com o campo preenchido, ajuste ou limpe o valor na aplicação.

O campo não valida os dígitos verificadores do CPF e do CNPJ nem a existência do documento: valide-os no backend da aplicação. A máscara `cnpj` aceita somente dígitos: o CNPJ com letras nas 12 primeiras posições, válido desde julho de 2026 (IN RFB nº 2.229/2024), ainda não é suportado.

## Eventos

| Event               | Retorno  | Descrição                                                                                           |
| ------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `update:modelValue` | `string` | Retorna somente os dígitos do campo, sem os separadores da máscara, sempre que o usuário os altera. |

## Exemplo

```vue
<template>
  <u-mask-field v-model="cpf" label="CPF" mask="cpf" />
  CPF sem máscara: {{ cpf }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMaskField } from "@nexdom/uimed-vue/components";

const cpf = ref("");
</script>
```
