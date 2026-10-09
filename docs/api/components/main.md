---
outline: deep
---

# UMain

Componente principal do projeto.

Responsável por carregar o menu superior, o menu de navegação lateral, o rodapé, componentes para as composables de [Toasts](../composables/use-toast), [Diálogos](../composables/use-dialog), [Confirmações](../composables/use-confirm) e [Alterações não salvas](../composables/use-unsaved-changes) e os estilos para os demais componentes.

## Props

| Prop             | Tipo                                | Padrão  | Descrição                                                                                                                                                                      |
| ---------------- | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataTestid`     | `string`                            |         | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                  |
| `logo`           | `string`                            |         | URL utilizada para carregar a logo que será apresentada. A logo é decorativa (`alt=""`): o título do menu superior (`appBar.title`) identifica a aplicação.                    |
| `appBar`         | [`AppBar`](#appbar)                 |         | Conjunto de propriedades para aplicar à barra superior.                                                                                                                        |
| `navigationMenu` | [`NavigationMenu`](#navigationmenu) |         | Conjunto de propriedades para aplicar ao menu lateral de navegação.                                                                                                            |
| `footer`         | [`Footer`](#footer)                 |         | Conjunto de propriedades para aplicar ao rodapé, fixo na parte inferior da tela. **O rodapé será ocultado sempre que essa prop for omitida ou o seu `description` for vazio.** |
| `loading`        | `boolean`                           | `false` | Exibe skeletons no lugar das ações do menu superior e dos itens do menu de navegação enquanto os dados são carregados. O conteúdo da página não é afetado.                     |

### `AppBar`

| Prop                | Tipo                                                                                              | Padrão  | Descrição                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataTestid`        | `string`                                                                                          |         | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                            |
| `title`             | `string`                                                                                          |         | Título para o cabeçalho, seja da página atual ou da aplicação como um todo. É anunciado aos leitores de tela como o título de nível 1 da página.                                                                         |
| `help`              | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |         | Rota para direcionar o usuário em necessidade de "ajuda", podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/help"`). **A opção será ocultada sempre que essa prop for omitida.** |
| `user`              | [`User`](#user)                                                                                   |         | Conjunto de propriedades para configurar o menu do usuário. **A opção será ocultada sempre que essa prop for omitida.**                                                                                                  |
| `notifications`     | [`notification[]`](#notification)                                                                 |         | Lista de notificações para apresentar no menu superior. **A opção será ocultada sempre que essa prop for omitida** (uma lista vazia ainda exibe o botão, com uma mensagem indicando a ausência de notificações).         |
| `notificationsOpen` | `boolean`                                                                                         | `false` | Reflete e permite controlar externamente se o menu de notificações está aberto.                                                                                                                                          |

#### `User`

| Prop       | Tipo                         | Padrão | Descrição                                                                                                                 |
| ---------- | ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `title`    | `string`                     |        | Título para o menu do usuário. Geralmente o nome completo do mesmo.                                                       |
| `subtitle` | `string`                     |        | Subtítulo para o menu do usuário, como e-mail ou _username_.                                                              |
| `img`      | `string`                     |        | URL da imagem para identificar o usuário. **Será apresentada uma imagem genérica em caso de omissão desta prop.**         |
| `options`  | `(ParentOption \| Option)[]` |        | Lista de ações ([`ParentOption`](#parentoption)) e/ou opções ([`Option`](#option)) para apresentar com o menu do usuário. |

##### `ParentOption`

| Prop          | Tipo                  | Padrão | Descrição                                                    |
| ------------- | --------------------- | ------ | ------------------------------------------------------------ |
| `description` | `string`              |        | Título do agrupador de opções ([opção](#option)).            |
| `items`       | [`Option[]`](#option) |        | Lista de [opções](#option) que serão agrupadas neste tópico. |

##### `Option`

| Prop          | Tipo                                                                                              | Padrão | Descrição                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | `string`                                                                                          |        | Título/descrição da ação.                                                                                                                            |
| `route`       | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |        | Rota para direcionar o usuário ao acionar a ação, podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/help"`). |
| `action`      | `() => void`                                                                                      |        | Função que será executada quando o usuário clicar na ação.                                                                                           |

#### `Notification`

| Prop       | Tipo      | Padrão | Descrição                                                                                                                                                     |
| ---------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | `string`  |        | Texto principal descrevendo a notificação.                                                                                                                    |
| `subtitle` | `string`  |        | Texto complementar com detalhes adicionais.                                                                                                                   |
| `read`     | `boolean` |        | Indica se a notificação já foi lida. **Notificações não lidas são destacadas com um indicador.**                                                              |
| `when`     | `string`  |        | Texto livre indicando quando a notificação foi gerada, apresentado sem formatação (exemplo: `"10:30"`, `"Ontem"`). **Será ocultado quando omitido ou vazio.** |

### `NavigationMenu`

O menu conta com um campo de busca, focado pelo atalho `Ctrl + K` (`⌘ + K` no macOS), que também abre o menu. A tecla `Esc` fecha o menu enquanto o foco está nele.

| Prop         | Tipo                                             | Padrão | Descrição                                                                                                                 |
| ------------ | ------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `dataTestid` | `string`                                         |        | Aplica atributo `data-testid` para testes sobre o componente.                                                             |
| `items`      | `(NavigationMenuItem \| NavigationMenuParent)[]` |        | Lista de [itens](#navigationmenuitem) e/ou [grupos de itens](#navigationmenuparent) para apresentar no menu de navegação. |

#### `NavigationMenuParent`

| Prop          | Tipo                                          | Padrão | Descrição                                                                                            |
| ------------- | --------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `description` | `string`                                      |        | Título do agrupador de itens ([item](#navigationmenuitem)).                                          |
| `icon`        | [`Icon`](../../guide/icons)                   |        | Ícone exibido antes da descrição do agrupador. Um dos nomes listados em [Ícones](../../guide/icons). |
| `items`       | [`NavigationMenuItem[]`](#navigationmenuitem) |        | Lista de [itens](#navigationmenuitem) que serão agrupados neste tópico.                              |

#### `NavigationMenuItem`

| Prop          | Tipo                                                                                              | Padrão | Descrição                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `description` | `string`                                                                                          |        | Título/descrição do item.                                                                                                                        |
| `icon`        | [`Icon`](../../guide/icons)                                                                       |        | Ícone exibido antes da descrição do item. Um dos nomes listados em [Ícones](../../guide/icons).                                                  |
| `route`       | [`RouteLocationRaw`](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html) \| `string` |        | Rota para direcionar o usuário ao clicar no item, podendo essa ser uma rota externa (exemplo: `"https://google.com"`) ou local (exemplo: `"/"`). |
| `action`      | `() => void`                                                                                      |        | Função que será executada quando o usuário clicar no item.                                                                                       |

### `Footer`

| Prop          | Tipo     | Padrão | Descrição                                                                                                                          |
| ------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `dataTestid`  | `string` |        | Aplica atributo `data-testid` para testes sobre o rodapé.                                                                          |
| `description` | `string` |        | Texto exibido no rodapé, por exemplo a versão da aplicação (`"Versão 1.4.2"`). **O rodapé será ocultado quando omitido ou vazio.** |

## Eventos

| Event                      | Retorno   | Descrição                                                      |
| -------------------------- | --------- | -------------------------------------------------------------- |
| `update:notificationsOpen` | `boolean` | Emitido sempre que o menu de notificações é aberto ou fechado. |

## Slots

| Slot      | Descrição                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | Conteúdo exibido dentro do componente, que ocupa toda a altura visível abaixo do menu superior (e acima do rodapé, quando exibido). Utilize uma [`URow`](./grid/row) com `fullHeight` para ocupá-la. |

## Exemplo

```vue
<template>
  <u-main :app-bar="appBar" v-model:notifications-open="notificationsOpen">
    <!-- ... -->
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const notificationsOpen = ref(false);

const appBar: NonNullable<MainProps["appBar"]> = {
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
      {
        description: "GitHub NEXDOM",
        route: "https://github.com/nexdom-healthtech",
      },
      { description: "Sair", action: () => window.alert("Saindo...") },
    ],
  },
};
</script>
```
