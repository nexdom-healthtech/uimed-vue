# Toasts

Uma vez que carregamos o [Componente base](../components/main), podemos estar tirando proveito da nossa composable para apresentação de mensagens _toast_.

## Uso

<demo>
  <u-main>
    <u-row>
      <u-column cols="auto">
        <u-button data-testid="btn-positive" color="positive" @click="toast({ message: 'Mensagem positiva.', color: 'positive' })">
          Positive
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button
          data-testid="btn-informative"
          color="informative"
          @click="toast({ message: 'Mensagem informativa.', color: 'informative' })"
        >
          Informative
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button data-testid="btn-caution" color="caution" @click="toast({ message: 'Mensagem de atenção.', color: 'caution' })">
          Caution
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button data-testid="btn-danger" color="danger" @click="toast({ message: 'Mensagem de perigo.', color: 'danger' })">
          Danger
        </u-button>
      </u-column>
    </u-row>
  </u-main>
</demo>

```vue
<template>
  <u-main>
    <u-row>
      <u-column cols="auto">
        <u-button
          color="positive"
          @click="toast({ message: 'Mensagem positiva.', color: 'positive' })"
        >
          Positive
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button
          color="informative"
          @click="toast({ message: 'Mensagem informativa.', color: 'informative' })"
        >
          Informative
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button
          color="caution"
          @click="toast({ message: 'Mensagem de atenção.', color: 'caution' })"
        >
          Caution
        </u-button>
      </u-column>
      <u-column cols="auto">
        <u-button
          color="danger"
          @click="toast({ message: 'Mensagem de perigo.', color: 'danger' })"
        >
          Danger
        </u-button>
      </u-column>
    </u-row>
  </u-main>
</template>

<script lang="ts" setup>
import { UMain, URow, UColumn, UButton } from "@nexdom/uimed-vue/components";
import { useToast } from "@nexdom/uimed-vue/composables";

const { toast } = useToast();
</script>
```

## Ver também

Consulte a referência de [API do useToast](../../api/composables/use-toast) para mais informações.

<script lang="ts" setup>
  import { UMain, URow, UColumn, UButton } from "../../../dist/components.js";
  import { useToast } from "../../../dist/composables.js";

  const { toast } = useToast();
</script>
