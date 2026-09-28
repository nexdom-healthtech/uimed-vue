# useConfirm

Composable para execução de ações somente após a confirmação do usuário em um diálogo.

## Tipo

```ts
type ColorVariant = "primary" | "secondary" | "positive" | "informative" | "caution" | "danger";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: ColorVariant;
}

function useConfirm(): {
  confirm: <F extends (...args: Parameters<F>) => PromiseLike<Awaited<ReturnType<F>>>>(
    options: ConfirmOptions,
    action: F,
    ...params: Parameters<F>
  ) => Promise<Awaited<ReturnType<F>> | false>;
  isRunning: import("vue").ComputedRef<boolean>;
};
```

## Detalhes

Retorna uma função (`confirm`) e uma [`computed`](https://vuejs.org/guide/essentials/computed.html) (`isRunning`) para monitorar a execução da ação. Cada chamada de `useConfirm` tem o seu próprio `isRunning`.

A função (`confirm`) apresenta um diálogo com os botões "Cancelar" e "Confirmar". A ação (`action`) é obrigatória e só é executada, com os parâmetros seguintes (`params`), depois que o usuário clica em "Confirmar". Enquanto ela executa:

- o botão de confirmação apresenta um indicador de carregamento;
- o botão de cancelamento fica desabilitado;
- o diálogo não pode ser fechado;
- `isRunning` é `true`.

Ao terminar a execução, o diálogo fecha. Se houver qualquer erro durante a execução, a mensagem do erro é apresentada em um [`toast`](./use-toast), assim como no [`useRunOrToast`](./use-run-or-toast).

Os diálogos de `confirm` compartilham a fila de diálogos do [`useDialog`](./use-dialog).

### `ConfirmOptions`

| Opção         | Tipo                                                                                         | Padrão        | Descrição                                                        |
| ------------- | -------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| `title`       | `string`                                                                                     |               | Título do diálogo, em texto simples (HTML não é interpretado).   |
| `message`     | `string`                                                                                     |               | Mensagem do diálogo, em texto simples (HTML não é interpretado). |
| `confirmText` | `string`                                                                                     | `"Confirmar"` | Texto do botão de confirmação.                                   |
| `cancelText`  | `string`                                                                                     | `"Cancelar"`  | Texto do botão de cancelamento.                                  |
| `color`       | `"primary"` \| `"secondary"` \| `"positive"` \| `"informative"` \| `"caution"` \| `"danger"` | `"primary"`   | Cor do botão de confirmação.                                     |

### Retorno

`confirm` resolve o retorno da ação, ou `false` quando:

- a ação falha;
- o usuário clica no botão de cancelamento;
- o usuário pressiona a tecla `Esc` ou clica fora do diálogo;
- o usuário usa o botão "voltar" do navegador, em aplicações que usam o [Vue Router](https://router.vuejs.org/), exceto quando ele leva a uma página aberta com `router.replace` (como a página pela qual o usuário entrou na aplicação).

### Acessibilidade

O diálogo usa o papel `alertdialog`. O foco inicia no botão de cancelamento, fica restrito ao diálogo enquanto ele estiver aberto e volta ao elemento de origem quando ele fecha.

## Exemplo

```vue
<template>
  <u-main>
    <!-- ... -->
  </u-main>
</template>
<script lang="ts" setup>
import { UMain } from "@nexdom/uimed-vue/components";
import { useConfirm } from "@nexdom/uimed-vue/composables";

const { confirm, isRunning } = useConfirm();

const removed = await confirm(
  {
    title: "Excluir paciente",
    message: "Esta ação não pode ser desfeita.",
    confirmText: "Excluir",
    color: "danger",
  },
  () => api.deletePatient(id),
);

if (removed === false) {
  // Executa algo quando o usuário cancela ou a ação falha.
} else {
  // Executa algo quando a ação executa com sucesso.
}
</script>
```
