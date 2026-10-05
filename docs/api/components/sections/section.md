# USection

Componente para agrupar conteúdo, como campos de formulário, relatórios, dashboard e afins.
Inclui suporte para ações sobre esses conteúdos, como botões para salvar, etc.

## Props

| Prop         | Tipo                           | Padrão      | Descrição                                                                                                    |
| ------------ | ------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `variant`    | `"primary" \| "secondary"`     | `"primary"` | Aplica uma variação de estilo distinta ao agrupador de conteúdo.                                             |
| `title`      | `string`                       |             | Título do agrupador.                                                                                         |
| `subtitle`   | `string`                       |             | Subtítulo do agrupador.                                                                                      |
| `textAlign`  | `"start" \| "center" \| "end"` | `"start"`   | Alinhamento horizontal do título, do subtítulo, do conteúdo e das ações. Com `start`, as ações ficam no fim. |
| `actions`    | [`action[]`](#action)          |             | Lista de ações disponíveis para o agrupador.                                                                 |
| `fullWidth`  | `boolean`                      | `false`     | Faz o agrupador ocupar 100% da largura do seu container.                                                     |
| `fullHeight` | `boolean`                      | `false`     | Faz o agrupador ocupar 100% da altura do seu container.                                                      |
| `loading`    | `boolean`                      | `false`     | Coloca o agrupador em estado de carregamento.                                                                |
| `dataTestid` | `string`                       |             | Id do componente para uso em testes automatizados.                                                           |

### `Action`

Estende [`UButtonProps`](../button#props) com as seguintes propriedades adicionais:

| Prop      | Tipo              | Descrição                                                                                             |
| --------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `label`   | `string`          | Texto exibido no botão de ação.                                                                       |
| `onClick` | `(event) => void` | Chamado quando o botão de ação é clicado. Não é chamado enquanto a ação está `disabled` ou `loading`. |

## Slots

| Slot      | Descrição                             |
| --------- | ------------------------------------- |
| `default` | Conteúdo exibido dentro do agrupador. |

## Exemplo

```vue
<template>
  <u-section title="Confirmação" subtitle="Deseja continuar?" :actions="actions">
    <u-section-content>Esta ação não pode ser desfeita.</u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { USection, USectionContent } from "@nexdom/uimed-vue/components";

const actions = ref([
  {
    label: "Cancelar",
    variant: "ghost",
    onClick: () => console.log("Cancelado"),
  },
  {
    label: "Confirmar",
    color: "positive",
    onClick: () => console.log("Confirmado"),
  },
]);
</script>
```
