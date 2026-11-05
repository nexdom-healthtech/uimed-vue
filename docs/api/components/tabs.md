# UTabs

Componente que exibe uma linha de abas e seleciona qual conteúdo do [`UTabsContent`](./tabs-content) é exibido.
O `UTabs` e o `UTabsContent` compartilham o mesmo `v-model`, e o `UTabsContent` deve vir logo depois do `UTabs`.
Quando o `v-model` está vazio, a primeira aba é selecionada.

## Props

| Prop         | Tipo                 | Padrão | Descrição                                                                                                                       |
| ------------ | -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `items`      | [`item[]`](#item)    |        | Abas exibidas, em ordem.                                                                                                        |
| `modelValue` | `string` \| `number` |        | `value` da aba selecionada (ou a sua posição, a partir de `0`, quando ela não tem `value`). Deve ser o mesmo do `UTabsContent`. |
| `dataTestid` | `string`             |        | Id do componente para uso em testes automatizados.                                                                              |

### item

| Propriedade | Tipo                 | Padrão | Descrição                                                                                                                                                    |
| ----------- | -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`     | `string`             |        | Texto exibido na aba.                                                                                                                                        |
| `value`     | `string` \| `number` |        | Valor da aba, que a liga ao [`UTabsItem`](./tabs-item) de mesmo `value`. Sem ele, a aba recebe a sua posição, a partir de `0`. Deve ser único entre as abas. |

## Eventos

| Evento              | Retorno              | Descrição                                                                                                                    |
| ------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `update:modelValue` | `string` \| `number` | Retorna o `value` (ou a posição) da aba selecionada, inclusive o da primeira aba, selecionada quando o `v-model` está vazio. |

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
