# URow

Componente para linhas do grid system.

Deve ser colocado exclusivamente dentro de [componentes de container](./container).

## Props

| Prop         | Tipo                                              | Padrão    | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `align`      | `"start"` \| `"center"` \| `"end"` \| `"stretch"` | `"start"` | Alinhamento vertical das colunas em relação à coluna mais alta da mesma linha: no topo (`start`), ao centro (`center`), na base (`end`) ou esticadas até a altura da coluna mais alta (`stretch`). Utilize `stretch` para manter colunas lado a lado com a mesma altura, como cartões feitos com [`USection`](../sections/section) com `fullHeight`. Só tem efeito visível em telas a partir de 600px de largura, onde as colunas ficam lado a lado. |
| `list`       | `boolean`                                         | `false`   | Apresenta a linha como uma lista, sem recuo nem marcadores, para que tecnologias assistivas anunciem as suas colunas como itens. Utilize-a quando as colunas forem itens de uma mesma lista, junto da prop `listItem` em cada [`UColumn`](./column).                                                                                                                                                                                                 |
| `dataTestid` | `string`                                          |           | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                                                                                                                                                                                                                                                        |

## Slots

| Slot      | Descrição                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `default` | Conteúdo a ser exibido dentro do componente. A raiz do mesmo deve conter apenas componentes [`UColumn`](./column). |

## Exemplo

```vue
<template>
  <u-container>
    <u-row align="center">
      <!-- ... -->
    </u-row>
  </u-container>
</template>

<script lang="ts" setup>
import { UContainer, URow } from "@nexdom/uimed-vue/components";
</script>
```
