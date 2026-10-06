---
outline: deep
---

# Imagens

O componente padrão para exibir imagens se chama `Img`.

As imagens são decorativas: leitores de tela as ignoram. Quando a imagem transmite informação, apresente essa informação também em texto na página.

Por padrão, a imagem só é carregada quando está prestes a aparecer na tela. Até lá, e enquanto ela carrega, o espaço reservado para ela fica vazio. Informe as dimensões da imagem (`width` e `height`, ou `aspectRatio`) para reservar esse espaço e evitar que o conteúdo da página se desloque quando ela aparecer.

> [!Warning]
> Coloque a imagem dentro de uma `UColumn`. Diretamente dentro de uma `URow`, sem coluna, a imagem ignora a `width` e ocupa toda a largura da linha.

## Propriedades

### Dimensões

As props `width` e `height` definem a largura e a altura da imagem e reservam esse espaço antes de ela carregar. Números são medidas em pixels, e textos aceitam qualquer unidade CSS, como `"50%"`, relativa à largura da coluna.

Dentro de uma `UColumn`, a largura nunca ultrapassa a da coluna: quando é maior, a imagem encolhe até a largura da coluna, mantendo a altura informada.

<demo>
<u-row>
  <u-column>
    <u-img src="/uimed-vue/favicon.svg" :width="187" :height="239" data-testid="demo-img-size" />
  </u-column>
</u-row>
</demo>

```vue
<template>
  <u-row>
    <u-column>
      <u-img src="/logo.svg" :width="187" :height="239" />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```

Com uma porcentagem em `width` e uma `aspectRatio`, a imagem acompanha a largura da coluna e mantém a proporção.

<demo>
<u-row>
  <u-column>
    <u-img src="/uimed-vue/avatar.jpg" width="50%" :aspect-ratio="3 / 4" data-testid="demo-img-relative-size" />
  </u-column>
</u-row>
</demo>

```vue
<template>
  <u-row>
    <u-column>
      <u-img src="/foto.jpg" width="50%" :aspect-ratio="3 / 4" />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```

### Proporção

A prop `aspectRatio` define a proporção entre a largura e a altura da imagem (por exemplo, `16 / 9`). A altura é calculada a partir da largura, então o espaço é reservado mesmo quando a largura depende da coluna.

Sem `width`, a imagem ocupa toda a largura da coluna. Quando `height` também é informada, ela prevalece sobre a `aspectRatio`.

<demo>
<u-row>
  <u-column cols="4">
    <u-img src="/uimed-vue/avatar.jpg" :aspect-ratio="3 / 4" data-testid="demo-img-aspect-ratio" />
  </u-column>
  <u-column cols="8">
    <u-img src="/uimed-vue/avatar.jpg" :width="120" :aspect-ratio="3 / 4" data-testid="demo-img-aspect-ratio-width" />
  </u-column>
</u-row>
</demo>

```vue
<template>
  <u-row>
    <u-column cols="4">
      <u-img src="/foto.jpg" :aspect-ratio="3 / 4" />
    </u-column>
    <u-column cols="8">
      <u-img src="/foto.jpg" :width="120" :aspect-ratio="3 / 4" />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```

### Preenchimento

Por padrão, a imagem é exibida por inteiro dentro do espaço reservado, que pode ficar com sobras quando a proporção da imagem é diferente da do espaço.

A prop `cover` faz a imagem preencher todo o espaço, recortando o que exceder. Ela só faz diferença quando a proporção do espaço é definida, com `width` e `height` ou com `aspectRatio`.

<demo>
<u-row>
  <u-column cols="6">
    <u-img src="/uimed-vue/avatar.jpg" :width="240" :height="160" data-testid="demo-img-contain" />
  </u-column>
  <u-column cols="6">
    <u-img src="/uimed-vue/avatar.jpg" :width="240" :height="160" cover data-testid="demo-img-cover" />
  </u-column>
</u-row>
</demo>

```vue
<template>
  <u-row>
    <u-column cols="6">
      <u-img src="/foto.jpg" :width="240" :height="160" />
    </u-column>
    <u-column cols="6">
      <u-img src="/foto.jpg" :width="240" :height="160" cover />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento imediato

Por padrão, a imagem só é carregada quando está prestes a aparecer na tela, o que economiza dados em páginas com muitas imagens.

A prop `eager` carrega a imagem assim que a página é aberta. Use-a em imagens visíveis desde a abertura da página, como a logo de uma tela de login.

<demo>
<u-row>
  <u-column cols="6">
    <u-img src="/uimed-vue/avatar.jpg" :width="120" :height="160" data-testid="demo-img-lazy" />
  </u-column>
  <u-column cols="6">
    <u-img src="/uimed-vue/avatar.jpg" :width="120" :height="160" eager data-testid="demo-img-eager" />
  </u-column>
</u-row>
</demo>

```vue
<template>
  <u-row>
    <u-column cols="6">
      <u-img src="/foto.jpg" :width="120" :height="160" />
    </u-column>
    <u-column cols="6">
      <u-img src="/foto.jpg" :width="120" :height="160" eager />
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { UColumn, UImg, URow } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-row>
  <u-column>
    <u-img
      :src="playgroundActions.src.value"
      :width="toSize(playgroundActions.width.value)"
      :height="toSize(playgroundActions.height.value)"
      :aspect-ratio="toNumber(playgroundActions.aspectRatio.value)"
      :cover="playgroundActions.cover.value"
      data-testid="img-preview"
    />
  </u-column>
</u-row>
</playground>

## Ver também

Consulte a referência de [API do UImg](../../api/components/img) para a lista completa de props.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UColumn, UImg, URow } from "../../../dist/components.js"

  function toNumber(value: string) {
    return Number(value) || undefined;
  }

  function toSize(value: string) {
    return toNumber(value) ?? (value || undefined);
  }

  const playgroundActions = ref({
    src: {
      type: "combobox",
      label: "Imagem",
      value: "/uimed-vue/favicon.svg",
      dataTestid: "img-playground-src",
      items: [
        { label: "Logo (SVG)", value: "/uimed-vue/favicon.svg" },
        { label: "Foto (JPG)", value: "/uimed-vue/avatar.jpg" },
      ]
    },
    width: {
      type: "text",
      label: "Largura (px, ou com unidade, ex.: 50%)",
      value: "94",
      dataTestid: "img-playground-width"
    },
    height: {
      type: "text",
      label: "Altura (px, ou com unidade, ex.: 10rem)",
      value: "120",
      dataTestid: "img-playground-height"
    },
    aspectRatio: {
      type: "text",
      label: "Proporção (largura ÷ altura, ex.: 1.5)",
      value: "",
      dataTestid: "img-playground-aspect-ratio"
    },
    cover: {
      type: "checkbox",
      value: false,
      label: "Preencher",
      dataTestid: "img-playground-cover"
    },
  });
</script>
