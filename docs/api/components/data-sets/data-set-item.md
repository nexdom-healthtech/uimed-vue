# UDataSetItem

Componente utilizado para agrupar o conteúdo de um registro listado pelo [`UDataSet`](./data-set).

## Props

| Prop         | Tipo     | Padrão | Descrição                                          |
| ------------ | -------- | ------ | -------------------------------------------------- |
| `dataTestid` | `string` |        | Id do componente para uso em testes automatizados. |

## Slots

| Slot      | Descrição                                                                             |
| --------- | ------------------------------------------------------------------------------------- |
| `default` | Conteúdo do registro, como o [`UDataSetItemTitle`](./data-set-item-title) e detalhes. |

## Exemplo

```vue
<template>
  <u-data-set :items="pacientes">
    <template #default="{ item }">
      <u-data-set-item>
        <u-data-set-item-title :title="item.nome" />
        Plano {{ item.plano }}
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pacientes = [{ id: 1, nome: "Ana Souza", plano: "Ouro" }];
</script>
```
