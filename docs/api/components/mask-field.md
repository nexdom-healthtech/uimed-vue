# UMaskField

Componente para utilização de campos de texto com máscara, como CPF, CNPJ, CEP e telefone.

## Props

| Prop          | Tipo                                                                         | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                                                                     | `""`        | Somente os caracteres do valor, sem os separadores da máscara e com as letras em maiúsculas (por exemplo, `12345678909` para `123.456.789-09` e `12ABC34501DE35` para `12.ABC.345/01DE-35`).                                                                                                                                                                  |
| `mask`        | `` "cpf" \| "cnpj" \| "cep" \| "phone" \| "date" \| `${string}#${string}` `` |             | **Obrigatória.** Máscara predefinida ou a própria máscara, em que `#` representa um dígito (0–9) e qualquer outro caractere, inclusive uma letra, é um separador fixo inserido automaticamente (ex.: `####-##/####` ou `Nº ####`). Uma máscara personalizada precisa ter pelo menos um `#`. As 12 primeiras posições da máscara `cnpj` também aceitam letras. |
| `variant`     | `"primary" \| "secondary"`                                                   | `"primary"` | Aplica uma variação de estilo distinta ao campo.                                                                                                                                                                                                                                                                                                              |
| `label`       | `string`                                                                     |             | Título dado ao campo.                                                                                                                                                                                                                                                                                                                                         |
| `placeholder` | `string`                                                                     | A máscara   | Exemplo de valor para preenchimento do campo. Sem ela, é a máscara com `0` no lugar de cada `#`, como `000.000.000-00` para `cpf`, `00.000.000/0000-00` para `cnpj` e `Nº 0000` para `Nº ####`.                                                                                                                                                               |
| `hint`        | `string`                                                                     |             | Dica, instrução ou mensagem relacionada ao campo.                                                                                                                                                                                                                                                                                                             |
| `required`    | `boolean`                                                                    | `false`     | Torna o campo obrigatório para a submissão do formulário.                                                                                                                                                                                                                                                                                                     |
| `disabled`    | `boolean`                                                                    | `false`     | Remove a possibilidade de interação com o campo.                                                                                                                                                                                                                                                                                                              |
| `readonly`    | `boolean`                                                                    | `false`     | Remove a possibilidade de edição do campo.                                                                                                                                                                                                                                                                                                                    |
| `loading`     | `boolean`                                                                    | `false`     | Exibe um indicador de carregamento. O campo mantém o rótulo como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador.                                                                                                                                                                                                          |
| `clearable`   | `boolean`                                                                    | `false`     | Exibe recurso para limpar o campo, alterando o valor para `""`.                                                                                                                                                                                                                                                                                               |
| `dataTestid`  | `string`                                                                     |             | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                                                                                                                                                                 |

As máscaras predefinidas são:

| `mask`  | Máscara              | Caracteres                       | Exemplo                                      | `modelValue`                         |
| ------- | -------------------- | -------------------------------- | -------------------------------------------- | ------------------------------------ |
| `cpf`   | `###.###.###-##`     | 11 dígitos                       | `123.456.789-09`                             | `12345678909`                        |
| `cnpj`  | `##.###.###/####-##` | 12 letras ou dígitos + 2 dígitos | `12.345.678/0001-95`<br>`12.ABC.345/01DE-35` | `12345678000195`<br>`12ABC34501DE35` |
| `cep`   | `#####-###`          | 8 dígitos                        | `01310-100`                                  | `01310100`                           |
| `phone` | `(##) #####-####`    | 11 dígitos                       | `(11) 91234-5678`                            | `11912345678`                        |
| `date`  | `##/##/####`         | 8 dígitos                        | `31/12/2026`                                 | `31122026`                           |

A máscara `cnpj` aceita o CNPJ numérico e o alfanumérico (IN RFB nº 2.229/2024): letras de A a Z, sem acento, ou dígitos nas 12 primeiras posições, e somente dígitos nas 2 últimas. Ela só é aceita com `mask="cnpj"`: a máscara `##.###.###/####-##`, informada como máscara personalizada, aceita somente dígitos. Letras digitadas ou coladas em minúsculas são exibidas e enviadas em maiúsculas, e um `modelValue` com letras minúsculas é exibido em maiúsculas e é válido. Os demais caracteres (símbolos, letras acentuadas, `ç`, letras nos dígitos verificadores e o excesso) são descartados. Inserir ou apagar um caractere no meio do valor desloca os seguintes, e um caractere que não cabe na nova posição (como uma letra deslocada para os dígitos verificadores) é descartado.

Em dispositivos móveis, o teclado numérico é exibido nas máscaras que aceitam somente dígitos, e o teclado de texto, já em maiúsculas, na máscara `cnpj`. Evite separadores fixos que o usuário também poderia digitar, como os dígitos de `0800 ###-####`: quando o campo espera um desses separadores, o caractere igual a ele é lido como o separador, e não como valor.

Enquanto a máscara não estiver completa (por exemplo, um CNPJ com menos de 14 caracteres), o campo exibe a mensagem "Valor incompleto", e um `modelValue` que não cabe na máscara (por exemplo, após trocar a prop `mask` de `cnpj` para `cpf`) exibe a mensagem "Valor inválido". Ao trocar a prop `mask` com o campo preenchido, ajuste ou limpe o valor na aplicação.

O campo não valida os dígitos verificadores do CPF e do CNPJ nem a existência do documento: valide-os no backend da aplicação.

## Eventos

| Event               | Retorno  | Descrição                                                                                                                            |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `update:modelValue` | `string` | Retorna somente os caracteres do campo, sem os separadores da máscara e com as letras em maiúsculas, sempre que o usuário os altera. |

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
