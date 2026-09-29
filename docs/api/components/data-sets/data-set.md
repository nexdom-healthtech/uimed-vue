# UDataSet

Componente para listagem de registros em uma grade responsiva de cartões, com paginação e pesquisa.
Cada registro da página atual ocupa a sua própria coluna da grade e é apresentado pelo slot padrão, normalmente com o componente [`UDataSetItem`](./data-set-item).

## Props

| Prop           | Tipo                    | Padrão                          | Descrição                                                                                                                                                                                                                    |
| -------------- | ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`        | `T[]`                   | `[]`                            | Registros a serem listados.                                                                                                                                                                                                  |
| `columns`      | `1 \| 2 \| 3 \| 4 \| 6` | `3`                             | Quantidade máxima de registros apresentados lado a lado em cada linha da grade. É reduzida quando não há espaço para cartões de pelo menos 240px de largura. Em telas muito pequenas, cada registro ocupa a largura inteira. |
| `itemsPerPage` | `number`                | `10`                            | Quantidade máxima de registros por página. Os controles de paginação só são exibidos quando há mais de uma página.                                                                                                           |
| `page`         | `number`                | `1`                             | Página atual. Utilize com `v-model:page`.                                                                                                                                                                                    |
| `searchable`   | `boolean`               | `false`                         | Exibe um campo de pesquisa acima dos registros.                                                                                                                                                                              |
| `search`       | `string`                | `""`                            | Texto pesquisado. Utilize com `v-model:search`. Filtra os registros mesmo quando o campo de pesquisa não é exibido.                                                                                                          |
| `searchKeys`   | `string[]`              |                                 | Propriedades dos registros consideradas na pesquisa. Quando não informada ou vazia, todas as propriedades são consideradas.                                                                                                  |
| `noDataText`   | `string`                | `"Nenhum registro encontrado."` | Mensagem exibida quando não há registros para listar.                                                                                                                                                                        |
| `loading`      | `boolean`               | `false`                         | Coloca a listagem em estado de carregamento.                                                                                                                                                                                 |
| `dataTestid`   | `string`                |                                 | Id do componente para uso em testes automatizados.                                                                                                                                                                           |

## Eventos

| Evento          | Retorno  | Descrição                                                                                      |
| --------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `update:page`   | `number` | Retorna a nova página sempre que ela é alterada. Volta para a primeira página a cada pesquisa. |
| `update:search` | `string` | Retorna o novo texto sempre que o usuário altera o campo de pesquisa.                          |

## Slots

| Slot      | Props                        | Descrição                                                                                                                           |
| --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `default` | `{ item: T, index: number }` | Apresenta cada registro da página atual, em uma coluna da grade. Recebe o registro original e a sua posição dentro da página atual. |

## Exemplo

```vue
<template>
  <u-data-set v-model:page="pagina" :items="pacientes" :columns="4" :items-per-page="8" searchable>
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" />
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

const pagina = ref(1);
const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
];
</script>
```
