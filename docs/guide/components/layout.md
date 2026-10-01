---
outline: deep
---

# Componentes para layout

O layout do UIMed-Vue é baseado no [Grid system do Bootstrap](https://getbootstrap.com/docs/4.0/layout/grid/), dividindo cada linha em 12 colunas.

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
<u-main>
  <u-container>
    <u-row>
      <u-column cols="auto">
        <div style="background: lightgreen;">
          <p>Linha 1 / Coluna 1</p>
          <p><small>Tamanho <code>"auto"</code></small></p>
        </div>
      </u-column>
      <u-column>
        <div style="background: lightgreen;">
          <p>Linha 2 / Coluna 1</p>
          <p><small>Tamanho <code>"default"</code> (<code>"12"</code>)</small></p>
        </div>
      </u-column>
    </u-row>
    <u-row>
      <u-column cols="6">
        <div style="background: lightgreen;">
          <p>Linha 3 / Coluna 1</p>
          <p><small>Tamanho <code>"6"</code></small></p>
        </div>
      </u-column>
      <u-column cols="6">
        <div style="background: lightgreen;">
          <p>Linha 3 / Coluna 2</p>
          <p><small>Tamanho <code>"6"</code></small></p>
        </div>
      </u-column>
    </u-row>
    <u-row>
      <u-column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 1</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 2</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen;">
          <p>Linha 4 / Coluna 3</p>
          <p><small>Tamanho <code>"4"</code></small></p>
        </div>
      </u-column>
    </u-row>
  </u-container>
</u-main>
</demo>

```vue
<template>
  <u-main>
    <u-container>
      <u-row>
        <u-column cols="auto">
          <div style="background: lightgreen;">
            <p>Linha 1 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"auto"</code></small>
            </p>
          </div>
        </u-column>
        <u-column>
          <div style="background: lightgreen;">
            <p>Linha 2 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"default"</code> (<code>"12"</code>)</small>
            </p>
          </div>
        </u-column>
      </u-row>
      <u-row>
        <u-column cols="6">
          <div style="background: lightgreen;">
            <p>Linha 3 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"6"</code></small>
            </p>
          </div>
        </u-column>
        <u-column cols="6">
          <div style="background: lightgreen;">
            <p>Linha 3 / Coluna 2</p>
            <p>
              <small>Tamanho <code>"6"</code></small>
            </p>
          </div>
        </u-column>
      </u-row>
      <u-row>
        <u-column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 1</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 2</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen;">
            <p>Linha 4 / Coluna 3</p>
            <p>
              <small>Tamanho <code>"4"</code></small>
            </p>
          </div>
        </u-column>
      </u-row>
    </u-container>
  </u-main>
</template>

<script lang="ts" setup>
import { UContainer, UMain, URow, UColumn } from "@nexdom/uimed-vue/components";
</script>
```

## Linhas e colunas como lista

Quando as colunas de uma linha apresentam itens de uma mesma lista, como os cartões de uma listagem de pacientes, utilize a prop `list` na `Row` e a prop `listItem` em cada uma das suas `Column`s.

Assim, a linha passa a ser uma lista e as colunas, os seus itens, e as tecnologias assistivas, como leitores de tela, anunciam a quantidade de itens e a posição de cada um deles. A aparência da grade não muda: a lista não recebe recuo nem marcadores.

<demo>
<u-main>
  <u-container>
    <u-row list data-testid="demo-layout-list">
      <u-column v-for="especialidade in especialidades" :key="especialidade" cols="4" list-item>
        <div style="background: lightgreen;">
          <p>{{ especialidade }}</p>
        </div>
      </u-column>
    </u-row>
  </u-container>
</u-main>
</demo>

```vue
<template>
  <u-main>
    <u-container>
      <u-row list>
        <u-column v-for="especialidade in especialidades" :key="especialidade" cols="4" list-item>
          <div style="background: lightgreen;">
            <p>{{ especialidade }}</p>
          </div>
        </u-column>
      </u-row>
    </u-container>
  </u-main>
</template>

<script lang="ts" setup>
import { UContainer, UMain, URow, UColumn } from "@nexdom/uimed-vue/components";

const especialidades = ["Cardiologia", "Dermatologia", "Pediatria"];
</script>
```

## Alinhamento vertical das colunas

A prop `align` da `Row` define como as suas colunas se alinham verticalmente em relação à coluna mais alta da mesma linha:

| Valor       | Alinhamento                                               |
| ----------- | --------------------------------------------------------- |
| `"start"`   | no topo (padrão).                                         |
| `"center"`  | ao centro.                                                |
| `"end"`     | na base.                                                  |
| `"stretch"` | estica todas as colunas até a altura da coluna mais alta. |

Com `stretch`, é a coluna que cresce até a altura da mais alta: o seu conteúdo só a preenche visualmente quando também ocupa a altura toda, como as caixas do exemplo abaixo ou um [`USection`](./section) com `fullHeight`. Por isso, utilize `stretch` para manter colunas lado a lado com a mesma altura, como cartões.

::: info
As colunas só ficam lado a lado em telas a partir de 600px de largura. Em telas menores, cada coluna ocupa uma linha inteira e o alinhamento não tem efeito visível.
:::

<demo>
<u-main>
  <u-container>
    <u-row align="start" data-testid="demo-layout-align-start">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align="start"</code>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna mais alta<br />com<br />quatro<br />linhas
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna com<br />duas linhas
        </div>
      </u-column>
    </u-row>
    <u-row align="center" data-testid="demo-layout-align-center">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align="center"</code>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna mais alta<br />com<br />quatro<br />linhas
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna com<br />duas linhas
        </div>
      </u-column>
    </u-row>
    <u-row align="end" data-testid="demo-layout-align-end">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align="end"</code>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna mais alta<br />com<br />quatro<br />linhas
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna com<br />duas linhas
        </div>
      </u-column>
    </u-row>
    <u-row align="stretch" data-testid="demo-layout-align-stretch">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align="stretch"</code>
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna mais alta<br />com<br />quatro<br />linhas
        </div>
      </u-column>
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          Coluna com<br />duas linhas
        </div>
      </u-column>
    </u-row>
  </u-container>
</u-main>
</demo>

```vue
<template>
  <u-main>
    <u-container>
      <u-row align="start">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align="start"</code>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            Coluna mais alta<br />com<br />quatro<br />linhas
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">Coluna com<br />duas linhas</div>
        </u-column>
      </u-row>
      <u-row align="center">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align="center"</code>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            Coluna mais alta<br />com<br />quatro<br />linhas
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">Coluna com<br />duas linhas</div>
        </u-column>
      </u-row>
      <u-row align="end">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align="end"</code>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            Coluna mais alta<br />com<br />quatro<br />linhas
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">Coluna com<br />duas linhas</div>
        </u-column>
      </u-row>
      <u-row align="stretch">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align="stretch"</code>
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            Coluna mais alta<br />com<br />quatro<br />linhas
          </div>
        </u-column>
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">Coluna com<br />duas linhas</div>
        </u-column>
      </u-row>
    </u-container>
  </u-main>
</template>

<script lang="ts" setup>
import { UContainer, UMain, URow, UColumn } from "@nexdom/uimed-vue/components";
</script>
```

### Playground

Experimente os valores da prop `align`.

<playground v-model:actions="playgroundActions">
<u-container>
  <u-row :align="playgroundActions.align.value" data-testid="layout-preview">
    <u-column cols="4">
      <div style="background: lightgreen; height: 100%;">
        Coluna 1
      </div>
    </u-column>
    <u-column cols="4">
      <div style="background: lightgreen; height: 100%;">
        Coluna 2<br />mais<br />alta
      </div>
    </u-column>
    <u-column cols="4">
      <div style="background: lightgreen; height: 100%;">
        Coluna 3<br />média
      </div>
    </u-column>
  </u-row>
</u-container>
</playground>

## Ver também

Consulte a referência de [API do UContainer](../../api/components/grid/container), [da URow](../../api/components/grid/row) e [da UColumn](../../api/components/grid/column) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UContainer, UMain, URow, UColumn } from "../../../dist/components.js"

  type RowProps = ComponentProps<typeof URow>

  const especialidades = ["Cardiologia", "Dermatologia", "Pediatria"];

  const playgroundAlignOptions: Array<NonNullable<RowProps["align"]>> = ["start", "center", "end", "stretch"];

  const playgroundActions = ref({
    align: {
      type: "combobox",
      label: "Alinhamento",
      value: playgroundAlignOptions[0],
      dataTestid: "layout-playground-align",
      items: playgroundAlignOptions
    },
  });
</script>
