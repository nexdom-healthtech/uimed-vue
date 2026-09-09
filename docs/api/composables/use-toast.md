# useToast

Composable para apresentação de mensagens tipo _toast_.

## Tipo

```ts
type FeedbackColorVariant = "positive" | "informative" | "caution" | "danger";

interface ToastOptions {
  message: string;
  color?: FeedbackColorVariant;
}

function toast(options: ToastOptions): () => void;

function useToast(): {
  toast: typeof toast;
};
```

## Detalhes

Retorna uma função (`toast`) para exibir novas mensagens _toast_.

Se nenhuma cor (`color`) for informada, o toast assume e mensagem como `"informative"`.

## Exemplo

```vue
<template>
  <root>
    <!-- ... -->
  </root>
</template>
<script lang="ts" setup>
import { Root } from "@nexdom/uimed-vue/components";
import { useToast } from "@nexdom/uimed-vue/composables";

const { toast } = useToast();
toast({ message: "Olá, Toast!" });
</script>
```
