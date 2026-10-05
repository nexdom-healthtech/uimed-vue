# Migrando da v1 para v2

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

### Notificações do menu superior

A propriedade `date` das notificações do menu superior (`appBar.notifications`) foi substituída por `when`, um texto livre apresentado exatamente como informado. Assim, a aplicação passa a decidir como indicar quando a notificação foi gerada (exemplo: `"10:30"`, `"Ontem"` ou `"Há 5 minutos"`).

**Antes (v1):**

```ts
const appBar = {
  title: "Minha aplicação",
  notifications: [{ title: "Nova versão", date: new Date() }],
};
```

**Depois (v2):**

```ts
const appBar = {
  title: "Minha aplicação",
  notifications: [{ title: "Nova versão", when: "10:30" }],
};
```

Para manter a formatação apresentada na v1 (horário para notificações de hoje, "Ontem" para as de ontem e a data completa para as demais), utilize as funções de [`@nexdom/shared`](https://nexdom-healthtech.github.io/shared/):

```ts
import { formatDateTime, toPeriodInterval } from "@nexdom/shared/utils";

function formatNotificationWhen(date: Date) {
  const interval = toPeriodInterval(date);
  const wasThisMonth = interval.months === 0 && interval.years === 0;

  if (wasThisMonth && interval.days === 0) return formatDateTime(date, "HH:mm");
  if (wasThisMonth && interval.days === 1) return "Ontem";

  return formatDateTime(date, "DD/MM/YYYY");
}

const appBar = {
  title: "Minha aplicação",
  notifications: [{ title: "Nova versão", when: formatNotificationWhen(new Date()) }],
};
```

### Alinhamento vertical das colunas

Na v1, as colunas de uma `Row` eram esticadas até a altura da coluna mais alta da linha. Na v2, a prop `align` da `URow` controla esse alinhamento e o padrão passou a ser `"start"`: cada coluna mantém a altura do próprio conteúdo e fica alinhada ao topo. Para manter o comportamento da v1, como em cartões lado a lado que devem ter a mesma altura, utilize `align="stretch"` (veja [Alinhamento vertical das colunas](./components/layout#alinhamento-vertical-das-colunas)).

**Antes (v1):**

```vue
<template>
  <row>
    <column cols="6">
      <content-set title="Consultas" full-height>
        <!-- conteúdo curto -->
      </content-set>
    </column>
    <column cols="6">
      <content-set title="Exames" full-height>
        <!-- conteúdo mais longo -->
      </content-set>
    </column>
  </row>
</template>
```

**Depois (v2):**

```vue
<template>
  <u-row align="stretch">
    <u-column cols="6">
      <u-section title="Consultas" full-height>
        <!-- conteúdo curto -->
      </u-section>
    </u-column>
    <u-column cols="6">
      <u-section title="Exames" full-height>
        <!-- conteúdo mais longo -->
      </u-section>
    </u-column>
  </u-row>
</template>
```

## Dicas de Migração

1. Procure por todas as importações antigas e substitua pelos novos nomes com o prefixo `U`
2. Atualize todos os templates para usar as novas tags em kebab-case (ex: `<u-button>` em vez de `<btn>`)
3. Os tipos de props não são mais exportados pela biblioteca. Utilize `ComponentProps`, de [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers), para obtê-los a partir do componente (veja [Tipagem de props](./getting-started#tipagem-de-props))
4. Substitua a propriedade `date` das notificações do menu superior por `when`, informando o texto já formatado (veja [Notificações do menu superior](#notificacoes-do-menu-superior))
5. Adicione `align="stretch"` às `URow` cujas colunas precisam ter a mesma altura (veja [Alinhamento vertical das colunas](#alinhamento-vertical-das-colunas))

Para mais informações sobre cada componente, consulte a [Documentação da API](../api/).
