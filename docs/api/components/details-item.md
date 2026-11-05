# UDetailsItem

Item de um [`UDetails`](./details), com um título que expande ou recolhe o seu conteúdo ao ser clicado.

Deve ser colocado exclusivamente dentro de um [`UDetails`](./details).

## Props

| Prop         | Tipo     | Padrão | Descrição                                                                                                  |
| ------------ | -------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `title`      | `string` |        | Título exibido no cabeçalho do item. Ao clicar, expande ou recolhe o conteúdo, mesmo quando não há título. |
| `dataTestid` | `string` |        | Id do componente para uso em testes automatizados.                                                         |

## Slots

| Slot      | Descrição                                   |
| --------- | ------------------------------------------- |
| `default` | Conteúdo exibido quando o item é expandido. |

## Exemplo

```vue
<template>
  <u-details>
    <u-details-item title="Mais informações">
      <p>Conteúdo exibido ao expandir.</p>
    </u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```
