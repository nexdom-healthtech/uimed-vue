# UDetails

Componente para exibir conteúdo que pode ser expandido e recolhido ao clicar no título.
Inicia recolhido.

## Props

| Prop         | Tipo                       | Padrão      | Descrição                                                              |
| ------------ | -------------------------- | ----------- | ---------------------------------------------------------------------- |
| `variant`    | `"primary" \| "secondary"` | `"primary"` | Aplica uma variação de estilo distinta ao conteúdo expansível.         |
| `title`      | `string`                   |             | Título exibido no cabeçalho. Ao clicar, expande ou recolhe o conteúdo. |
| `loading`    | `boolean`                  | `false`     | Coloca o conteúdo expansível em estado de carregamento.                |
| `dataTestid` | `string`                   |             | Id do componente para uso em testes automatizados.                     |

## Slots

| Slot      | Descrição                                   |
| --------- | ------------------------------------------- |
| `default` | Conteúdo exibido quando o item é expandido. |

## Exemplo

```vue
<template>
  <u-details title="Mais informações" variant="secondary">
    <p>Conteúdo exibido ao expandir.</p>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```
