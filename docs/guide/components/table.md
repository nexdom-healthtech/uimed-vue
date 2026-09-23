---
outline: deep
---

# Tabela

O componente `Table` é usado para apresentar dados em tabelas, de forma clara e organizada.

> [!Warning]
> Deve ser utilizado no lugar do `<table>` nativo.

## Propriedades

### Layout

A prop `vertical` define o layout da tabela.

#### Horizontal (Padrão)

Por padrão, a tabela será exibida em layout horizontal com cabeçalhos no topo.

<demo>
<u-table 
  :headers="['Nome', 'Idade', 'Cidade']" 
  :items="[['Ana', '30', 'São Paulo'], ['Bruno', '25', 'Rio de Janeiro']]"
  data-testid="demo-table-horizontal"
/>
</demo>

```vue
<template>
  <u-table
    :headers="['Nome', 'Idade', 'Cidade']"
    :items="[
      ['Ana', '30', 'São Paulo'],
      ['Bruno', '25', 'Rio de Janeiro'],
    ]"
  />
</template>

<script lang="ts" setup>
import { UTable } from "@nexdom/uimed-vue/components";
</script>
```

#### Vertical

Utilize a prop `vertical` para renderizar uma tabela separada para cada item, exibindo cada linha com um cabeçalho na coluna esquerda.

<demo col>
<u-table 
  :headers="['Nome', 'Idade', 'Cidade']" 
  :items="[['Ana', '30', 'São Paulo'], ['Bruno', '25', 'Rio de Janeiro']]"
  vertical
  data-testid="demo-table-vertical"
/>
</demo>

```vue
<template>
  <u-table
    :headers="['Nome', 'Idade', 'Cidade']"
    :items="[
      ['Ana', '30', 'São Paulo'],
      ['Bruno', '25', 'Rio de Janeiro'],
    ]"
    vertical
  />
</template>

<script lang="ts" setup>
import { UTable } from "@nexdom/uimed-vue/components";
</script>
```

Caso `headers` seja um array vazio, o layout vertical ainda pode ser utilizado, mas as linhas serão exibidas sem um cabeçalho na coluna esquerda.

<demo col>
<u-table
:items="[['Ana', '30', 'São Paulo'], ['Bruno', '25', 'Rio de Janeiro']]"
  vertical
  data-testid="demo-table-vertical-no-headers"
/>
</demo>

```vue
<template>
  <u-table
    :items="[
      ['Ana', '30', 'São Paulo'],
      ['Bruno', '25', 'Rio de Janeiro'],
    ]"
    vertical
  />
</template>

<script lang="ts" setup>
import { UTable } from "@nexdom/uimed-vue/components";
</script>
```

### Carregamento

A prop `loading` exibe um skeleton loader no lugar da tabela.

Esse é um ótimo recurso de feedback para o usuário, enquanto uma operação está em andamento.

<demo>
<u-table 
  :headers="['Nome', 'Idade', 'Cidade']" 
  :items="[['Ana', '30', 'São Paulo'], ['Bruno', '25', 'Rio de Janeiro']]"
  loading
  data-testid="demo-table-loading"
/>
</demo>

```vue
<template>
  <u-table
    :headers="['Nome', 'Idade', 'Cidade']"
    :items="[
      ['Ana', '30', 'São Paulo'],
      ['Bruno', '25', 'Rio de Janeiro'],
    ]"
    loading
  />
</template>

<script lang="ts" setup>
import { UTable } from "@nexdom/uimed-vue/components";
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<demo col>
<u-table
  :headers="playgroundHeader ? tableHeaders : []"
  :items="tableItems"
  :vertical="playgroundVertical"
  :loading="playgroundLoading"
  data-testid="table-playground-preview"
/>
</demo>

<template #actions>
<v-checkbox
  v-model="playgroundHeader"
  label="Cabeçalho"
  density="compact"
  hide-details
  data-testid="table-playground-header"
/>

<v-checkbox
  v-model="playgroundVertical"
  label="Vertical"
  density="compact"
  hide-details
  data-testid="table-playground-vertical"
/>

<v-checkbox
  v-model="playgroundLoading"
  label="Carregando"
  density="compact"
  hide-details
  data-testid="table-playground-loading"
/>
</template>
</playground>

## Ver também

Consulte a referência de [API do UTable](../../api/components/table) para a lista completa de props.

<script lang="ts" setup>
  import { ref } from "vue"
  import { UTable } from "../../../dist/components.js"
  import { VCheckbox } from "vuetify/components"

  const tableHeaders = ["Nome", "Idade", "Cidade"];
  const tableItems = [
    ["Ana", "30", "São Paulo"],
    ["Bruno", "25", "Rio de Janeiro"],
  ];

  const playgroundActions = ref({});
  const playgroundVertical = ref(false);
  const playgroundHeader = ref(true);
  const playgroundLoading = ref(false);
</script>
