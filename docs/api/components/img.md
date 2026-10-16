# UImg

Componente para exibir imagens decorativas, ignoradas por leitores de tela.
Por padrão, a imagem só é carregada quando está prestes a aparecer na tela.

## Props

| Prop          | Tipo               | Padrão  | Descrição                                                                                                                                                                                                                |
| ------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src`         | `string`           |         | **Obrigatória.** Caminho ou URL da imagem.                                                                                                                                                                               |
| `width`       | `number \| string` |         | Largura da imagem. Números são medidas em pixels, e textos aceitam qualquer unidade CSS (por exemplo, `"50%"`). Encolhe até a largura disponível quando é maior que ela (por exemplo, dentro de uma `UColumn` estreita). |
| `height`      | `number \| string` |         | Altura da imagem. Números são medidas em pixels, e textos aceitam qualquer unidade CSS (por exemplo, `"10rem"`).                                                                                                         |
| `aspectRatio` | `number`           |         | Proporção entre largura e altura (por exemplo, `16 / 9`), usada para reservar o espaço da imagem antes de ela carregar. Ignorada quando `height` é informada.                                                            |
| `cover`       | `boolean`          | `false` | Preenche todo o espaço da imagem, recortando-a quando sua proporção é diferente da do espaço. Por padrão, a imagem é exibida por inteiro dentro do espaço.                                                               |
| `eager`       | `boolean`          | `false` | Carrega a imagem assim que a página é aberta, em vez de quando ela está prestes a aparecer na tela. Use em imagens visíveis desde a abertura da página, como uma logo.                                                   |
| `dataTestid`  | `string`           |         | Id do componente para uso em testes automatizados.                                                                                                                                                                       |

Não há eventos nem slots.

## Exemplo

```vue
<template>
  <u-row>
    <u-column cols="12">
      <u-img src="/logo.svg" :width="380" :height="88" eager />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```
