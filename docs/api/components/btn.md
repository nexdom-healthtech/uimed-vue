# Btn

Componente para utilização de botões.

## Props

| Prop         | Tipo                                                                               | Padrão      | Descrição                                                     |
| ------------ | ---------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `variant`    | `"primary" \| "secondary" \| "ghost"`                                              | `"primary"` | Aplica uma variação de estilo distinta ao botão.              |
| `color`      | `"primary" \| "secondary" \| "positive" \| "informative" \| "caution" \| "danger"` | `"primary"` | Aplica uma cor ao botão.                                      |
| `disabled`   | `boolean`                                                                          | `false`     | Remove a possibilidade de clicar ou focar no botão.           |
| `loading`    | `boolean`                                                                          | `false`     | Exibe um indicador de carregamento.                           |
| `dataTestid` | `string`                                                                           |             | Aplica atributo `data-testid` para testes sobre o componente. |

## Eventos

| Evento  | Retorno                                                                     | Descrição                           |
| ------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `click` | [`MouseEvent`](https://developer.mozilla.org/pt-BR/docs/Web/API/MouseEvent) | Disparado quando o botão é clicado. |

## Slots

| Slot      | Descrição                         |
| --------- | --------------------------------- |
| `default` | Conteúdo exibido dentro do botão. |

## Exemplo

```vue
<template>
  <btn variant="ghost" color="danger" :loading="loading" @click="onClick"> </btn>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Btn } from "@nexdom/uimed-vue/components";

const loading = ref(false);

function onClick(event: MouseEvent) {
  console.log("Botão clicado!", event);
}
</script>
```
