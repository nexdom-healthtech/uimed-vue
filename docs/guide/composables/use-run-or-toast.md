# Run or toast

Uma vez que carregamos o [Componente base](../components/root), podemos estar tirando proveito da nossa composable para execução de métodos assíncronos e apresentação de mensagens _toast_ em caso de exceções.

## Uso

<demo>
  <root>
    <row>
      <column cols="auto">
        <btn :loading="isRunningSuccessfully" data-testid="btn-positive" color="positive" @click="runSuccessfully">
          Executar com sucesso
        </btn>
      </column>
      <column cols="auto">
        <btn :loading="isRunningUnsuccessfully" data-testid="btn-danger" color="danger" @click="runUnsuccessfully">
          Executar com falha
        </btn>
      </column>
    </row>
  </root>
</demo>

```vue
<template>
  <root>
    <row>
      <column cols="auto">
        <btn :loading="isRunningSuccessfully" color="positive" @click="runSuccessfully">
          Executar com sucesso
        </btn>
      </column>
      <column cols="auto">
        <btn :loading="isRunningUnsuccessfully" color="danger" @click="runUnsuccessfully">
          Executar com falha
        </btn>
      </column>
    </row>
  </root>
</template>

<script lang="ts" setup>
import { Root, Row, Column, Btn } from "@nexdom/uimed-vue/components";
import { useRunOrToast } from "@nexdom/uimed-vue/composables";

const { run: runSucceeding, isRunning: isRunningSuccessfully } = useRunOrToast();
const { run: runFailing, isRunning: isRunningUnsuccessfully } = useRunOrToast();

function runSuccessfully() {
  runSucceeding(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 1500);
      }),
  );
}

function runUnsuccessfully() {
  runFailing(
    () =>
      new Promise((_, reject) => {
        const error = new Error("Ops! Algo deu errado.");
        setTimeout(() => reject(error), 1500);
      }),
  );
}
</script>
```

## Ver também

Consulte a referência de [API do useRunOrToast](../../api/composables/use-run-or-toast) para mais informações.

<script lang="ts" setup>
  import { Root, Row, Column, Btn } from "../../../dist/components.js";
  import { useRunOrToast } from "../../../dist/composables.js";

  const { run: runSucceeding, isRunning: isRunningSuccessfully } = useRunOrToast();
  const { run: runFailing, isRunning: isRunningUnsuccessfully } = useRunOrToast();

  function runSuccessfully() {
    runSucceeding(() => new Promise(resolve => {
      setTimeout(resolve, 1500);
    }));
  }

  function runUnsuccessfully() {
    runFailing(() => new Promise((_,reject) => {
      const error = new Error("Ops! Algo deu errado.");
      setTimeout(() => reject(error), 1500);
    }));
  }
</script>
