# Button

Componente principal para utilização de botões.

## Props

| Prop       | Tipo                                                                 | Padrão       | Descrição                                                                              |
| ---------- | -------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------- |
| `type`     | `"elevated" \| "flat" \| "outlined" \| "plain" \| "text" \| "tonal"` | `"elevated"` | Aplica uma variação de estilo distinta ao botão.                                       |
| `color`    | `string`                                                             | `"primary"`  | Aplica uma cor ao botão. Aceita qualquer cor da paleta do tema ou um valor CSS válido. |
| `disabled` | `boolean`                                                            | `false`      | Remove a possibilidade de clicar ou focar no botão.                                    |
| `loading`  | `boolean \| string`                                                  | `false`      | Exibe um indicador de carregamento. Aceita o nome de um slot para usar como loader.    |
| `position` | `"absolute" \| "fixed" \| "relative" \| "static" \| "sticky"`        | `"static"`   | Define a propriedade CSS `position` do botão.                                          |

## Slots

| Slot      | Descrição                                                 |
| --------- | --------------------------------------------------------- |
| `default` | Conteúdo exibido dentro do botão.                         |
| `loader`  | Conteúdo customizado exibido quando `loading` está ativo. |

## Exemplo

```vue
<template>
  <btn type="outlined" :loading="loading" @click="onClick"></btn>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Button as Btn } from "@nexdom/uimed/components/button";

const loading = ref(false);

function onClick(event: MouseEvent) {
  console.log("Botão clicado!", event);
}
</script>
```
