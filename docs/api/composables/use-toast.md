# useToast

Composable para apresentação de mensagens tipo _toast_.

## Tipo

```ts
type FeedbackColorVariant = "positive" | "informative" | "caution" | "danger";

interface ToastOptions {
  message: string;
  color?: FeedbackColorVariant;
}

function toast(options: ToastOptions): void;

function useToast(): {
  toast: typeof toast;
};
```

## Detalhes

Retorna uma função (`toast`) para exibir novas mensagens _toast_. As mensagens são apresentadas pelo [`UMain`](../components/main), que precisa estar montado na página.

### `ToastOptions`

| Opção     | Tipo                                                         | Padrão          | Descrição                   |
| --------- | ------------------------------------------------------------ | --------------- | --------------------------- |
| `message` | `string`                                                     |                 | Texto apresentado no toast. |
| `color`   | `"positive"` \| `"informative"` \| `"caution"` \| `"danger"` | `"informative"` | Cor do toast.               |

## Exemplo

```vue
<template>
  <u-main>
    <!-- ... -->
  </u-main>
</template>
<script lang="ts" setup>
import { UMain } from "@nexdom/uimed-vue/components";
import { useToast } from "@nexdom/uimed-vue/composables";

const { toast } = useToast();
toast({ message: "Olá, Toast!" });
</script>
```
