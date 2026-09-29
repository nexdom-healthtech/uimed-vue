---
outline: deep
---

# Janelas modais

O componente para apresentar conteúdo em uma janela modal, sobre a página, se chama `Dialog`. Enquanto a janela está aberta, o restante da página fica inacessível.

A janela abre e fecha pelo `v-model`. Para apresentar apenas uma mensagem ou pedir uma confirmação, prefira as composables [useDialog](../composables/use-dialog) e [useConfirm](../composables/use-confirm).

## Uso

A prop `title` define o título da janela, em texto simples e em uma única linha (títulos longos são cortados com reticências), e o conteúdo vai no slot padrão. A prop `actions` define os botões exibidos no rodapé, alinhados à direita, nesta ordem. Coloque a ação principal por último.

Clicar em uma ação **não fecha** a janela: feche-a no `onClick`, alterando o `v-model` para `false`.

<demo>
<u-button data-testid="btn-basic" @click="basicOpen = true">Ver detalhes</u-button>
<u-dialog v-model="basicOpen" title="Consulta agendada" :actions="basicActions" data-testid="dialog-basic">
A consulta de Maria da Silva foi agendada para 12/10, às 14h, com a Dra. Ana Souza.
</u-dialog>
</demo>

```vue
<template>
  <u-button @click="open = true">Ver detalhes</u-button>
  <u-dialog v-model="open" title="Consulta agendada" :actions>
    A consulta de Maria da Silva foi agendada para 12/10, às 14h, com a Dra. Ana Souza.
  </u-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog } from "@nexdom/uimed-vue/components";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const open = ref(false);

const actions: DialogAction[] = [{ label: "Fechar", onClick: () => (open.value = false) }];
</script>
```

### Fechando a janela

Além das ações, o usuário sempre pode fechar a janela pela tecla `Esc` ou clicando fora dela, inclusive enquanto uma ação apresenta um indicador de carregamento.

O botão "voltar" do navegador também fecha a janela, sem sair da página, em aplicações que usam o [Vue Router](https://router.vuejs.org/). A exceção é quando o "voltar" leva a uma página aberta com `router.replace`, como a página pela qual o usuário entrou na aplicação: nesse caso, a navegação acontece e a janela continua aberta.

Quando o usuário fecha a janela por um desses meios, ela começa a sumir na hora, mas o `v-model` só passa a ser `false` ao fim da animação de fechamento. Por isso:

- atribuir `true` ao `v-model` durante essa animação não tem efeito, porque ele ainda é `true`: a janela termina de fechar e o `v-model` passa a ser `false` em seguida;
- se o `@update:model-value` recusar a atualização, mantendo o valor `true`, a janela continua fechada com o `v-model` em `true`;
- se a janela for removida da página antes do fim da animação (por um `v-if`, por exemplo), o `v-model` continua `true`.

<demo col>
<u-button data-testid="btn-closing" @click="closingOpen = true">Abrir janela</u-button>
<p data-testid="closing-state">v-model: {{ closingOpen }}</p>
<u-dialog v-model="closingOpen" title="Fechando a janela" data-testid="dialog-closing">
Feche esta janela pela tecla <code>Esc</code> ou clicando fora dela.
</u-dialog>
</demo>

```vue
<template>
  <u-button @click="open = true">Abrir janela</u-button>
  <p>v-model: {{ open }}</p>
  <u-dialog v-model="open" title="Fechando a janela">
    Feche esta janela pela tecla <code>Esc</code> ou clicando fora dela.
  </u-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UButton, UDialog } from "@nexdom/uimed-vue/components";

const open = ref(false);
</script>
```

### Foco

Ao abrir, a janela coloca o foco no primeiro elemento focável do conteúdo, como um campo de formulário, ou, se não houver, na primeira ação. Enquanto a janela está aberta, a tecla `Tab` circula apenas entre os elementos dela. Ao fechar, o foco volta ao elemento que estava focado antes de a janela abrir, como o botão que a abriu.

O título é o nome acessível da janela, anunciado por leitores de tela ao abri-la. Sem título, o conteúdo é anunciado no lugar.

## Propriedades

### Formulários

Para enviar um formulário pelas ações, use uma ação do tipo `submit` com a prop `form` apontando para o `id` do [formulário](./form). O evento `submit` do formulário só é disparado quando não há pendências de validação.

Enquanto os dados são salvos, a ação principal pode apresentar um indicador de carregamento (`loading`) e as demais podem ficar desabilitadas (`disabled`). O usuário ainda pode fechar a janela nesse meio tempo, pela tecla `Esc`, por um clique fora dela ou pelo botão "voltar", sem interromper o salvamento.

O exemplo copia o nome para o rascunho ao abrir a janela, e não ao fechá-la: ao cancelar, a ação passa o `v-model` para `false` enquanto a janela ainda está sumindo, e trocar o texto nesse momento seria visível.

<demo col>
<u-button data-testid="btn-form" @click="openForm">Editar paciente</u-button>
<p data-testid="form-result">Nome: {{ patientName }}</p>
<u-dialog
  v-model="formOpen"
  title="Editar paciente"
  :actions="formActions"
  data-testid="dialog-form"
>
<u-form :id="formId" @submit="save">
<u-text-field v-model="draftName" label="Nome" required data-testid="field-name" />
</u-form>
</u-dialog>
</demo>

```vue
<template>
  <u-button @click="openForm">Editar paciente</u-button>
  <p>Nome: {{ name }}</p>
  <u-dialog v-model="open" title="Editar paciente" :actions>
    <u-form :id="formId" @submit="save">
      <u-text-field v-model="draft" label="Nome" required />
    </u-form>
  </u-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, useId } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog, UForm, UTextField } from "@nexdom/uimed-vue/components";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const formId = useId();
const open = ref(false);
const isSaving = ref(false);
const name = ref("Maria da Silva");
const draft = ref("");

const actions = computed<DialogAction[]>(() => [
  {
    label: "Cancelar",
    variant: "ghost",
    disabled: isSaving.value,
    onClick: () => (open.value = false),
  },
  { label: "Salvar", type: "submit", form: formId, loading: isSaving.value },
]);

function openForm() {
  draft.value = name.value;
  open.value = true;
}

function savePatient(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

async function save() {
  isSaving.value = true;
  await savePatient();
  name.value = draft.value;
  isSaving.value = false;
  open.value = false;
}
</script>
```

### Tamanhos

A prop `size` define a largura máxima da janela: `small` (400px), `medium` (560px) ou `large` (800px). O padrão é `medium`.

<demo>
<u-button data-testid="btn-size-small" variant="secondary" @click="openSize('small')">Pequena</u-button>
<u-button data-testid="btn-size-medium" variant="secondary" @click="openSize('medium')">Média</u-button>
<u-button data-testid="btn-size-large" variant="secondary" @click="openSize('large')">Grande</u-button>
<u-dialog
  v-model="sizeOpen"
  :title="`Tamanho ${size}`"
  :size
  :actions="sizeActions"
  data-testid="dialog-size"
>
Esta janela usa o tamanho <code>{{ size }}</code>.
</u-dialog>
</demo>

```vue
<template>
  <u-button variant="secondary" @click="openSize('small')">Pequena</u-button>
  <u-button variant="secondary" @click="openSize('medium')">Média</u-button>
  <u-button variant="secondary" @click="openSize('large')">Grande</u-button>
  <u-dialog v-model="open" :title="`Tamanho ${size}`" :size :actions>
    Esta janela usa o tamanho <code>{{ size }}</code
    >.
  </u-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog } from "@nexdom/uimed-vue/components";

type DialogProps = ComponentProps<typeof UDialog>;
type DialogSize = NonNullable<DialogProps["size"]>;
type DialogAction = NonNullable<DialogProps["actions"]>[number];

const open = ref(false);
const size = ref<DialogSize>("medium");

const actions: DialogAction[] = [{ label: "Fechar", onClick: () => (open.value = false) }];

function openSize(value: DialogSize) {
  size.value = value;
  open.value = true;
}
</script>
```

### Conteúdo longo

Quando o conteúdo não cabe na tela, apenas ele rola: o título e as ações continuam visíveis.

<demo>
<u-button data-testid="btn-long" @click="longOpen = true">Ler termos</u-button>
<u-dialog v-model="longOpen" title="Termos de uso" :actions="longActions" data-testid="dialog-long">
<p v-for="index in 20" :key="index" :data-testid="`long-paragraph-${index}`">
{{ index }}. O paciente autoriza o uso dos seus dados de saúde exclusivamente para fins de atendimento, conforme a legislação vigente.
</p>
</u-dialog>
</demo>

```vue
<template>
  <u-button @click="open = true">Ler termos</u-button>
  <u-dialog v-model="open" title="Termos de uso" :actions>
    <p v-for="index in 20" :key="index">
      {{ index }}. O paciente autoriza o uso dos seus dados de saúde exclusivamente para fins de
      atendimento, conforme a legislação vigente.
    </p>
  </u-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog } from "@nexdom/uimed-vue/components";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const open = ref(false);

const actions: DialogAction[] = [
  { label: "Recusar", variant: "ghost", onClick: () => (open.value = false) },
  { label: "Aceitar", onClick: () => (open.value = false) },
];
</script>
```

### Confirmações a partir da janela

Diálogos das composables [useDialog](../composables/use-dialog) e [useConfirm](../composables/use-confirm) abertos por uma ação aparecem sobre a janela. Ao fechá-los, o foco volta para a janela ou, se ela também tiver sido fechada, para o elemento que a abriu.

<demo>
<u-main>
<u-row>
<u-column cols="auto">
<u-button data-testid="btn-confirm" @click="recordOpen = true">Ver prontuário</u-button>
</u-column>
</u-row>
<p data-testid="confirm-result">Prontuário: {{ recordStatus }}</p>
<u-dialog v-model="recordOpen" title="Prontuário" :actions="recordActions" data-testid="dialog-confirm">
Maria da Silva, 42 anos. Última consulta em 12/09.
</u-dialog>
</u-main>
</demo>

```vue
<template>
  <u-main>
    <u-button @click="open = true">Ver prontuário</u-button>
    <p>Prontuário: {{ status }}</p>
    <u-dialog v-model="open" title="Prontuário" :actions>
      Maria da Silva, 42 anos. Última consulta em 12/09.
    </u-dialog>
  </u-main>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UDialog, UMain } from "@nexdom/uimed-vue/components";
import { useConfirm } from "@nexdom/uimed-vue/composables";

type DialogAction = NonNullable<ComponentProps<typeof UDialog>["actions"]>[number];

const { confirm, isRunning } = useConfirm();
const open = ref(false);
const status = ref("ativo");

const actions = computed<DialogAction[]>(() => [
  { label: "Fechar", variant: "ghost", onClick: () => (open.value = false) },
  { label: "Excluir", color: "danger", loading: isRunning.value, onClick: remove },
]);

function removeRecord(): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
}

async function remove() {
  const removed = await confirm(
    {
      title: "Excluir prontuário",
      message: "Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      color: "danger",
    },
    removeRecord,
  );

  if (removed) {
    status.value = "excluído";
    open.value = false;
  }
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<u-button data-testid="dialog-playground-open" @click="playgroundOpen = true">Abrir janela</u-button>
<u-dialog
  v-model="playgroundOpen"
  :title="playgroundActions.title.value"
  :size="playgroundActions.size.value as DialogSize"
  :actions="playgroundActions.showActions.value ? playgroundDialogActions : undefined"
  data-testid="dialog-playground"
>
{{ playgroundActions.content.value }}
</u-dialog>
</playground>

## Ver também

- Consulte a referência de [API do UDialog](../../api/components/dialog) para a lista completa de props, eventos e slots.
- Para apresentar mensagens ou perguntas simples, use a composable [useDialog](../composables/use-dialog).
- Para confirmar uma ação antes de executá-la, use a composable [useConfirm](../composables/use-confirm).

<script lang="ts" setup>
  import { computed, ref, useId } from "vue";
  import type { ComponentProps } from "vue-component-type-helpers";
  import {
    UButton,
    UColumn,
    UDialog,
    UForm,
    UMain,
    URow,
    UTextField,
  } from "../../../dist/components.js";
  import { useConfirm } from "../../../dist/composables.js";

  type Props = ComponentProps<typeof UDialog>;
  type DialogSize = NonNullable<Props["size"]>;
  type DialogAction = NonNullable<Props["actions"]>[number];

  const basicOpen = ref(false);
  const closingOpen = ref(false);
  const basicActions: DialogAction[] = [{ label: "Fechar", onClick: () => (basicOpen.value = false) }];

  const formId = useId();
  const formOpen = ref(false);
  const isSaving = ref(false);
  const patientName = ref("Maria da Silva");
  const draftName = ref("");
  const formActions = computed<DialogAction[]>(() => [
    {
      label: "Cancelar",
      variant: "ghost",
      disabled: isSaving.value,
      onClick: () => (formOpen.value = false),
    },
    { label: "Salvar", type: "submit", form: formId, loading: isSaving.value },
  ]);

  function openForm() {
    draftName.value = patientName.value;
    formOpen.value = true;
  }

  function savePatient(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }

  async function save() {
    isSaving.value = true;
    await savePatient();
    patientName.value = draftName.value;
    isSaving.value = false;
    formOpen.value = false;
  }

  const sizeOpen = ref(false);
  const size = ref<DialogSize>("medium");
  const sizeActions: DialogAction[] = [{ label: "Fechar", onClick: () => (sizeOpen.value = false) }];

  function openSize(value: DialogSize) {
    size.value = value;
    sizeOpen.value = true;
  }

  const longOpen = ref(false);
  const longActions: DialogAction[] = [
    { label: "Recusar", variant: "ghost", onClick: () => (longOpen.value = false) },
    { label: "Aceitar", onClick: () => (longOpen.value = false) },
  ];

  const { confirm, isRunning: isRemoving } = useConfirm();
  const recordOpen = ref(false);
  const recordStatus = ref("ativo");
  const recordActions = computed<DialogAction[]>(() => [
    { label: "Fechar", variant: "ghost", onClick: () => (recordOpen.value = false) },
    { label: "Excluir", color: "danger", loading: isRemoving.value, onClick: removeRecord },
  ]);

  async function removeRecord() {
    const removed = await confirm(
      {
        title: "Excluir prontuário",
        message: "Esta ação não pode ser desfeita.",
        confirmText: "Excluir",
        color: "danger",
      },
      () => new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1500)),
    );

    if (removed) {
      recordStatus.value = "excluído";
      recordOpen.value = false;
    }
  }

  const playgroundOpen = ref(false);
  const playgroundDialogActions: DialogAction[] = [
    { label: "Cancelar", variant: "ghost", onClick: () => (playgroundOpen.value = false) },
    { label: "Confirmar", onClick: () => (playgroundOpen.value = false) },
  ];

  const playgroundActions = ref({
    title: {
      type: "text",
      label: "Título",
      value: "Título da janela",
      dataTestid: "dialog-playground-title",
    },
    content: {
      type: "text",
      label: "Conteúdo",
      value: "Teste o componente Dialog com diferentes combinações de props",
      dataTestid: "dialog-playground-content",
    },
    size: {
      type: "combobox",
      label: "Tamanho",
      value: "medium",
      dataTestid: "dialog-playground-size",
      items: ["small", "medium", "large"],
    },
    showActions: {
      type: "checkbox",
      value: true,
      label: "Exibir ações",
      dataTestid: "dialog-playground-actions",
    },
  });
</script>
