---
outline: deep
---

# Listagem

O componente padrão para listar registros se chama `DataSet`.

Ele apresenta os registros da página atual em uma grade responsiva de cartões, montada com os componentes de [layout](./layout) `Row` e `Column`. Cada registro ocupa a sua própria coluna e é apresentado por meio do slot padrão, que recebe o registro original (`item`) e a sua posição na página atual (`index`). Dentro do slot, monte o cartão de cada registro com o componente [`DataSetItem`](#componente-datasetitem), baseado no [agrupador de conteúdo](./section).

## Propriedades

### Itens

A prop `items` define os registros a serem listados.

<demo col>
<u-data-set :items="pacientes.slice(0, 3)" data-testid="demo-data-set-items">
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" :data-testid="`demo-data-set-items-${item.id}`" />
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes">
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" />
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
  { id: 3, nome: "Carla Dias", plano: "Bronze" },
];
</script>
```

### Colunas

A prop `columns` define a quantidade máxima de registros apresentados lado a lado em cada linha da grade: `1`, `2`, `3`, `4` ou `6`. O padrão é `3`.

A grade é responsiva e se adapta ao espaço que a listagem realmente ocupa, e não apenas ao tamanho da tela: para que cada cartão tenha pelo menos 240px de largura, a quantidade de registros por linha é reduzida para o maior dos valores acima que caiba na largura disponível. Assim, uma listagem dentro de um espaço estreito, como um diálogo ou um painel lateral, apresenta menos registros por linha, podendo chegar a um único registro. Em telas muito pequenas, como as de celulares, cada registro ocupa a largura inteira.

Experimente alterar a quantidade de colunas no [Playground](#playground), cuja área de visualização é estreita, e a largura da janela: a quantidade de registros por linha se ajusta ao espaço disponível.

<demo col>
<u-data-set :items="pacientes.slice(0, 4)" :columns="2" data-testid="demo-data-set-columns">
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" data-testid="demo-data-set-columns-item" />
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes" :columns="2">
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" />
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
  { id: 3, nome: "Carla Dias", plano: "Bronze" },
  { id: 4, nome: "Daniel Rocha", plano: "Ouro" },
];
</script>
```

### Paginação

Os registros são divididos em páginas de acordo com a prop `itemsPerPage`, que por padrão apresenta até `10` registros por página. Os controles de paginação só são exibidos quando há mais de uma página.

A página atual pode ser acompanhada, ou alterada, por meio do `v-model:page`, que inicia na primeira página.

<demo col>
<ClientOnly>
<u-data-set v-model:page="paginaAtual" :items="consultas" :items-per-page="6" data-testid="demo-data-set-pagination">
  <template #default="{ item }">
    <u-data-set-item :title="item.paciente" :subtitle="item.especialidade" data-testid="demo-data-set-pagination-item">
      Consulta em {{ item.data }}
    </u-data-set-item>
  </template>
</u-data-set>
</ClientOnly>
<span data-testid="demo-data-set-pagination-page">Página atual: {{ paginaAtual }}</span>
</demo>

```vue
<template>
  <u-data-set v-model:page="paginaAtual" :items="consultas" :items-per-page="6">
    <template #default="{ item }">
      <u-data-set-item :title="item.paciente" :subtitle="item.especialidade">
        Consulta em {{ item.data }}
      </u-data-set-item>
    </template>
  </u-data-set>
  Página atual: {{ paginaAtual }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

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
<u-data-set v-model:search="pesquisa" :items="pacientes" :search-keys="['nome']" :items-per-page="4" :columns="2" searchable data-testid="demo-data-set-search">
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" data-testid="demo-data-set-search-item" />
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
    :columns="2"
    searchable
  >
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" />
    </template>
  </u-data-set>
  Pesquisa: {{ pesquisa }}
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

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

## Componente DataSetItem

O componente `DataSetItem` apresenta um registro como um cartão, baseado no [agrupador de conteúdo](./section). Ele ocupa toda a altura da sua coluna, de forma que os cartões de uma mesma linha fiquem alinhados.

### Título e subtítulo

As props `title` e `subtitle` definem o título e uma breve descrição, exibidos no topo do cartão.

<demo col>
<u-data-set :items="pacientes.slice(0, 2)" :columns="2" data-testid="demo-data-set-item">
  <template #default="{ item, index }">
    <u-data-set-item :title="`${index + 1}. ${item.nome}`" :subtitle="item.cidade" data-testid="demo-data-set-item-card" />
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes" :columns="2">
    <template #default="{ item, index }">
      <u-data-set-item :title="`${index + 1}. ${item.nome}`" :subtitle="item.cidade" />
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", cidade: "São Paulo - SP" },
  { id: 2, nome: "Bruno Lima", cidade: "Belo Horizonte - MG" },
];
</script>
```

### Campos do registro

O slot padrão do `DataSetItem` apresenta os detalhes do registro abaixo do título. Para apresentar alguns dos seus campos, utilize a [tabela](./table) com o layout `vertical`, que exibe o nome de cada campo ao lado do seu valor.

<demo col>
<u-data-set :items="pacientes.slice(0, 4)" :columns="2" data-testid="demo-data-set-fields">
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="item.cidade" :data-testid="`demo-data-set-fields-item-${item.id}`">
      <u-table
        :headers="['Plano', 'Idade', 'Carteirinha']"
        :items="[[item.plano, item.idade, item.carteirinha]]"
        vertical
        :data-testid="`demo-data-set-fields-table-${item.id}`"
      />
    </u-data-set-item>
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes" :columns="2">
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="item.cidade">
        <u-table
          :headers="['Plano', 'Idade', 'Carteirinha']"
          :items="[[item.plano, item.idade, item.carteirinha]]"
          vertical
        />
      </u-data-set-item>
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem, UTable } from "@nexdom/uimed-vue/components";

const pacientes = [
  {
    id: 1,
    nome: "Ana Souza",
    cidade: "São Paulo - SP",
    plano: "Ouro",
    idade: "34 anos",
    carteirinha: "0001 2345 6789",
  },
  {
    id: 2,
    nome: "Bruno Lima",
    cidade: "Belo Horizonte - MG",
    plano: "Prata",
    idade: "52 anos",
    carteirinha: "0001 9876 5432",
  },
  // ...
];
</script>
```

### Variantes

A prop `variant` define a variação de estilo do cartão, assim como no agrupador de conteúdo: `primary` ou `secondary`. O padrão é `primary`.

<demo col>
<u-data-set :items="pacientes.slice(0, 2)" :columns="2" data-testid="demo-data-set-item-variant">
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" variant="secondary" data-testid="demo-data-set-item-variant-card" />
  </template>
</u-data-set>
</demo>

```vue
<template>
  <u-data-set :items="pacientes" :columns="2">
    <template #default="{ item }">
      <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" variant="secondary" />
    </template>
  </u-data-set>
</template>

<script lang="ts" setup>
import { UDataSet, UDataSetItem } from "@nexdom/uimed-vue/components";

const pacientes = [
  { id: 1, nome: "Ana Souza", plano: "Ouro" },
  { id: 2, nome: "Bruno Lima", plano: "Prata" },
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
  :columns="(Number(playgroundActions.columns.value) as Props['columns'])"
  :items-per-page="Number(playgroundActions.itemsPerPage.value)"
  :searchable="playgroundActions.searchable.value"
  :loading="playgroundActions.loading.value"
  :no-data-text="playgroundActions.noDataText.value"
  data-testid="data-set-preview"
>
  <template #default="{ item }">
    <u-data-set-item :title="item.nome" :subtitle="`Plano ${item.plano}`" data-testid="data-set-preview-item" />
  </template>
</u-data-set>
</ClientOnly>
</div>

</playground>

## Ver também

Consulte a referência de [API do UDataSet](../../api/components/data-sets/data-set) e da [API do UDataSetItem](../../api/components/data-sets/data-set-item) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UDataSet, UDataSetItem, UTable } from "../../../dist/components.js"
  import type { ComponentProps } from "vue-component-type-helpers";

  type Props = ComponentProps<typeof UDataSet>;

  const pacientes = [
    { id: 1, nome: "Ana Souza", plano: "Ouro", cidade: "São Paulo - SP", idade: "34 anos", carteirinha: "0001 2345 6789" },
    { id: 2, nome: "Bruno Lima", plano: "Prata", cidade: "Belo Horizonte - MG", idade: "52 anos", carteirinha: "0001 9876 5432" },
    { id: 3, nome: "Carla Dias", plano: "Bronze", cidade: "Curitiba - PR", idade: "27 anos", carteirinha: "0001 1111 2222" },
    { id: 4, nome: "Daniel Rocha", plano: "Ouro", cidade: "Recife - PE", idade: "41 anos", carteirinha: "0001 3333 4444" },
    { id: 5, nome: "Eduarda Alves", plano: "Prata", cidade: "Porto Alegre - RS", idade: "19 anos", carteirinha: "0001 5555 6666" },
    { id: 6, nome: "Felipe Costa", plano: "Bronze", cidade: "Salvador - BA", idade: "63 anos", carteirinha: "0001 7777 8888" },
    { id: 7, nome: "Gabriela Martins", plano: "Ouro", cidade: "Fortaleza - CE", idade: "45 anos", carteirinha: "0001 9999 0000" },
    { id: 8, nome: "Henrique Souza", plano: "Prata", cidade: "Goiânia - GO", idade: "38 anos", carteirinha: "0001 1212 3434" },
  ];

  const consultas = [
    { id: 1, paciente: "Ana Souza", especialidade: "Cardiologia", data: "01/10/2026" },
    { id: 2, paciente: "Bruno Lima", especialidade: "Dermatologia", data: "02/10/2026" },
    { id: 3, paciente: "Carla Dias", especialidade: "Pediatria", data: "03/10/2026" },
    { id: 4, paciente: "Daniel Rocha", especialidade: "Ortopedia", data: "04/10/2026" },
    { id: 5, paciente: "Eduarda Alves", especialidade: "Cardiologia", data: "05/10/2026" },
    { id: 6, paciente: "Felipe Costa", especialidade: "Neurologia", data: "06/10/2026" },
    { id: 7, paciente: "Gabriela Reis", especialidade: "Pediatria", data: "07/10/2026" },
    { id: 8, paciente: "Henrique Souza", especialidade: "Dermatologia", data: "08/10/2026" },
    { id: 9, paciente: "Isabela Ramos", especialidade: "Ortopedia", data: "09/10/2026" },
    { id: 10, paciente: "João Pereira", especialidade: "Cardiologia", data: "10/10/2026" },
    { id: 11, paciente: "Karina Melo", especialidade: "Neurologia", data: "11/10/2026" },
    { id: 12, paciente: "Lucas Barros", especialidade: "Pediatria", data: "12/10/2026" },
    { id: 13, paciente: "Mariana Teles", especialidade: "Dermatologia", data: "13/10/2026" },
    { id: 14, paciente: "Nicolas Freitas", especialidade: "Ortopedia", data: "14/10/2026" },
    { id: 15, paciente: "Olívia Cardoso", especialidade: "Cardiologia", data: "15/10/2026" },
  ];

  const paginaAtual = ref(1);
  const pesquisa = ref("");

  const playgroundColumnsOptions = ["1", "2", "3", "4", "6"];
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
    columns: {
      type: "combobox",
      label: "Colunas",
      value: playgroundColumnsOptions[2],
      dataTestid: "data-set-playground-columns",
      items: playgroundColumnsOptions
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
