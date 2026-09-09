# Toasts

Uma vez que carregamos o [Componente base](../components/root), podemos estar tirando proveito da nossa composable para apresentação de mensagens _toast_.

## Uso

<demo>
  <root>
    <row>
      <column cols="auto">
        <btn data-testid="btn-positive" color="positive" @click="toast({ message: 'Mensagem positiva.', color: 'positive' })">
          Positive
        </btn>
      </column>
      <column cols="auto">
        <btn
          data-testid="btn-informative"
          color="informative"
          @click="toast({ message: 'Mensagem informativa.', color: 'informative' })"
        >
          Informative
        </btn>
      </column>
      <column cols="auto">
        <btn data-testid="btn-caution" color="caution" @click="toast({ message: 'Mensagem de atenção.', color: 'caution' })">
          Caution
        </btn>
      </column>
      <column cols="auto">
        <btn data-testid="btn-danger" color="danger" @click="toast({ message: 'Mensagem de perigo.', color: 'danger' })">
          Danger
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
        <btn color="positive" @click="toast({ message: 'Mensagem positiva.', color: 'positive' })">
          Positive
        </btn>
      </column>
      <column cols="auto">
        <btn
          color="informative"
          @click="toast({ message: 'Mensagem informativa.', color: 'informative' })"
        >
          Informative
        </btn>
      </column>
      <column cols="auto">
        <btn color="caution" @click="toast({ message: 'Mensagem de atenção.', color: 'caution' })">
          Caution
        </btn>
      </column>
      <column cols="auto">
        <btn color="danger" @click="toast({ message: 'Mensagem de perigo.', color: 'danger' })">
          Danger
        </btn>
      </column>
    </row>
  </root>
</template>

<script lang="ts" setup>
import { Root, Row, Column, Btn } from "@nexdom/uimed-vue/components";
import { useToast } from "@nexdom/uimed-vue/composables";

const { toast } = useToast();
</script>
```

## Ver também

Consulte a referência de [API do useToast](../../api/composables/use-toast) para mais informações.

<script lang="ts" setup>
  import { Root, Row, Column, Btn } from "../../../dist/components.js";
  import { useToast } from "../../../dist/composables.js";

  const { toast } = useToast();
</script>
