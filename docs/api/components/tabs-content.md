# UTabsContent

Componente que exibe o conteúdo ([`UTabsItem`](./tabs-item)) da aba selecionada em um [`UTabs`](./tabs).
Compartilha o mesmo `v-model` com o `UTabs`, e deve vir logo depois dele.

## Props

| Prop         | Tipo                 | Padrão | Descrição                                                                 |
| ------------ | -------------------- | ------ | ------------------------------------------------------------------------- |
| `modelValue` | `string` \| `number` |        | `value` (ou posição) do `UTabsItem` exibido. Deve ser o mesmo do `UTabs`. |
| `dataTestid` | `string`             |        | Id do componente para uso em testes automatizados.                        |

## Eventos

| Evento              | Retorno              | Descrição                                                            |
| ------------------- | -------------------- | -------------------------------------------------------------------- |
| `update:modelValue` | `string` \| `number` | Existe apenas para o `v-model`: a aba selecionada muda pelo `UTabs`. |

## Slots

| Slot      | Descrição                                                  |
| --------- | ---------------------------------------------------------- |
| `default` | Conteúdos das abas, cada um um [`UTabsItem`](./tabs-item). |

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
