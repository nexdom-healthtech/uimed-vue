# Column

Componente para colunas das linhas do grid system.

Deve ser colocado exclusivamente dentro de [componentes de linha](./row).

## Props

| Prop         | Tipo                                                                                                                    | Padrão | Descrição                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cols`       | `"auto"` \| `"1"` \| `"2"` \| `"3"` \| `"4"` \| `"5"` \| `"6"` \| `"7"` \| `"8"` \| `"9"` \| `"10"` \| `"11"` \| `"12"` | `"12"` | Número de colunas para esticar o componente, sendo `1` o tamanho mínimo, `12` o tamanho máximo e `auto` a única opção que não tentará esticá-lo. |
| `dataTestid` | `string`                                                                                                                |        | Aplica atributo `data-testid` para testes sobre o componente.                                                                                    |

## Slots

| Slot      | Descrição                                    |
| --------- | -------------------------------------------- |
| `default` | Conteúdo a ser exibido dentro do componente. |

## Exemplo

```vue
<template>
  <container>
    <row>
      <column cols="6"><!-- ... --></column>
      <column cols="6"><!-- ... --></column>
    </row>
    <row>
      <column cols="4"><!-- ... --></column>
      <column cols="4"><!-- ... --></column>
      <column cols="4"><!-- ... --></column>
    </row>
  </container>
</template>

<script lang="ts" setup>
import { Container, Row, Column } from "@nexdom/uimed-vue/components";
</script>
```
