# UIconButton

Componente para botões que exibem apenas um ícone.
O ícone é ignorado pelos leitores de tela, que anunciam no lugar dele o texto de `label`.

## Props

| Prop         | Tipo                                                                               | Padrão      | Descrição                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `icon`       | [`Icon`](../../guide/icons)                                                        |             | **Obrigatória.** Ícone exibido no botão. Um dos nomes listados em [Ícones](../../guide/icons).                                                                                                   |
| `label`      | `string`                                                                           |             | **Obrigatória.** Nome do botão anunciado pelos leitores de tela no lugar do ícone. Deve descrever a ação do botão (exemplo: `"Editar paciente"`), e não o desenho do ícone (exemplo: `"Lápis"`). |
| `color`      | `"primary" \| "secondary" \| "positive" \| "informative" \| "caution" \| "danger"` | `"primary"` | Aplica uma cor ao botão.                                                                                                                                                                         |
| `dataTestid` | `string`                                                                           |             | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                    |

## Eventos

| Evento  | Retorno                                                                     | Descrição                           |
| ------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `click` | [`MouseEvent`](https://developer.mozilla.org/pt-BR/docs/Web/API/MouseEvent) | Disparado quando o botão é clicado. |

Não há slots.

## Exemplo

```vue
<template>
  <u-icon-button icon="file-document" label="Abrir guia" color="secondary" @click="onClick" />
</template>

<script lang="ts" setup>
import { UIconButton } from "@nexdom/uimed-vue/components";

function onClick(event: MouseEvent) {
  console.log("Botão clicado!", event);
}
</script>
```
