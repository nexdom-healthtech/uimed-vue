# Confirmações

Uma vez que carregamos o [Componente base](../components/main), podemos estar tirando proveito da nossa composable para pedir a confirmação do usuário antes de executar uma ação.

A ação só é executada depois que o usuário clica no botão de confirmação. Enquanto ela executa, o botão de confirmação apresenta um indicador de carregamento, o botão de cancelamento fica desabilitado e o diálogo não pode ser fechado. Ao terminar, o diálogo fecha e `confirm` devolve o retorno da ação.

Se o usuário cancelar, ou se a ação falhar, `confirm` devolve `false`. Em caso de falha, a mensagem do erro é apresentada em um [toast](./use-toast), assim como no [Run or toast](./use-run-or-toast).

## Uso

<demo>
  <u-main>
    <u-row>
      <u-column cols="auto">
        <u-button :loading="isSaving" data-testid="btn-confirm" @click="save">
          Salvar alterações
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button :loading="isRemoving" data-testid="btn-destructive" color="danger" @click="remove">
          Excluir paciente
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button :loading="isFailing" data-testid="btn-failure" color="danger" variant="secondary" @click="fail">
          Excluir com falha
        </u-button>
      </u-column>
    </u-row>
    <p data-testid="confirm-result">Resultado: {{ result }}</p>
  </u-main>
</demo>

### Confirmação

O diálogo apresenta os botões "Cancelar" e "Confirmar", com o foco inicial em "Cancelar".

A partir do terceiro parâmetro, `confirm` repassa os parâmetros para a ação, assim como o `run` do [Run or toast](./use-run-or-toast). O `isRunning` indica se a ação está em execução.

```vue
<template>
  <u-main>
    <u-button :loading="isRunning" @click="save">Salvar alterações</u-button>
    <p>Resultado: {{ result }}</p>
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useConfirm } from "@nexdom/uimed-vue/composables";

const { confirm, isRunning } = useConfirm();
const result = ref<string | false>();

function saveChanges(changes: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${changes} salvas`), 1500);
  });
}

async function save() {
  result.value = await confirm(
    { title: "Salvar alterações", message: "Deseja salvar as alterações feitas no cadastro?" },
    saveChanges,
    "Alterações",
  );
}
</script>
```

### Ação destrutiva

Personalize os textos dos botões com `confirmText` e `cancelText`, e a cor do botão de confirmação com `color`.

```vue
<template>
  <u-main>
    <u-button :loading="isRunning" color="danger" @click="remove">Excluir paciente</u-button>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useConfirm } from "@nexdom/uimed-vue/composables";

const { confirm, isRunning } = useConfirm();

async function remove() {
  await confirm(
    {
      title: "Excluir paciente",
      message: "Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      cancelText: "Manter",
      color: "danger",
    },
    () => new Promise((resolve) => setTimeout(() => resolve("Paciente excluído"), 1500)),
  );
}
</script>
```

### Falha na ação

```vue
<template>
  <u-main>
    <u-button :loading="isRunning" color="danger" variant="secondary" @click="fail">
      Excluir com falha
    </u-button>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useConfirm } from "@nexdom/uimed-vue/composables";

const { confirm, isRunning } = useConfirm();

async function fail() {
  await confirm(
    { title: "Excluir paciente", message: "Esta ação não pode ser desfeita.", color: "danger" },
    () =>
      new Promise((_, reject) => {
        const error = new Error("Não foi possível excluir o paciente.");
        setTimeout(() => reject(error), 1500);
      }),
  );
}
</script>
```

### Fechando o diálogo

Além do botão de cancelamento, o usuário pode fechar o diálogo pela tecla `Esc` ou clicando fora dele, exceto enquanto a ação estiver em execução. Nesses casos, `confirm` devolve `false`.

O botão "voltar" do navegador também fecha o diálogo, sem sair da página, em aplicações que usam o [Vue Router](https://router.vuejs.org/). A exceção é quando o "voltar" leva a uma página aberta com `router.replace`, como a página pela qual o usuário entrou na aplicação: nesse caso, a navegação acontece e o diálogo continua aberto.

## Ver também

- Consulte a referência de [API do useConfirm](../../api/composables/use-confirm) para mais informações.
- Para apresentar mensagens ou perguntas sem executar uma ação, use a composable [useDialog](./use-dialog).

<script lang="ts" setup>
  import { ref } from "vue";
  import { UMain, URow, UColumn, UButton } from "../../../dist/components.js";
  import { useConfirm } from "../../../dist/composables.js";

  const { confirm: confirmSave, isRunning: isSaving } = useConfirm();
  const { confirm: confirmRemove, isRunning: isRemoving } = useConfirm();
  const { confirm: confirmFailure, isRunning: isFailing } = useConfirm();
  const result = ref();

  function saveChanges(changes: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`${changes} salvas`), 1500);
    });
  }

  async function save() {
    result.value = await confirmSave(
      { title: "Salvar alterações", message: "Deseja salvar as alterações feitas no cadastro?" },
      saveChanges,
      "Alterações",
    );
  }

  async function remove() {
    result.value = await confirmRemove(
      {
        title: "Excluir paciente",
        message: "Esta ação não pode ser desfeita.",
        confirmText: "Excluir",
        cancelText: "Manter",
        color: "danger",
      },
      () => new Promise((resolve) => setTimeout(() => resolve("Paciente excluído"), 1500)),
    );
  }

  async function fail() {
    result.value = await confirmFailure(
      { title: "Excluir paciente", message: "Esta ação não pode ser desfeita.", color: "danger" },
      () => new Promise((_, reject) => {
        const error = new Error("Não foi possível excluir o paciente.");
        setTimeout(() => reject(error), 1500);
      }),
    );
  }
</script>
