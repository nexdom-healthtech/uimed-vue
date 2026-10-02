# UDialog

Componente para exibir conteúdo em uma janela modal, sobre a página, até que ela seja fechada.
O título e as ações ficam fixos enquanto o conteúdo rola.

## Props

| Prop         | Tipo                              | Padrão     | Descrição                                                                                                                                                                                                      |
| ------------ | --------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `boolean`                         | `false`    | Indica se a janela está aberta. Use com `v-model`. Quando o usuário fecha a janela, passa a ser `false` somente ao fim da animação de fechamento.                                                              |
| `title`      | `string`                          |            | Título da janela, em texto simples (HTML não é interpretado), em uma única linha: títulos longos são cortados com reticências. Também é o nome acessível da janela; sem título, o nome acessível é o conteúdo. |
| `actions`    | [`DialogButtonAction[]`](#action) |            | Botões exibidos no rodapé da janela, alinhados à direita, nesta ordem. Sem ações, o rodapé não é exibido.                                                                                                      |
| `size`       | `"small" \| "medium" \| "large"`  | `"medium"` | Largura máxima da janela: `small` (400px), `medium` (560px) ou `large` (800px).                                                                                                                                |
| `dataTestid` | `string`                          |            | Id do componente para uso em testes automatizados.                                                                                                                                                             |

### `Action`

Estende [`UButtonProps`](./button#props) com as seguintes propriedades adicionais:

| Prop      | Tipo              | Descrição                                                                                   |
| --------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `label`   | `string`          | Texto exibido no botão de ação.                                                             |
| `onClick` | `(event) => void` | Chamado quando o botão de ação é clicado. A janela continua aberta: feche-a pelo `v-model`. |

## Eventos

| Evento              | Retorno   | Descrição                                                                                                                                                   |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:modelValue` | `boolean` | Retorna `false` quando o usuário fecha a janela pela tecla `Esc`, por um clique fora dela ou pelo botão "voltar", somente ao fim da animação de fechamento. |

## Slots

| Slot      | Descrição                                                     |
| --------- | ------------------------------------------------------------- |
| `default` | Conteúdo exibido dentro da janela, entre o título e as ações. |

## Exemplo

```vue
<template>
  <u-button @click="open = true">Editar paciente</u-button>

  <u-dialog v-model="open" title="Editar paciente" :actions="actions">
    <u-form id="patient-form" @submit="save">
      <u-text-field v-model="name" label="Nome" required />
    </u-form>
  </u-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog, UForm, UTextField } from "@nexdom/uimed-vue/components";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const open = ref(false);
const name = ref("");

const actions = computed<DialogAction[]>(() => [
  { label: "Cancelar", variant: "ghost", onClick: () => (open.value = false) },
  { label: "Salvar", type: "submit", form: "patient-form" },
]);

function save() {
  console.log("Paciente salvo:", name.value);
  open.value = false;
}
</script>
```
