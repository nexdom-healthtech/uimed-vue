# useRunOrToast

Composable para execução de métodos assíncronos e apresentação de mensagens, tipo _toast_, em caso de falha.

## Tipo

```ts
function useRunOrToast(): {
  run: <T extends (...args: Parameters<T>) => PromiseLike<Awaited<ReturnType<T>>>>(
    toRun: T,
    ...params: Parameters<T>
  ) => Promise<Awaited<ReturnType<T>> | false>;
  isRunning: import("vue").ComputedRef<boolean>;
};
```

## Detalhes

Retorna uma função (`run`) e uma [`computed`](https://vuejs.org/guide/essentials/computed.html) (`isRunning`) para monitorar a execução da função.

A função (`run`) espera receber um parâmetro com a função que deverá ser executada (`callback`), então devolverá o retorno dessa função.

Se houver qualquer erro durante a execução da função (`run`), a mesma irá chamar o [`toast`](./use-toast) e apresentar o erro, retornando `false` em seguida.

## Exemplo

```vue
<template>
  <root>
    <!-- ... -->
  </root>
</template>
<script lang="ts" setup>
import { Root } from "@nexdom/uimed-vue/components";
import { useRunOrToast } from "@nexdom/uimed-vue/composables";

const { run, isRunning } = useRunOrToast();

// Apresenta: false
console.log(isRunning.value);

const promise = run(() => someFunction(param1, param2));

// Apresenta: true
console.log(isRunning.value);

const response = await promise;

// Apresenta: false
console.log(isRunning.value);

if (response === false) {
  // Executa algo em caso de falha no método.
} else {
  // Executa algo quando o método executa com sucesso.
}
</script>
```
