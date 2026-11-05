# UTabsItem

Conteúdo de uma aba, exibido enquanto a aba de mesmo `value` está selecionada no [`UTabs`](./tabs).
O conteúdo só é montado quando a aba é aberta pela primeira vez, e continua montado, escondido, ao trocar de aba.

Deve ser colocado exclusivamente dentro de um [`UTabsContent`](./tabs-content).

## Props

| Prop         | Tipo                 | Padrão | Descrição                                                                                                                                                            |
| ------------ | -------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`      | `string` \| `number` |        | Valor da aba cujo conteúdo este é, o mesmo `value` do item no `UTabs`. Sem ele, o conteúdo recebe a sua posição, a partir de `0`. Deve ser único entre os conteúdos. |
| `dataTestid` | `string`             |        | Id do componente para uso em testes automatizados.                                                                                                                   |

## Slots

| Slot      | Descrição                                             |
| --------- | ----------------------------------------------------- |
| `default` | Conteúdo exibido enquanto a sua aba está selecionada. |

## Exemplo

```vue
<template>
  <u-tabs v-model="tab" :items />
  <u-tabs-content v-model="tab">
    <u-tabs-item value="dados">Nome, data de nascimento e documentos</u-tabs-item>
    <u-tabs-item value="endereco">Rua, número, bairro e CEP</u-tabs-item>
  </u-tabs-content>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UTabs, UTabsContent, UTabsItem } from "@nexdom/uimed-vue/components";

const tab = ref<string | number>();
const items = [
  { title: "Dados pessoais", value: "dados" },
  { title: "Endereço", value: "endereco" },
];
</script>
```
