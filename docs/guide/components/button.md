# Button

Componente utilizado como abstração do botão.
Deve ser utilizado ao invés do `<button>` nativo.

## Uso

::: raw
<btn>
Me clique
</btn>
:::

```vue
<template>
  <btn> Me clique </btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Variantes

A prop `type` define a variação de estilo aplicada ao botão. O padrão é `elevated`.

::: raw
<div class="btn-demo-row">
  <btn type="elevated">Elevated</btn>
  <btn type="flat">Flat</btn>
  <btn type="outlined">Outlined</btn>
  <btn type="plain">Plain</btn>
  <btn type="text">Text</btn>
  <btn type="tonal">Tonal</btn>
</div>
:::

```vue
<template>
  <btn type="elevated">Elevated</btn>
  <btn type="flat">Flat</btn>
  <btn type="outlined">Outlined</btn>
  <btn type="plain">Plain</btn>
  <btn type="text">Text</btn>
  <btn type="tonal">Tonal</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Cores

A prop `color` aceita qualquer cor da paleta do tema ou um valor CSS válido (hexadecimal, `rgb()`, etc.).

::: raw
<div class="btn-demo-row">
  <btn color="primary">Primary</btn>
  <btn color="secondary">Secondary</btn>
  <btn color="success">Success</btn>
  <btn color="error">Error</btn>
  <btn color="warning">Warning</btn>
  <btn color="info">Info</btn>
</div>
:::

```vue
<template>
  <btn color="primary">Primary</btn>
  <btn color="secondary">Secondary</btn>
  <btn color="success">Success</btn>
  <btn color="error">Error</btn>
  <btn color="warning">Warning</btn>
  <btn color="info">Info</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

Também é possível utilizar uma cor customizada, informando diretamente um valor CSS:

::: raw
<div class="btn-demo-row">
  <btn color="#004f51">Cor customizada</btn>
</div>
:::

```vue
<template>
  <btn color="#004f51">Cor customizada</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Estados

### Desabilitado

Utilize a prop `disabled` para remover a possibilidade de clicar ou focar no botão.

::: raw
<div class="btn-demo-row">
  <btn disabled>Desabilitado</btn>
</div>
:::

```vue
<template>
  <btn disabled>Desabilitado</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um indicador de carregamento e desabilita a interação com o botão enquanto ativa.

::: raw
<div class="btn-demo-row">
  <btn loading>Carregando</btn>
</div>
:::

```vue
<template>
  <btn loading>Carregando</btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Slots

### Loader customizado

Utilize o slot `loader` para substituir o indicador de carregamento padrão exibido enquanto a prop `loading` está ativa.

::: raw
<div class="btn-demo-row">
  <btn loading>
    Enviando
    <template #loader>
      <span>Enviando…</span>
    </template>
  </btn>
</div>
:::

```vue
<template>
  <btn loading>
    Enviando
    <template #loader>
      <span>Enviando…</span>
    </template>
  </btn>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>
```

## Posicionamento

A prop `position` define a propriedade CSS `position` do botão, sendo útil, por exemplo, para fixar um botão de ação em um canto de um card.

::: warning
O componente não repassa atributos arbitrários (como `style` ou `class`) para o elemento raiz. Para definir deslocamentos como `top`/`right` junto de `position="absolute"` ou `"fixed"`, direcione o botão renderizado via CSS a partir de um seletor no elemento pai, como no exemplo abaixo. Apenas os valores `absolute` e `fixed` têm efeito visual.
:::

::: raw
<div class="btn-demo-card">
  <p>Conteúdo do card.</p>
  <btn position="absolute" color="secondary">Ação</btn>
</div>
:::

```vue
<template>
  <div class="card">
    <p>Conteúdo do card.</p>
    <btn position="absolute" color="secondary">Ação</btn>
  </div>
</template>

<script lang="ts" setup>
import { Button as Btn } from "@nexdom/uimed-vue/components";
</script>

<style scoped>
.card {
  position: relative;
}

.card :deep(.v-btn) {
  top: 12px;
  right: 12px;
}
</style>
```

## Eventos

O evento `click` é emitido ao clicar no botão, repassando o `MouseEvent` nativo. Ele não é disparado quando o botão está `disabled`.

::: raw
<div class="btn-demo-row">
  <btn @click="onClick">Me clique</btn>
  <span>{{ clicks }} clique(s)</span>
</div>
:::

<script lang="ts" setup>
  import { ref } from "vue"
  import { Button as Btn } from "../../../dist/components.js"

  const clicks = ref(0)

  function onClick() {
    clicks.value++
  }
</script>

```vue
<template>
  <btn @click="onClick">Me clique</btn>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Button as Btn } from "@nexdom/uimed-vue/components";

const clicks = ref(0);

function onClick() {
  clicks.value++;
}
</script>
```

## Ver também

Consulte a [referência de API do Button](../../api/components/button.md) para a lista completa de props, slots e eventos.

<style scoped>
.btn-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.btn-demo-card {
  position: relative;
  padding: 16px;
  min-height: 96px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.btn-demo-card p {
  margin: 0;
  max-width: 75%;
}

.btn-demo-card :deep(.v-btn) {
  top: 12px;
  right: 12px;
}
</style>
