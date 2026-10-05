---
outline: deep
---

# Componente base

O componente destinado a raiz do projeto se chama `Main`.

É responsável por carregar o menu superior, o menu de navegação lateral, os componentes utilizados pelos composables de [Toasts](../composables/use-toast), [Diálogos](../composables/use-dialog) e [Confirmações](../composables/use-confirm) e os estilos necessários para os demais componentes.

## Propriedades

### Logo

A `logo` nos permite provisionar a URL que será utilizada pelo `Main` para orquestrar a apresentação de uma imagem de logo na aplicação.

A logo é decorativa e não é anunciada por leitores de tela, que identificam a aplicação pelo título do menu superior (`title` da prop `app-bar`); por isso, informe o título junto com a `logo`.

<demo contained data-testid="demo-root-logo">
<u-main :appBar="{ title: appBar.title }" :logo>
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar :logo>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const logo = "/uimed-vue/favicon.svg";

const appBar = reactive<NonNullable<MainProps["appBar"]>>({
  title: "Menu superior",
});
</script>
```

### Menu superior

A prop `app-bar` define as configurações para apresentação do menu superior.

Para ocultar o menu superior, basta omitir essa prop.

As ações do menu superior têm nomes fixos para leitores de tela: "Menu de navegação" (que também informa se o menu de navegação está expandido ou recolhido), "Ajuda", "Notificações" e "Menu do usuário". Quando há notificações não lidas, o botão de notificações inclui a quantidade no nome, por exemplo "Notificações (2 não lidas)" ou "Notificações (1 não lida)".

<demo contained>
<u-main :appBar @update:notifications-open="toggleNotifications">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar @update:notifications-open="toggleNotifications">
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar = reactive<NonNullable<MainProps["appBar"]>>({
  title: "Menu superior",
  help: "https://www.google.com",
  notifications: [
    {
      title: "v1.1",
      subtitle: "Nova versão disponível para instalação.",
      when: "10:30",
      read: false,
    },
    {
      title: "v1",
      subtitle: "Nova versão disponível para testes.",
      when: "Ontem",
      read: false,
    },
    {
      title: "vBeta",
      subtitle: "Nova versão disponível para testes.",
      when: "29/09/2026",
      read: true,
    },
    {
      title: "vAlpha",
      subtitle: "Nova versão disponível para testes.",
      when: "28/09/2026",
      read: true,
    },
  ],
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
});

function toggleNotifications(open: boolean) {
  if (!open) {
    appBar.notifications = appBar.notifications?.map((notification) => ({
      ...notification,
      read: true,
    }));
  }
}
</script>
```

### Menu de navegação

A prop `navigation-menu` define as configurações para apresentação do menu lateral de navegação.

Para ocultar o menu de navegação, basta omitir essa prop.

O menu também conta com um campo de busca que filtra itens e grupos em tempo real, no formato _case-insensitive_.

<demo contained data-testid="demo-root-navigation-toggle">
<u-main :appBar="demoNavigationToggleAppBar" :navigationMenu="navigationMenu" data-testid="root-demo-navigation-toggle">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar :navigationMenu>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
};

const navigationMenu: NonNullable<MainProps["navigationMenu"]> = {
  items: [
    {
      description: "Início",
      route: "/",
    },
    {
      description: "Documentação",
      items: [
        {
          description: "Componentes",
          route: "/components",
        },
        {
          description: "Composables",
          route: "/composables",
        },
      ],
    },
    {
      description: "Configurações",
      action: () => window.alert("Abrindo configurações..."),
    },
  ],
};
</script>
```

### Carregamento

A prop `loading` exibe skeletons no lugar das ações do menu superior (ajuda, notificações e usuário) e dos itens do menu de navegação, enquanto os dados do usuário e as opções de menu são carregados.

O botão do menu de navegação, a logo e o título continuam visíveis. O menu de navegação continua abrindo normalmente, com a busca desabilitada, e ao final do carregamento os itens aparecem já filtrados pelo texto buscado. Se o menu de notificações estiver aberto quando o carregamento começar, ele é fechado.

O conteúdo da página não é afetado: nele, utilize a prop `loading` dos próprios componentes, como o [Section](./section).

<demo contained data-testid="demo-root-loading">
<u-main :appBar="loadingAppBar" :navigationMenu="loadingNavigationMenu" loading data-testid="root-demo-loading">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar :navigationMenu :loading>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

// Altere para `false` quando os dados do usuário e do menu forem carregados
const loading = ref(true);

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
  help: "https://www.google.com",
  notifications: [],
  user: {
    title: "Rafael Perini",
    subtitle: "UIMed-Vue Co-Creator",
  },
};

const navigationMenu: NonNullable<MainProps["navigationMenu"]> = {
  items: [
    {
      description: "Início",
      route: "/",
    },
    {
      description: "Configurações",
      action: () => window.alert("Abrindo configurações..."),
    },
  ],
};
</script>
```

## Eventos

### Notificações

O evento `update:notificationsOpen` é emitido sempre que o menu de notificações é aberto ou fechado.

<demo contained data-testid="demo-notifications-open-event">
<u-main :app-bar="eventsAppBar" @update:notifications-open="onNotificationsOpen" data-testid="root-demo-notifications-open">
  <h2 data-testid="root-demo-notifications-open-count">
    {{ notificationsOpenCount }} interação(ões)
  </h2>
</u-main>
</demo>

```vue
<template>
  <u-main :app-bar="appBar" @update:notifications-open="onNotificationsOpen">
    <h2>{{ notificationsOpenCount }} interação(ões)</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const notificationsOpenCount = ref(0);

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
  notifications: [],
};

function onNotificationsOpen() {
  notificationsOpenCount.value++;
}
</script>
```

## Playground

Experimente as combinações de props do componente.

<playground v-model:actions="playgroundActions">
<demo contained>
<u-main :app-bar="playgroundAppBar" :navigationMenu="playgroundActions.showNavigationMenu.value ? playgroundNavigationMenu : undefined" :loading="playgroundActions.loading.value" data-testid="root-preview">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>
</playground>

## Ver também

Consulte a referência de [API do UMain](../../api/components/main) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { computed, reactive, ref } from "vue"
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UMain } from "../../../dist/components.js"

  type MainProps = ComponentProps<typeof UMain>

  const logo = "/uimed-vue/favicon.svg";

  const notificationsOpenCount = ref(0);

  const eventsAppBar = reactive<NonNullable<MainProps["appBar"]>>({
    title: "Menu superior",
    dataTestid: "demo-root-events-app-bar",
    notifications: [],
  });

  const navigationMenu = reactive<NonNullable<MainProps["navigationMenu"]>>({
    items: [
      {
        description: "Início",
        route: "/",
      },
      {
        description: "Documentação",
        items: [
          {
            description: "Componentes",
            route: "/components",
          },
          {
            description: "Composables",
            route: "/composables",
          },
        ],
      },
      {
        description: "Configurações",
        action: () => window.alert("Abrindo configurações..."),
      },
    ],
    dataTestid: "demo-root-navigation-toggle-navigation-menu",
  });

  function onNotificationsOpen() {
    notificationsOpenCount.value++;
  }
  
  const appBar = reactive<NonNullable<MainProps["appBar"]>>({
    title: "Menu superior",
    help: "https://www.google.com",
    dataTestid: "demo-root-app-bar",
    notifications: [
      {
        title: "v1.1",
        subtitle: "Nova versão disponível para instalação.",
        when: "10:30",
        read: false,
      },
      {
        title: "v1",
        subtitle: "Nova versão disponível para testes.",
        when: "Ontem",
        read: false,
      },
      {
        title: "vBeta",
        subtitle: "Nova versão disponível para testes.",
        when: "29/09/2026",
        read: true,
      },
      {
        title: "vAlpha",
        subtitle: "Nova versão disponível para testes.",
        when: "28/09/2026",
        read: true,
      },
    ],
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
  });

  function toggleNotifications(open: boolean) {
    if (!open) {
      appBar.notifications = appBar.notifications?.map((notification) => ({
        ...notification,
        read: true,
      }))
    };
  }

  const playgroundActions = ref({
    title: {
      type: "text",
      label: "Título",
      value: "Menu do playground",
      dataTestid: "root-playground-title",
    },
    help: {
      type: "text",
      label: "Link para ajuda",
      value: "https://www.google.com",
      dataTestid: "root-playground-help",
    },
    addNotification: {
      type: 'button',
      label: "Adicionar notificação",
      dataTestid: "root-playground-add-notification",
      action: addPlaygroundNotification,
    },
    removeNotification: {
      type: 'button',
      label: "Remover notificação",
      dataTestid: "root-playground-remove-notification",
      action: removePlaygroundNotification,
    },
    showNotifications: {
      type: "checkbox",
      value: true,
      label: "Exibir notificações",
      dataTestid: "root-playground-show-notifications"
    },
    showUser: {
      type: "checkbox",
      value: false,
      label: "Exibir usuário",
      dataTestid: "root-playground-show-user"
    },
    showNavigationMenu: {
      type: "checkbox",
      value: true,
      label: "Exibir menu de navegação",
      dataTestid: "root-playground-show-navigation-menu"
    },
    loading: {
      type: "checkbox",
      value: false,
      label: "Carregando",
      dataTestid: "root-playground-loading"
    },
  });

  const playgroundNotifications = ref<NonNullable<NonNullable<MainProps["appBar"]>["notifications"]>>([]);

  function addPlaygroundNotification() {
    playgroundNotifications.value.push({ title: "Lorem ipsum...", read: false, when: "Agora" })
  }

  function removePlaygroundNotification() {
    playgroundNotifications.value.pop();
  }

  const playgroundAppBar = computed<NonNullable<MainProps["appBar"]>>(() => ({
    dataTestid: "root-playground-app-bar",
    title: playgroundActions.value.title.value,
    help: playgroundActions.value.help.value || undefined,
    notifications: playgroundActions.value.showNotifications.value ? playgroundNotifications.value : undefined,
    user: playgroundActions.value.showUser.value ? appBar.user : undefined
  }));

  const playgroundNavigationMenu = computed<NonNullable<MainProps["navigationMenu"]>>(() => ({
    dataTestid: "root-playground-navigation-menu",
    items: [
      {
        description: "Início",
        route: "/",
      },
      {
        description: "Documentação",
        items: [
          {
            description: "Componentes",
            route: "/components",
          },
          {
            description: "Composables",
            route: "/composables",
          },
        ],
      },
    ],
  }));

  const demoNavigationToggleAppBar = reactive<NonNullable<MainProps["appBar"]>>({
    title: "Menu superior",
    dataTestid: "demo-root-navigation-toggle-app-bar",
  });

  const loadingAppBar: NonNullable<MainProps["appBar"]> = {
    title: "Menu superior",
    help: "https://www.google.com",
    dataTestid: "demo-root-loading-app-bar",
    notifications: [],
    user: {
      title: "Rafael Perini",
      subtitle: "UIMed-Vue Co-Creator",
    },
  };

  const loadingNavigationMenu: NonNullable<MainProps["navigationMenu"]> = {
    dataTestid: "demo-root-loading-navigation-menu",
    items: [
      {
        description: "Início",
        route: "/",
      },
      {
        description: "Configurações",
        action: () => window.alert("Abrindo configurações..."),
      },
    ],
  };
</script>
