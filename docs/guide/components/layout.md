---
outline: deep
---

# Componentes para layout

O layout do uimed-vue é baseado no [Grid system do Bootstrap](https://getbootstrap.com/docs/4.0/layout/grid/), dividindo cada linha em 12 colunas.

Os componentes que implementam esse _grid system_ são:

| Componente  | Descrição                                                                             |
| ----------- | ------------------------------------------------------------------------------------- |
| `Container` | componente central que agrupa diversas linhas.                                        |
| `Row`       | componente secundário, para linhas, que agrupa diversas colunas.                      |
| `Column`    | componente secundário, para colunas, que gerencia o conteúdo final a ser apresentado. |

## Container, Linhas e colunas

O `Container` encapsula diversas linhas, chamadas de `Row`, e esta agrupa diversas colunas, chamadas de `Column`.

Cada coluna é capaz de ajustar o seu próprio tamanho para ocupar um determinado número de colunas, dentre as 12 disponíveis na linha inteira.

### Uso

<demo>
<root>
  <container>
    <row>
      <column cols="auto">
        <div style="background: lightgreen;">
          <p>Linha 1 / Coluna 1</p>
          <p><small>Tamanho <code>"auto"</code></small></p>
        </div>
      </column>
      <column>
        <div style="background: lightgreen;">
          <p>Linha 2 / Coluna 1</p>
          <p><small>Tamanho <code>"default"</code> (<code>"12"</code>)</small></p>
        </div>
      </column>
    </row>
    <row>
      <column cols="6">
        <div style="background: lightgreen;">
          <p>Linha 3 / Coluna 1</p>
          <p><small>Tamanho <code>"6"</code></small></p>
        </div>
      </column>
      <column cols="6">
        <div style="background: lightgreen;">
          <p>Linha 3 / Coluna 2</p>
          <p><small>Tamanho <code>"6"</code></small></p>
        </div>
      </column>
    </row>
    <row>
      <column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 1</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </column>
      <column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 2</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </column>
      <column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 3</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </column>
    </row>
  </container>
</root>
</demo>

```vue
<template>
  <root>
    <container>
      <row>
        <column cols="auto">
          <div style="background: lightgreen;">
            <p>Linha 1 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"auto"</code></small>
            </p>
          </div>
        </column>
        <column>
          <div style="background: lightgreen;">
            <p>Linha 2 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"default"</code> (<code>"12"</code>)</small>
            </p>
          </div>
        </column>
      </row>
      <row>
        <column cols="6">
          <div style="background: lightgreen;">
            <p>Linha 3 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"6"</code></small>
            </p>
          </div>
        </column>
        <column cols="6">
          <div style="background: lightgreen;">
            <p>Linha 3 / Coluna 2</p>
            <p>
              <small>Tamanho <code>"6"</code></small>
            </p>
          </div>
        </column>
      </row>
      <row>
        <column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </column>
        <column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 2</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </column>
        <column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 3</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </column>
      </row>
    </container>
  </root>
</template>

<script lang="ts" setup>
import { Container, Root, Row, Column } from "@nexdom/uimed-vue/components";
</script>
```

## Ver também

Consulte a referência de [API do Container](../../api/components/grid/container), [da Row](../../api/components/grid/row) e [da Column](../../api/components/grid/column) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { Container, Root, Row, Column } from "../../../dist/components.js"
</script>
