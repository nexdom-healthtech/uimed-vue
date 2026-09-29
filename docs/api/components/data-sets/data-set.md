# UDataSet

Componente para listagem de registros, com paginação e pesquisa.
Cada registro da página atual é apresentado pelo slot padrão, normalmente com os componentes [`UDataSetItem`](./data-set-item) e [`UDataSetItemTitle`](./data-set-item-title).

## Props

| Prop           | Tipo       | Padrão                          | Descrição                                                                                                                   |
| -------------- | ---------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`        | `T[]`      | `[]`                            | Registros a serem listados.                                                                                                 |
| `itemsPerPage` | `number`   | `10`                            | Quantidade máxima de registros por página. Os controles de paginação só são exibidos quando há mais de uma página.          |
| `page`         | `number`   | `1`                             | Página atual. Utilize com `v-model:page`.                                                                                   |
| `searchable`   | `boolean`  | `false`                         | Exibe um campo de pesquisa acima dos registros.                                                                             |
| `search`       | `string`   | `""`                            | Texto pesquisado. Utilize com `v-model:search`. Filtra os registros mesmo quando o campo de pesquisa não é exibido.         |
| `searchKeys`   | `string[]` |                                 | Propriedades dos registros consideradas na pesquisa. Quando não informada ou vazia, todas as propriedades são consideradas. |
| `noDataText`   | `string`   | `"Nenhum registro encontrado."` | Mensagem exibida quando não há registros para listar.                                                                       |
| `loading`      | `boolean`  | `false`                         | Coloca a listagem em estado de carregamento.                                                                                |
| `dataTestid`   | `string`   |                                 | Id do componente para uso em testes automatizados.                                                                          |

## Eventos

| Evento          | Retorno  | Descrição                                                                                      |
| --------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `update:page`   | `number` | Retorna a nova página sempre que ela é alterada. Volta para a primeira página a cada pesquisa. |
| `update:search` | `string` | Retorna o novo texto sempre que o usuário altera o campo de pesquisa.                          |

## Slots

| Slot      | Props                        | Descrição                                                                                                   |
| --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `default` | `{ item: T, index: number }` | Apresenta cada registro da página atual. Recebe o registro original e a sua posição dentro da página atual. |

## Exemplo

```vue
<template>
  <u-data-set v-model:page="pagina" :items="pacientes" :items-per-page="5" searchable>
    <template #default="{ item }">
      <u-data-set-item>
        <u-data-set-item-title :title="item.nome" />
        Plano {{ item.plano }}
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pagina = ref(1);
const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
];
</script>
```
