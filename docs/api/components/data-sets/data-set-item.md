# UDataSetItem

Componente utilizado para apresentar um registro listado pelo [`UDataSet`](./data-set) como um cartão, baseado no [`USection`](../sections/section).
Ocupa toda a altura da sua coluna, de forma que os cartões de uma mesma linha fiquem alinhados.

## Props

| Prop         | Tipo                                     | Padrão      | Descrição                                                                   |
| ------------ | ---------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `title`      | `string`                                 |             | Título do registro, exibido no topo do cartão.                              |
| `subtitle`   | `string`                                 |             | Breve descrição do registro, exibida abaixo do título.                      |
| `variant`    | `"primary" \| "secondary"`               | `"primary"` | Aplica uma variação de estilo distinta ao cartão, assim como no `USection`. |
| `actions`    | [`action[]`](../sections/section#action) |             | Lista de ações do registro, exibidas no rodapé do cartão.                   |
| `dataTestid` | `string`                                 |             | Id do componente para uso em testes automatizados.                          |

## Slots

| Slot      | Descrição                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `default` | Detalhes do registro, exibidos abaixo do título, como uma [`UTable`](../table) `vertical` com alguns campos. |

## Exemplo

```vue
<template>
  <u-data-set :items="pacientes" :columns="2">
    <template #default="{ item }">
      <u-data-set-item
        :title="item.nome"
        :subtitle="item.cidade"
        :actions="[{ label: 'Editar', variant: 'secondary', onClick: () => editar(item) }]"
      >
        <u-table
          :headers="['Plano', 'Idade', 'Carteirinha']"
          :items="[[item.plano, item.idade, item.carteirinha]]"
          vertical
        />
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UTable } from "@nexdom/uimed-vue/components";

const pacientes = [
  {
    id: 1,
    nome: "Ana Souza",
    cidade: "São Paulo - SP",
    plano: "Ouro",
    idade: "34 anos",
    carteirinha: "0001 2345 6789",
  },
];

function editar(paciente: (typeof pacientes)[number]) {
  // ...
}
</script>
```
