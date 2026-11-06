---
outline: deep
---

# Abas

Para organizar conteúdo em abas, são usados três componentes: `Tabs`, a linha de abas; `TabsContent`, que exibe o conteúdo da aba selecionada; e `TabsItem`, o conteúdo de cada aba.

## Uso

O `UTabs` recebe na prop `items` a lista de abas, cada uma com um `title`, o texto exibido na aba, e um `value` opcional. Logo depois dele vem o `UTabsContent`, com um `UTabsItem` para cada aba, de mesmo `value`.

O `UTabs` e o `UTabsContent` compartilham o mesmo `v-model`, que recebe o `value` da aba selecionada: é ele que liga cada aba ao seu conteúdo. Por isso:

- use a mesma variável no `v-model` dos dois componentes;
- os valores das abas devem ser únicos, e o `value` de cada `UTabsItem` deve coincidir com o da sua aba;
- coloque o `UTabsContent` logo depois do `UTabs`.

Quando o `v-model` está vazio, a primeira aba é selecionada, e o `v-model` recebe o seu valor.

<demo col>
<u-tabs v-model="basicTab" :items="basicItems" data-testid="demo-tabs-basic" />
<u-tabs-content v-model="basicTab" data-testid="demo-tabs-basic-content">
  <u-tabs-item value="dados">Nome, data de nascimento e documentos</u-tabs-item>
  <u-tabs-item value="endereco">Rua, número, bairro e CEP</u-tabs-item>
  <u-tabs-item value="contato">Telefone e e-mail</u-tabs-item>
</u-tabs-content>
<span data-testid="demo-tabs-basic-value">Aba selecionada: {{ basicTab }}</span>
</demo>

```vue
<template>
  <u-tabs v-model="tab" :items />
  <u-tabs-content v-model="tab">
    <u-tabs-item value="dados">Nome, data de nascimento e documentos</u-tabs-item>
    <u-tabs-item value="endereco">Rua, número, bairro e CEP</u-tabs-item>
    <u-tabs-item value="contato">Telefone e e-mail</u-tabs-item>
  </u-tabs-content>
  Aba selecionada: {{ tab }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UTabs, UTabsContent, UTabsItem } from "@nexdom/uimed-vue/components";

const tab = ref<string | number>();
const items = [
  { title: "Dados pessoais", value: "dados" },
  { title: "Endereço", value: "endereco" },
  { title: "Contato", value: "contato" },
];
</script>
```

## Teclado

As abas seguem o padrão de navegação por teclado das abas na web:

- com o foco em uma aba, as setas para a esquerda e para a direita movem o foco para a aba anterior e a próxima, voltando ao início depois da última;
- <kbd>Home</kbd> e <kbd>End</kbd> movem o foco para a primeira e a última aba;
- mover o foco não troca a aba selecionada: <kbd>Enter</kbd> ou <kbd>Espaço</kbd> selecionam a aba com foco.

## Conteúdo sob demanda

O conteúdo de cada aba só é montado quando a aba é aberta pela primeira vez. Depois disso, ele continua montado, apenas escondido, ao trocar de aba, mantendo o que o usuário preencheu.

> [!Warning]
> Em um formulário dividido em abas, os campos das abas que nunca foram abertas não estão montados e, por isso, não são validados.

## Abas sem `value`

O `value` é opcional. Sem ele, cada aba recebe a sua posição, a partir de `0`, e é ligada ao `UTabsItem` da mesma posição, que também fica sem `value`. Nesse caso, o `v-model` recebe a posição da aba selecionada. Use `value` em todas as abas ou em nenhuma.

<demo col>
<u-tabs v-model="indexTab" :items="indexItems" data-testid="demo-tabs-index" />
<u-tabs-content v-model="indexTab" data-testid="demo-tabs-index-content">
  <u-tabs-item>Consultas agendadas para os próximos dias</u-tabs-item>
  <u-tabs-item>Consultas já realizadas</u-tabs-item>
</u-tabs-content>
<span data-testid="demo-tabs-index-value">Aba selecionada: {{ indexTab }}</span>
</demo>

```vue
<template>
  <u-tabs v-model="tab" :items />
  <u-tabs-content v-model="tab">
    <u-tabs-item>Consultas agendadas para os próximos dias</u-tabs-item>
    <u-tabs-item>Consultas já realizadas</u-tabs-item>
  </u-tabs-content>
  Aba selecionada: {{ tab }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UTabs, UTabsContent, UTabsItem } from "@nexdom/uimed-vue/components";

const tab = ref<string | number>();
const items = [{ title: "Próximas" }, { title: "Realizadas" }];
</script>
```

## Muitas abas

Quando as abas não cabem na largura disponível, elas podem ser roladas para os lados. Em telas a partir de 1145px de largura, setas nas laterais da linha de abas também as rolam; em telas menores, as setas não aparecem.

<demo col>
<u-section title="Consultas por mês" full-width>
<u-tabs v-model="monthTab" :items="months" data-testid="demo-tabs-many" />
<u-tabs-content v-model="monthTab" data-testid="demo-tabs-many-content">
  <u-tabs-item v-for="month in months" :key="month.value" :value="month.value"><u-section-content>Consultas de {{ month.title }}</u-section-content></u-tabs-item>
</u-tabs-content>
</u-section>
</demo>

```vue
<template>
  <u-section title="Consultas por mês" full-width>
    <u-tabs v-model="tab" :items="months" />
    <u-tabs-content v-model="tab">
      <u-tabs-item v-for="month in months" :key="month.value" :value="month.value">
        <u-section-content>Consultas de {{ month.title }}</u-section-content>
      </u-tabs-item>
    </u-tabs-content>
  </u-section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  USection,
  USectionContent,
  UTabs,
  UTabsContent,
  UTabsItem,
} from "@nexdom/uimed-vue/components";

const tab = ref<string | number>();
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
].map((title, index) => ({ title, value: index + 1 }));
</script>
```

## Em uma janela

As abas também organizam o conteúdo de uma [janela modal](./dialog). Ao abrir, a janela coloca o foco na aba selecionada, o primeiro elemento focável do conteúdo.

<demo>
<u-button data-testid="btn-tabs-dialog" @click="dialogOpen = true">Ver paciente</u-button>
<u-dialog v-model="dialogOpen" title="Maria da Silva" :actions="dialogActions" data-testid="demo-tabs-dialog">
<u-tabs v-model="dialogTab" :items="basicItems" data-testid="demo-tabs-dialog-tabs" />
<u-tabs-content v-model="dialogTab" data-testid="demo-tabs-dialog-content">
  <u-tabs-item value="dados">Nascida em 12/03/1983, 43 anos.</u-tabs-item>
  <u-tabs-item value="endereco">Rua das Flores, 120, Centro, 01010-000.</u-tabs-item>
  <u-tabs-item value="contato">(11) 98765-4321, maria.silva@exemplo.com.br.</u-tabs-item>
</u-tabs-content>
</u-dialog>
</demo>

```vue
<template>
  <u-button @click="open = true">Ver paciente</u-button>
  <u-dialog v-model="open" title="Maria da Silva" :actions>
    <u-tabs v-model="tab" :items />
    <u-tabs-content v-model="tab">
      <u-tabs-item value="dados">Nascida em 12/03/1983, 43 anos.</u-tabs-item>
      <u-tabs-item value="endereco">Rua das Flores, 120, Centro, 01010-000.</u-tabs-item>
      <u-tabs-item value="contato">(11) 98765-4321, maria.silva@exemplo.com.br.</u-tabs-item>
    </u-tabs-content>
  </u-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog, UTabs, UTabsContent, UTabsItem } from "@nexdom/uimed-vue/components";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const open = ref(false);
const tab = ref<string | number>();
const items = [
  { title: "Dados pessoais", value: "dados" },
  { title: "Endereço", value: "endereco" },
  { title: "Contato", value: "contato" },
];

const actions: DialogAction[] = [{ label: "Fechar", onClick: () => (open.value = false) }];
</script>
```

## Ver também

Consulte a referência de API do [UTabs](../../api/components/tabs), do [UTabsContent](../../api/components/tabs-content) e do [UTabsItem](../../api/components/tabs-item) para a lista completa de props, eventos e slots.

<script lang="ts" setup>
  import { ref } from "vue"
  import type { ComponentProps } from "vue-component-type-helpers";
  import {
    UButton,
    UDialog,
    USection,
    USectionContent,
    UTabs,
    UTabsContent,
    UTabsItem,
  } from "../../../dist/components.js"

  type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

  const basicTab = ref<string | number>();
  const basicItems = [
    { title: "Dados pessoais", value: "dados" },
    { title: "Endereço", value: "endereco" },
    { title: "Contato", value: "contato" },
  ];

  const indexTab = ref<string | number>();
  const indexItems = [{ title: "Próximas" }, { title: "Realizadas" }];

  const monthTab = ref<string | number>();
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ].map((title, index) => ({ title, value: index + 1 }));

  const dialogOpen = ref(false);
  const dialogTab = ref<string | number>();
  const dialogActions: DialogAction[] = [{ label: "Fechar", onClick: () => (dialogOpen.value = false) }];
</script>
