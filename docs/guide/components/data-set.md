---
outline: deep
---

# Listagem

O componente padrão para listar registros se chama `DataSet`.

Ele recebe a lista de registros e apresenta cada um deles por meio do seu slot padrão, que recebe o registro original (`item`) e a sua posição na página atual (`index`). Dentro do slot, monte cada registro com os componentes [`DataSetItem` e `DataSetItemTitle`](#componentes-datasetitem-e-datasetitemtitle).

## Propriedades

### Itens

A prop `items` define os registros a serem listados.

<demo col>
<u-data-set :items="pacientes.slice(0, 3)" data-testid="demo-data-set-items">
  <template #default="{ item }">
    <u-data-set-item :data-testid="`demo-data-set-items-${item.id}`">
      <u-data-set-item-title :title="item.nome" />
      Plano {{ item.plano }}
    </u-data-set-item>
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes">
    <template #default="{ item }">
      <u-data-set-item>
        <u-data-set-item-title :title="item.nome" />
        Plano {{ item.plano }}
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
  { id: 3, nome: "Carla Dias", plano: "Bronze" },
];
</script>
```

### Paginação

Os registros são divididos em páginas de acordo com a prop `itemsPerPage`, que por padrão apresenta até `10` registros por página. Os controles de paginação só são exibidos quando há mais de uma página.

A página atual pode ser acompanhada, ou alterada, por meio do `v-model:page`, que inicia na primeira página.

<demo col>
<ClientOnly>
<u-data-set v-model:page="paginaAtual" :items="consultas" :items-per-page="5" data-testid="demo-data-set-pagination">
  <template #default="{ item }">
    <u-data-set-item>
      <u-data-set-item-title :title="item.paciente" />
      {{ item.especialidade }} em {{ item.data }}
    </u-data-set-item>
  </template>
</u-data-set>
</ClientOnly>
<span data-testid="demo-data-set-pagination-page">Página atual: {{ paginaAtual }}</span>
</demo>

```vue
<template>
  <u-data-set v-model:page="paginaAtual" :items="consultas" :items-per-page="5">
    <template #default="{ item }">
      <u-data-set-item>
        <u-data-set-item-title :title="item.paciente" />
        {{ item.especialidade }} em {{ item.data }}
      </u-data-set-item>
    </template>
  </u-data-set>
  Página atual: {{ paginaAtual }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const paginaAtual = ref(1);
const consultas = [
  { id: 1, paciente: "Ana Souza", especialidade: "Cardiologia", data: "01/10/2026" },
  { id: 2, paciente: "Bruno Lima", especialidade: "Dermatologia", data: "02/10/2026" },
  // ...
];
</script>
```

### Pesquisa

A prop `searchable` exibe um campo de pesquisa acima dos registros. Apenas os registros que contêm o texto pesquisado, sem diferenciar maiúsculas e minúsculas, são listados, e a listagem volta para a primeira página a cada nova pesquisa.

Por padrão, todas as propriedades dos registros são consideradas. Utilize a prop `searchKeys` para restringir a pesquisa a algumas delas.

O texto pesquisado pode ser acompanhado, ou alterado, por meio do `v-model:search`. Ele filtra os registros mesmo quando o campo de pesquisa não é exibido.

<demo col>
<ClientOnly>
<u-data-set v-model:search="pesquisa" :items="pacientes" :search-keys="['nome']" :items-per-page="4" searchable data-testid="demo-data-set-search">
  <template #default="{ item }">
    <u-data-set-item>
      <u-data-set-item-title :title="item.nome" />
      Plano {{ item.plano }}
    </u-data-set-item>
  </template>
</u-data-set>
</ClientOnly>
<span data-testid="demo-data-set-search-text">Pesquisa: {{ pesquisa }}</span>
</demo>

```vue
<template>
  <u-data-set
    v-model:search="pesquisa"
    :items="pacientes"
    :search-keys="['nome']"
    :items-per-page="4"
    searchable
  >
    <template #default="{ item }">
      <u-data-set-item>
        <u-data-set-item-title :title="item.nome" />
        Plano {{ item.plano }}
      </u-data-set-item>
    </template>
  </u-data-set>
  Pesquisa: {{ pesquisa }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pesquisa = ref("");
const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
  // ...
];
</script>
```

### Sem registros

Quando não há registros para listar, seja porque `items` está vazio ou porque nenhum registro corresponde à pesquisa, a mensagem "Nenhum registro encontrado." é exibida. Utilize a prop `noDataText` para personalizá-la.

<demo col>
<u-data-set :items="[]" no-data-text="Nenhum paciente agendado para hoje." data-testid="demo-data-set-no-data" />
</demo>

```vue
<template>
  <u-data-set :items="[]" no-data-text="Nenhum paciente agendado para hoje." />
</template>

<script lang="ts" setup>
import { UDataSet } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um skeleton loader no lugar da listagem enquanto uma operação está em andamento.

<demo col>
<u-data-set :items="pacientes" loading data-testid="demo-data-set-loading" />
</demo>

```vue
<template>
  <u-data-set :items="pacientes" loading />
</template>

<script lang="ts" setup>
import { UDataSet } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
];
</script>
```

## Componentes DataSetItem e DataSetItemTitle

O componente `DataSetItem` agrupa o conteúdo de um registro, e o `DataSetItemTitle` apresenta o seu título.

O título pode ser definido pela prop `title` ou, quando for necessário um conteúdo mais elaborado, pelo slot padrão do `DataSetItemTitle`.

<demo col>
<u-data-set :items="pacientes.slice(0, 2)" data-testid="demo-data-set-item">
  <template #default="{ item, index }">
    <u-data-set-item>
      <u-data-set-item-title>{{ index + 1 }}. {{ item.nome }}</u-data-set-item-title>
      Carteirinha {{ item.carteirinha }}
    </u-data-set-item>
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes">
    <template #default="{ item, index }">
      <u-data-set-item>
        <u-data-set-item-title>{{ index + 1 }}. {{ item.nome }}</u-data-set-item-title>
        Carteirinha {{ item.carteirinha }}
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UDataSetItemTitle } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", carteirinha: "0001 2345 6789" },
  { id: 2, nome: "Bruno Lima", carteirinha: "0001 9876 5432" },
];
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<div style="width: 100%;">
<ClientOnly>
<u-data-set
  :items="pacientes"
  :items-per-page="Number(playgroundActions.itemsPerPage.value)"
  :searchable="playgroundActions.searchable.value"
  :loading="playgroundActions.loading.value"
  :no-data-text="playgroundActions.noDataText.value"
  data-testid="data-set-preview"
>
  <template #default="{ item }">
    <u-data-set-item>
      <u-data-set-item-title :title="item.nome" />
      Plano {{ item.plano }}
    </u-data-set-item>
  </template>
</u-data-set>
</ClientOnly>
</div>

</playground>

## Ver também

Consulte a referência de [API do UDataSet](../../api/components/data-sets/data-set), da [API do UDataSetItem](../../api/components/data-sets/data-set-item) e da [API do UDataSetItemTitle](../../api/components/data-sets/data-set-item-title) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UDataSet, UDataSetItem, UDataSetItemTitle } from "../../../dist/components.js"


  const pacientes = [
    { id: 1, nome: "Ana Souza", plano: "Ouro", carteirinha: "0001 2345 6789" },
    { id: 2, nome: "Bruno Lima", plano: "Prata", carteirinha: "0001 9876 5432" },
    { id: 3, nome: "Carla Dias", plano: "Bronze", carteirinha: "0001 1111 2222" },
    { id: 4, nome: "Daniel Rocha", plano: "Ouro", carteirinha: "0001 3333 4444" },
    { id: 5, nome: "Eduarda Alves", plano: "Prata", carteirinha: "0001 5555 6666" },
    { id: 6, nome: "Felipe Costa", plano: "Bronze", carteirinha: "0001 7777 8888" },
    { id: 7, nome: "Gabriela Martins", plano: "Ouro", carteirinha: "0001 9999 0000" },
    { id: 8, nome: "Henrique Souza", plano: "Prata", carteirinha: "0001 1212 3434" },
  ];

  const consultas = [
    { id: 1, paciente: "Ana Souza", especialidade: "Cardiologia", data: "01/10/2026" },
    { id: 2, paciente: "Bruno Lima", especialidade: "Dermatologia", data: "02/10/2026" },
    { id: 3, paciente: "Carla Dias", especialidade: "Pediatria", data: "03/10/2026" },
    { id: 4, paciente: "Daniel Rocha", especialidade: "Ortopedia", data: "04/10/2026" },
    { id: 5, paciente: "Eduarda Alves", especialidade: "Cardiologia", data: "05/10/2026" },
    { id: 6, paciente: "Felipe Costa", especialidade: "Neurologia", data: "06/10/2026" },
    { id: 7, paciente: "Gabriela Martins", especialidade: "Pediatria", data: "07/10/2026" },
    { id: 8, paciente: "Henrique Souza", especialidade: "Dermatologia", data: "08/10/2026" },
    { id: 9, paciente: "Isabela Ramos", especialidade: "Ortopedia", data: "09/10/2026" },
    { id: 10, paciente: "João Pereira", especialidade: "Cardiologia", data: "10/10/2026" },
    { id: 11, paciente: "Karina Melo", especialidade: "Neurologia", data: "11/10/2026" },
    { id: 12, paciente: "Lucas Barros", especialidade: "Pediatria", data: "12/10/2026" },
  ];

  const paginaAtual = ref(1);
  const pesquisa = ref("");

  const playgroundItemsPerPageOptions = ["3", "5", "10"];

  const playgroundActions = ref({
    searchable: {
      type: "checkbox",
      value: true,
      label: "Pesquisável",
      dataTestid: "data-set-playground-searchable"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "data-set-playground-loading"
    },
    noDataText: {
      type: "text",
      label: "Mensagem sem registros",
      value: "Nenhum registro encontrado.",
      dataTestid: "data-set-playground-no-data-text"
    },
    itemsPerPage: {
      type: "combobox",
      label: "Itens por página",
      value: playgroundItemsPerPageOptions[0],
      dataTestid: "data-set-playground-items-per-page",
      items: playgroundItemsPerPageOptions
    },
  });
</script>
