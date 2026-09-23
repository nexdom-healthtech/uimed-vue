# Migrando de v1 para v2

A versão 2 do UIMed-Vue introduz uma mudança significativa: todos os componentes exportados agora possuem um prefixo `U`, padronizando a forma como você importa e utiliza os componentes. Além disso, alguns componentes receberam nomes mais descritivos internamente.

## Mapa de Renomeação

| Nome anterior | Novo nome         |
| ------------- | ----------------- |
| `Btn`         | `UButton`         |
| `Frm`         | `UForm`           |
| `Root`        | `UMain`           |
| `ContentSet`  | `USection`        |
| `Content`     | `USectionContent` |
| `Container`   | `UContainer`      |
| `Row`         | `URow`            |
| `Column`      | `UColumn`         |
| `TextField`   | `UTextField`      |

## Antes e Depois

### Importações

**Antes (v1):**

```js
import { Root, Btn, Row, Column, TextField } from "@nexdom/uimed-vue/components";
```

**Depois (v2):**

```js
import { UMain, UButton, URow, UColumn, UTextField } from "@nexdom/uimed-vue/components";
```

### Template

**Antes (v1):**

```vue
<template>
  <root>
    <row>
      <column>
        <btn @click="handleClick">Clique aqui</btn>
      </column>
    </row>
  </root>
</template>
```

**Depois (v2):**

```vue
<template>
  <u-main>
    <u-row>
      <u-column>
        <u-button @click="handleClick">Clique aqui</u-button>
      </u-column>
    </u-row>
  </u-main>
</template>
```

## Dicas de Migração

1. Procure por todas as importações antigas e substitua pelos novos nomes com o prefixo `U`
2. Atualize todos os templates para usar as novas tags em kebab-case (ex: `<u-button>` em vez de `<btn>`)
3. Os tipos de props não são mais exportados pela biblioteca. Utilize `ComponentProps`, de [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers), para obtê-los a partir do componente (veja [Tipagem de props](./getting-started#tipagem-de-props))

Para mais informações sobre cada componente, consulte a [Documentação da API](../api/).
