---
outline: deep
---

# Root

Componente principal do projeto.

Responsável por carregar o menu superior, componentes para as composables de [Toasts](../composables/use-toast) e os estilos para os demais componentes.

## Props

| Prop         | Tipo                            | Padrão | Descrição                                                     |
| ------------ | ------------------------------- | ------ | ------------------------------------------------------------- |
| `dataTestid` | `string`                        |        | Aplica atributo `data-testid` para testes sobre o componente. |
| `appBar`     | [`AppBarConfig`](#appbarconfig) |        | Conjunto de propriedades para aplicar à barra superior.       |

### `AppBarConfig`

| Prop         | Tipo                                                                                              | Padrão | Descrição                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataTestid` | `string`                                                                                          |        | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                            |
| `title`      | `string`                                                                                          |        | Título para o cabeçalho, seja da página atual ou da aplicação como um todo.                                                                                                                                              |
| `help`       | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |        | Rota para direcionar o usuário em necessidade de "ajuda", podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/help"`). **A opção será ocultada sempre que essa prop for omitida.** |
| `user`       | [`AppBarUserConfig`](#appbaruserconfig)                                                           |        | Conjunto de propriedades para configurar o menu do usuário. **A opção será ocultada sempre que essa prop for omitida.**                                                                                                  |

#### `AppBarUserConfig`

| Prop       | Tipo                     | Padrão | Descrição                                                                                                         |
| ---------- | ------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `title`    | `string`                 |        | Título para o menu do usuário. Geralmente o nome completo do mesmo.                                               |
| `subtitle` | `string`                 |        | Subtítulo para o menu do usuário, como e-mail ou _username_.                                                      |
| `img`      | `string`                 |        | URL da imagem para identificar o usuário. **Será apresentada uma imagem genérica em caso de omissão desta prop.** |
| `options`  | `ParentOptionOrOption[]` |        | Lista de ações ([`ParentOption`](#parentoption) e/ou [`Option`](#option)) para apresentar com o menu do usuário.  |

##### `ParentOption`

| Prop          | Tipo                  | Padrão | Descrição                                                               |
| ------------- | --------------------- | ------ | ----------------------------------------------------------------------- |
| `description` | `string`              |        | Título do agrupador de opções ([`Option`](#option)).                    |
| `items`       | [`Option[]`](#option) |        | Lista de opções ([`Option`](#option)) que serão agrupadas neste tópico. |

##### `Option`

| Prop          | Tipo                                                                                              | Padrão | Descrição                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | `string`                                                                                          |        | Título/descrição da ação.                                                                                                                            |
| `route`       | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |        | Rota para direcionar o usuário ao acionar a ação, podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/help"`). |
| `action`      | `() => void`                                                                                      |        | Função que será executada quando o usuário clicar na ação.                                                                                           |

## Slots

| Slot      | Descrição                              |
| --------- | -------------------------------------- |
| `default` | Conteúdo exibido dentro do componente. |

## Exemplo

```vue
<template>
  <root :app-bar="appBar">
    <!-- ... -->
  </root>
</template>

<script lang="ts" setup>
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const appBar: AppBarConfig = {
  title: "Menu superior",
  help: "https://google.com",
  dataTestid: "root-app-bar",
  user: {
    title: "Rafael Perini",
    subtitle: "UIMed-Vue Co-Creator",
    img: "/uimed-vue/avatar.jpg",
    options: [
      {
        description: "Bibliotecas",
        items: [
          {
            description: "Pkg-template",
            route: "https://nexdom-healthtech.github.io/pkg-template/",
          },
          {
            description: "Shared",
            route: "https://nexdom-healthtech.github.io/shared/",
          },
          {
            description: "UIMed-Vue",
            route: "https://nexdom-healthtech.github.io/uimed-vue/",
          },
        ],
      },
      { description: "GitHub NEXDOM", route: "https://github.com/nexdom-healthtech" },
      { description: "Sair", action: () => window.alert("Saindo...") },
    ],
  },
};
</script>
```
