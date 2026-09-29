# UDataSetItemTitle

Componente utilizado para apresentar o título de um registro, dentro do [`UDataSetItem`](./data-set-item).

## Props

| Prop         | Tipo     | Padrão | Descrição                                                                   |
| ------------ | -------- | ------ | --------------------------------------------------------------------------- |
| `title`      | `string` |        | Texto exibido como título do registro. Substituído pelo slot, se informado. |
| `dataTestid` | `string` |        | Id do componente para uso em testes automatizados.                          |

## Slots

| Slot      | Descrição                                                      |
| --------- | -------------------------------------------------------------- |
| `default` | Conteúdo exibido como título do registro, no lugar do `title`. |

## Exemplo

```vue
<template>
  <u-data-set :items="pacientes">
    <template #default="{ item, index }">
      <u-data-set-item>
        <u-data-set-item-title>{{ index + 1 }}. {{ item.nome }}</u-data-set-item-title>
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pacientes = [{ id: 1, nome: "Ana Souza" }];
</script>
```
