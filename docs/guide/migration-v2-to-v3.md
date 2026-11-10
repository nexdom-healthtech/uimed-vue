# Migrando da v2 para v3

A versão 3 do UIMed-Vue traz uma única mudança incompatível: o [Conteúdo Expansível](./components/details) (`UDetails`) passou a ser um acordeão de itens (`UDetailsItem`), cada um com o seu próprio título e conteúdo. Os demais componentes, composables e a configuração da aplicação continuam iguais.

## Antes e Depois

### Conteúdo expansível

Na v2, o `UDetails` recebia a prop `title` e exibia um único conteúdo no slot padrão. Na v3, o `UDetails` agrupa um ou mais `UDetailsItem`, e a prop `title` passou para o `UDetailsItem`, que recebe o conteúdo no seu slot padrão. As props `variant` e `loading` continuam no `UDetails` e se aplicam a todos os seus itens.

**Antes (v2):**

```vue
<template>
  <u-details title="Mais informações" variant="secondary">
    <p>Conteúdo exibido ao expandir.</p>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails } from "@nexdom/uimed-vue/components";
</script>
```

**Depois (v3):**

```vue
<template>
  <u-details variant="secondary">
    <u-details-item title="Mais informações">
      <p>Conteúdo exibido ao expandir.</p>
    </u-details-item>
  </u-details>
</template>

<script lang="ts" setup>
import { UDetails, UDetailsItem } from "@nexdom/uimed-vue/components";
</script>
```

Vários `UDetails` seguidos, um para cada conteúdo, podem ser agrupados em um único `UDetails` com um `UDetailsItem` para cada conteúdo. Nesse caso, apenas um item fica expandido por vez: expandir um item recolhe o que estava expandido.

**Antes (v2):**

```vue
<template>
  <u-details title="Dados pessoais">Nome, data de nascimento e documentos</u-details>
  <u-details title="Endereço">Rua, número, bairro e CEP</u-details>
</template>
```

**Depois (v3):**

```vue
<template>
  <u-details>
    <u-details-item title="Dados pessoais">Nome, data de nascimento e documentos</u-details-item>
    <u-details-item title="Endereço">Rua, número, bairro e CEP</u-details-item>
  </u-details>
</template>
```

Quando os conteúdos precisam ser expandidos ao mesmo tempo, mantenha um `UDetails` para cada `UDetailsItem`.

A prop `dataTestid` do `UDetails` continua identificando o acordeão. Para identificar cada item nos testes, informe também a `dataTestid` do `UDetailsItem`.

## Dicas de Migração

1. Procure por todos os usos de `<u-details` com a prop `title` e mova o `title` e o conteúdo para um `<u-details-item>` dentro do `UDetails`
2. Importe o `UDetailsItem` de `@nexdom/uimed-vue/components` nos componentes que usam o `UDetails`
3. Revise os testes que expandem o conteúdo: o título clicável agora é o do `UDetailsItem`, e expandir um item recolhe os outros itens do mesmo `UDetails`

Para mais informações sobre cada componente, consulte a [Documentação da API](../api/).
