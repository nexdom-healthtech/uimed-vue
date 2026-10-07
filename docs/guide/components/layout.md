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

A prop `alignY` (`align-y` no template) da `Row` define como as suas colunas se alinham verticalmente em relação à coluna mais alta da mesma linha:

| Valor       | Alinhamento                                               |
| ----------- | --------------------------------------------------------- |
| `"start"`   | no topo (padrão).                                         |
| `"center"`  | ao centro.                                                |
| `"end"`     | na base.                                                  |
| `"stretch"` | estica todas as colunas até a altura da coluna mais alta. |

Com `stretch`, é a coluna que cresce até a altura da mais alta: o seu conteúdo só a preenche visualmente quando também ocupa a altura toda, como as caixas do exemplo abaixo ou um [`USection`](./section) com `fullHeight`. Por isso, utilize `stretch` para manter colunas lado a lado com a mesma altura, como cartões.

::: info
As colunas só ficam lado a lado em telas a partir de 600px de largura. Em telas menores, cada coluna ocupa uma linha inteira e o alinhamento não tem efeito visível, exceto em [linhas com altura total](#altura-total), em que as colunas são alinhadas, em conjunto, dentro da altura da linha.
:::

<demo>
<u-main>
  <u-container>
    <u-row align-y="start" data-testid="demo-layout-align-y-start">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align-y="start"</code>
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
    <u-row align-y="center" data-testid="demo-layout-align-y-center">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align-y="center"</code>
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
    <u-row align-y="end" data-testid="demo-layout-align-y-end">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align-y="end"</code>
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
    <u-row align-y="stretch" data-testid="demo-layout-align-y-stretch">
      <u-column cols="4">
        <div style="background: lightgreen; height: 100%;">
          <code>align-y="stretch"</code>
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
      <u-row align-y="start">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align-y="start"</code>
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
      <u-row align-y="center">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align-y="center"</code>
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
      <u-row align-y="end">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align-y="end"</code>
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
      <u-row align-y="stretch">
        <u-column cols="4">
          <div style="background: lightgreen; height: 100%;">
            <code>align-y="stretch"</code>
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

## Alinhamento horizontal das colunas

A prop `alignX` (`align-x` no template) da `Row` define como as suas colunas se alinham horizontalmente em cada linha:

| Valor      | Alinhamento                  |
| ---------- | ---------------------------- |
| `"start"`  | no início da linha (padrão). |
| `"center"` | ao centro.                   |
| `"end"`    | no fim da linha.             |

O alinhamento só tem efeito visível quando as colunas não preenchem a linha toda, como com `cols="auto"`, em que a coluna ocupa apenas a largura do seu conteúdo, ou com tamanhos que somam menos de 12. Quando as colunas não cabem em uma linha e passam para a seguinte, cada linha é alinhada separadamente.

::: info
As colunas só ficam lado a lado em telas a partir de 600px de largura. Em telas menores, cada coluna ocupa uma linha inteira, mesmo com `cols="auto"`, e o alinhamento não tem efeito visível.

`start` e `end` acompanham a direção do texto: em idiomas escritos da direita para a esquerda, `start` fica à direita e `end`, à esquerda.
:::

<demo>
<u-main>
  <u-container>
    <u-row align-x="start" data-testid="demo-layout-align-x-start">
      <u-column cols="auto">
        <div style="background: lightgreen;">
          <code>align-x="start"</code>
        </div>
      </u-column>
    </u-row>
    <u-row align-x="center" data-testid="demo-layout-align-x-center">
      <u-column cols="auto">
        <div style="background: lightgreen;">
          <code>align-x="center"</code>
        </div>
      </u-column>
    </u-row>
    <u-row align-x="end" data-testid="demo-layout-align-x-end">
      <u-column cols="auto">
        <div style="background: lightgreen;">
          <code>align-x="end"</code>
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
      <u-row align-x="start">
        <u-column cols="auto">
          <div style="background: lightgreen;">
            <code>align-x="start"</code>
          </div>
        </u-column>
      </u-row>
      <u-row align-x="center">
        <u-column cols="auto">
          <div style="background: lightgreen;">
            <code>align-x="center"</code>
          </div>
        </u-column>
      </u-row>
      <u-row align-x="end">
        <u-column cols="auto">
          <div style="background: lightgreen;">
            <code>align-x="end"</code>
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

Com uma coluna `cols="auto"` e `align-x="center"`, por exemplo, o formulário de uma tela de login fica centralizado na linha, sem estilos próprios (para centralizá-lo também na altura da tela, veja [Altura total](#altura-total)):

```vue
<template>
  <u-row align-x="center">
    <u-column cols="auto">
      <u-section title="Entrar">
        <!-- formulário -->
      </u-section>
    </u-column>
  </u-row>
</template>

<script lang="ts" setup>
import { URow, UColumn, USection } from "@nexdom/uimed-vue/components";
</script>
```

## Altura total

Por padrão, uma `Row` cresce apenas até a altura do seu conteúdo. Com a prop `fullHeight` (`full-height` no template), ela ocupa toda a altura visível da área de conteúdo do [`UMain`](./main), descontado o menu superior, quando houver.

Combinada às props `alignY` e `alignX`, a linha posiciona as suas colunas nessa altura. Com `align-y="center"` e `align-x="center"`, por exemplo, o formulário de uma tela de login fica centralizado na tela, nos dois eixos:

<demo contained>
<u-main :app-bar="{ title: 'Acesso' }">
  <u-row full-height align-y="center" align-x="center" data-testid="demo-layout-full-height">
    <u-column cols="auto">
      <u-section title="Entrar" subtitle="Informe os seus dados de acesso" :actions="demoLoginActions">
        <u-section-content>Conteúdo do formulário</u-section-content>
      </u-section>
    </u-column>
  </u-row>
</u-main>
</demo>

```vue
<template>
  <u-main :app-bar="{ title: 'Acesso' }">
    <u-row full-height align-y="center" align-x="center">
      <u-column cols="auto">
        <u-section title="Entrar" subtitle="Informe os seus dados de acesso" :actions>
          <u-section-content>
            <!-- formulário -->
          </u-section-content>
        </u-section>
      </u-column>
    </u-row>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain, URow, UColumn, USection, USectionContent } from "@nexdom/uimed-vue/components";

type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];

const actions: SectionAction[] = [{ label: "Entrar", onClick: () => window.alert("Entrando...") }];
</script>
```

Em telas com menos de 600px de largura, em que cada coluna ocupa uma linha inteira, as colunas continuam alinhadas, em conjunto, conforme a prop `alignY`.

::: warning
A linha com `fullHeight` ocupa sozinha toda a altura disponível: outras linhas ao seu lado ficam abaixo da área visível. Por isso, utilize-a como a única linha da página.
:::

Para que um [`UContainer`](../../api/components/grid/container) dentro do `UMain` também ocupe toda a altura disponível, e as suas linhas com `fullHeight` possam ocupá-la, utilize a prop `fullHeight` também no `UContainer`.

## Playground

Experimente os valores das props `alignY` e `alignX`.

<playground v-model:actions="playgroundActions">
<u-container>
  <u-row :align-y="playgroundActions.alignY.value" :align-x="playgroundActions.alignX.value" data-testid="layout-preview">
    <u-column cols="3">
      <div style="background: lightgreen; height: 100%;">
        Coluna 1
      </div>
    </u-column>
    <u-column cols="3">
      <div style="background: lightgreen; height: 100%;">
        Coluna 2<br />mais<br />alta
      </div>
    </u-column>
    <u-column cols="3">
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
  import { UContainer, UMain, URow, UColumn, USection, USectionContent } from "../../../dist/components.js"

  type RowProps = ComponentProps<typeof URow>

  const especialidades = ["Cardiologia", "Dermatologia", "Pediatria"];

  const demoLoginActions = [{ label: "Entrar", onClick: () => window.alert("Entrando...") }];

  const playgroundAlignYOptions: Array<NonNullable<RowProps["alignY"]>> = ["start", "center", "end", "stretch"];
  const playgroundAlignXOptions: Array<NonNullable<RowProps["alignX"]>> = ["start", "center", "end"];

  const playgroundActions = ref({
    alignY: {
      type: "combobox",
      label: "Alinhamento vertical",
      value: playgroundAlignYOptions[0],
      dataTestid: "layout-playground-align-y",
      items: playgroundAlignYOptions
    },
    alignX: {
      type: "combobox",
      label: "Alinhamento horizontal",
      value: playgroundAlignXOptions[0],
      dataTestid: "layout-playground-align-x",
      items: playgroundAlignXOptions
    },
  });
</script>
