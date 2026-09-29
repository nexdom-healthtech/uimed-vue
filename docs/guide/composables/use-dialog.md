# Diálogos

Uma vez que carregamos o [Componente base](../components/main), podemos estar tirando proveito da nossa composable para apresentação de diálogos, que interrompem o usuário com uma mensagem e aguardam sua resposta.

Os diálogos são apresentados um de cada vez, na ordem em que foram solicitados. Se um diálogo for solicitado enquanto outro estiver aberto, ele será apresentado assim que o atual for fechado.

## Uso

<demo>
  <u-main>
    <u-row>
      <u-column cols="auto">
        <u-button data-testid="btn-simple" @click="openSimple">
          Diálogo simples
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button data-testid="btn-actions" @click="openWithActions">
          Ações personalizadas
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button data-testid="btn-queue" variant="secondary" @click="openQueue">
          Dois diálogos seguidos
        </u-button>
      </u-column>
    </u-row>
    <p data-testid="dialog-answer">Resposta: {{ answer ?? "nenhuma" }}</p>
  </u-main>
</demo>

### Diálogo simples

Sem a opção `actions`, o diálogo apresenta apenas o botão "Fechar" e resolve `undefined`.

```vue
<template>
  <u-main>
    <u-button @click="openSimple">Diálogo simples</u-button>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useDialog } from "@nexdom/uimed-vue/composables";

const { dialog } = useDialog();

async function openSimple() {
  await dialog({
    title: "Cadastro enviado",
    message: "Seu cadastro foi enviado para análise.",
  });
}
</script>
```

### Ações personalizadas

Cada ação da opção `actions` vira um botão, na ordem informada e alinhado à direita. O diálogo resolve o `value` da ação clicada.

Por padrão, a última ação usa a variante `primary` e as demais, a variante `ghost`.

```vue
<template>
  <u-main>
    <u-button @click="openWithActions">Ações personalizadas</u-button>
    <p>Resposta: {{ answer ?? "nenhuma" }}</p>
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useDialog } from "@nexdom/uimed-vue/composables";

const { dialog } = useDialog();
const answer = ref<string>();

async function openWithActions() {
  answer.value = await dialog({
    title: "Sessão expirando",
    message: "Sua sessão irá expirar em breve. Deseja continuar conectado?",
    actions: [
      { text: "Sair", value: "sair" },
      { text: "Continuar conectado", value: "continuar" },
    ],
  });
}
</script>
```

### Fechando o diálogo

Além dos botões, o usuário pode fechar o diálogo pela tecla `Esc` ou clicando fora dele. Nesses casos, o diálogo resolve `undefined` ao fim da animação de fechamento.

O botão "voltar" do navegador também fecha o diálogo, sem sair da página, em aplicações que usam o [Vue Router](https://router.vuejs.org/). A exceção é quando o "voltar" leva a uma página aberta com `router.replace`, como a página pela qual o usuário entrou na aplicação: nesse caso, a navegação acontece e o diálogo continua aberto.

### Fila de diálogos

```vue
<template>
  <u-main>
    <u-button variant="secondary" @click="openQueue">Dois diálogos seguidos</u-button>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, UButton } from "@nexdom/uimed-vue/components";
import { useDialog } from "@nexdom/uimed-vue/composables";

const { dialog } = useDialog();

function openQueue() {
  dialog({ title: "Primeiro diálogo", message: "Este diálogo é apresentado primeiro." });
  dialog({ title: "Segundo diálogo", message: "Este diálogo aguardou o primeiro ser fechado." });
}
</script>
```

## Ver também

- Consulte a referência de [API do useDialog](../../api/composables/use-dialog) para mais informações.
- Para confirmar uma ação antes de executá-la, use a composable [useConfirm](./use-confirm).
- Para apresentar conteúdo próprio, como um formulário, em uma janela modal, use o componente [Dialog](../components/dialog).

<script lang="ts" setup>
  import { ref } from "vue";
  import { UMain, URow, UColumn, UButton } from "../../../dist/components.js";
  import { useDialog } from "../../../dist/composables.js";

  const { dialog } = useDialog();
  const answer = ref();

  async function openSimple() {
    await dialog({
      title: "Cadastro enviado",
      message: "Seu cadastro foi enviado para análise.",
    });
  }

  async function openWithActions() {
    answer.value = await dialog({
      title: "Sessão expirando",
      message: "Sua sessão irá expirar em breve. Deseja continuar conectado?",
      actions: [
        { text: "Sair", value: "sair" },
        { text: "Continuar conectado", value: "continuar" },
      ],
    });
  }

  function openQueue() {
    dialog({ title: "Primeiro diálogo", message: "Este diálogo é apresentado primeiro." });
    dialog({ title: "Segundo diálogo", message: "Este diálogo aguardou o primeiro ser fechado." });
  }
</script>
