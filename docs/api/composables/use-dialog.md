# useDialog

Composable para apresentação de diálogos.

## Tipo

```ts
type ButtonVariant = "primary" | "secondary" | "ghost";

type ColorVariant = "primary" | "secondary" | "positive" | "informative" | "caution" | "danger";

interface DialogAction<T extends string = string> {
  text: string;
  value: T;
  variant?: ButtonVariant;
  color?: ColorVariant;
}

interface DialogOptions<T extends string = string> {
  title?: string;
  message: string;
  actions?: DialogAction<T>[];
}

function dialog<T extends string = never>(options: DialogOptions<T>): Promise<T | undefined>;

function useDialog(): {
  dialog: typeof dialog;
};
```

## Detalhes

Retorna uma função (`dialog`) para exibir diálogos. Ela devolve uma `Promise` que resolve quando o diálogo é fechado.

Os diálogos são apresentados um de cada vez, na ordem em que foram solicitados, incluindo os de [`useConfirm`](./use-confirm). Diálogos solicitados enquanto nenhum [`UMain`](../components/main) estiver montado aguardam até que um seja montado. Havendo mais de um `UMain` na página, apenas o primeiro montado apresenta os diálogos.

### `DialogOptions`

| Opção     | Tipo                              | Padrão                 | Descrição                                                                   |
| --------- | --------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `title`   | `string`                          |                        | Título do diálogo, em texto simples (HTML não é interpretado).              |
| `message` | `string`                          |                        | Mensagem do diálogo, em texto simples (HTML não é interpretado).            |
| `actions` | [`DialogAction[]`](#dialogaction) | `[{ text: "Fechar" }]` | Botões apresentados no rodapé do diálogo, alinhados à direita, nesta ordem. |

### `DialogAction`

| Opção     | Tipo                                                                                         | Padrão                                       | Descrição                                              |
| --------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `text`    | `string`                                                                                     |                                              | Texto do botão.                                        |
| `value`   | `string`                                                                                     |                                              | Valor devolvido por `dialog` quando o botão é clicado. |
| `variant` | `"primary"` \| `"secondary"` \| `"ghost"`                                                    | `"ghost"`, ou `"primary"` para a última ação | Variante do botão.                                     |
| `color`   | `"primary"` \| `"secondary"` \| `"positive"` \| `"informative"` \| `"caution"` \| `"danger"` | `"primary"`                                  | Cor do botão.                                          |

### Retorno

`dialog` resolve o `value` da ação clicada, ou `undefined` quando o diálogo é fechado:

- pelo botão padrão "Fechar";
- pela tecla `Esc`;
- por um clique fora do diálogo;
- pelo botão "voltar" do navegador, em aplicações que usam o [Vue Router](https://router.vuejs.org/), exceto quando ele leva a uma página aberta com `router.replace` (como a página pela qual o usuário entrou na aplicação).

### Acessibilidade

O foco inicia na primeira ação, fica restrito ao diálogo enquanto ele estiver aberto e volta ao elemento de origem quando ele fecha. O diálogo é identificado pelo título (ou pela mensagem, quando não houver título) e descrito pela mensagem.

## Exemplo

```vue
<template>
  <u-main>
    <!-- ... -->
  </u-main>
</template>
<script lang="ts" setup>
import { UMain } from "@nexdom/uimed-vue/components";
import { useDialog } from "@nexdom/uimed-vue/composables";

const { dialog } = useDialog();

const answer = await dialog({
  title: "Sessão expirando",
  message: "Deseja continuar conectado?",
  actions: [
    { text: "Sair", value: "sair" },
    { text: "Continuar conectado", value: "continuar" },
  ],
});

if (answer === "sair") {
  // Executa algo quando o usuário escolhe sair.
}
</script>
```
