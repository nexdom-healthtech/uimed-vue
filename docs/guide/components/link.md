---
outline: deep
---

# Links

O componente padrão para exibir links de texto se chama `Link`.

O texto do link é informado pelo slot padrão e também é o nome lido pelos leitores de tela. Por isso, ele deve descrever o destino do link (por exemplo, "Esqueceu sua senha?" em vez de "Clique aqui").

Use o link para links avulsos, como um "Esqueceu sua senha?" abaixo de um formulário de login. Ele não é sublinhado, então não o use no meio de um parágrafo de texto, onde só a cor o distinguiria do texto ao redor. Para executar ações, use o [Button](./button).

## Propriedades

### Rota da aplicação

A prop `route` define o destino do link. Uma rota da aplicação, como `"/login"` ou `{ name: "forgot-password" }`, navega sem recarregar a página. Enquanto essa rota é a página atual, o link é anunciado como a página atual pelos leitores de tela.

> [!Warning]
> Rotas da aplicação só funcionam em aplicações que usam o [Vue Router](https://router.vuejs.org/).

<demo>
<u-link route="/esqueci-minha-senha" data-testid="demo-link-route">Esqueceu sua senha?</u-link>
</demo>

```vue
<template>
  <u-link :route="{ name: 'forgot-password' }">Esqueceu sua senha?</u-link>
</template>

<script lang="ts" setup>
import { ULink } from "@nexdom/uimed-vue/components";
</script>
```

### Endereço externo

Um endereço que começa com `http` navega pelo navegador, na mesma aba, sem passar pelas rotas da aplicação.

<demo>
<u-link route="https://nexdom-healthtech.github.io/shared/" data-testid="demo-link-external">Documentação do Shared</u-link>
</demo>

```vue
<template>
  <u-link route="https://nexdom-healthtech.github.io/shared/">Documentação do Shared</u-link>
</template>

<script lang="ts" setup>
import { ULink } from "@nexdom/uimed-vue/components";
</script>
```

## Ver também

Consulte a referência de [API do ULink](../../api/components/link) para a lista completa de props.

<script lang="ts" setup>
  import { ULink } from "../../../dist/components.js"
</script>
