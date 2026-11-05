# UDetails

Componente para agrupar itens ([`UDetailsItem`](./details-item)) cujo conteúdo é expandido e recolhido ao clicar no título, em um acordeão.
Os itens iniciam recolhidos, e apenas um fica expandido por vez.

## Props

| Prop         | Tipo                       | Padrão      | Descrição                                                               |
| ------------ | -------------------------- | ----------- | ----------------------------------------------------------------------- |
| `variant`    | `"primary" \| "secondary"` | `"primary"` | Aplica uma variação de estilo distinta a todos os itens.                |
| `loading`    | `boolean`                  | `false`     | Exibe um skeleton loader no lugar dos itens enquanto os dados carregam. |
| `dataTestid` | `string`                   |             | Id do componente para uso em testes automatizados.                      |

## Slots

| Slot      | Descrição                                                       |
| --------- | --------------------------------------------------------------- |
| `default` | Itens do acordeão, cada um um [`UDetailsItem`](./details-item). |

## Exemplo

```vue
<template>
  <u-details variant="secondary">
    <u-details-item title="Mais informações">
      <p>Conteúdo exibido ao expandir.</p>
    </u-details-item>
    <u-details-item title="Outras informações">
      <p>Outro conteúdo.</p>
    </u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```
