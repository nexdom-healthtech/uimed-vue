# UTable

Componente para apresentação de dados em formato tabelado, orientado por dados por meio de props (**sem slots**).

## Props

| Prop         | Tipo         | Padrão  | Descrição                                                                                                                                                                                                                                                                                                                         |
| ------------ | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headers`    | `string[]`   |         | Cabeçalhos das colunas. Não obrigatório. Quando não fornecido ou vazio, nenhum `<thead>` é renderizado em modo horizontal. Em modo vertical, é utilizado a cada linha como cabeçalho do valor seguinte da linha.                                                                                                                  |
| `items`      | `string[][]` |         | Lista da dados que serão apresentados na tabela. Os valores dentro de cada item devem estar na mesma ordem dos cabeçalhos (`headers`). Nenhum preenchimento ou truncamento é aplicado, ou seja, as células são renderizadas exatamente como fornecidas, mesmo que as linhas tenham comprimentos/quantidade de strings diferentes. |
| `vertical`   | `boolean`    | `false` | Altera o layout para modo vertical quando `true`, renderizando uma tabela separada para cada item. Com cabeçalhos definidos, cada linha exibe um rótulo. Do contrário, serão exibidos apenas os valores dos itens, dividindo um por linha.                                                                                        |
| `loading`    | `boolean`    | `false` | Coloca a tabela em estado de carregamento.                                                                                                                                                                                                                                                                                        |
| `dataTestid` | `string`     |         | Aplica atributo `data-testid` para testes automatizados. Em modo vertical, com múltiplos itens, cada tabela recebe um contador como sufixo (`${dataTestid}-${index}`).                                                                                                                                                            |

## Exemplo

```vue
<template>
  <u-table
    :headers="['Nome', 'Idade', 'Cidade']"
    :items="[
      ['Ana', '30', 'São Paulo'],
      ['Bruno', '25', 'Rio de Janeiro'],
    ]"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UTable } from "@nexdom/uimed-vue/components";

const loading = ref(false);
</script>
```
