---
outline: deep
---

# Componente base

O componente destinado a raiz do projeto se chama `Root`.

É responsável por carregar o menu superior, o menu de navegação lateral, o componente utilizado pelos composables de [Toasts](../composables/use-toast) e os estilos necessários para os demais componentes.

## Propriedades

### Menu superior

A prop `app-bar` define as configurações para apresentação do menu superior.

Para ocultar o menu superior, basta omitir essa prop.

<demo contained>
<root :appBar @update:notifications-open="toggleNotifications">
  <h2>O conteúdo da página vai aqui...</h2>
</root>
</demo>

```vue
<template>
  <root :appBar @update:notifications-open="toggleNotifications">
    <h2>O conteúdo da página vai aqui...</h2>
  </root>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const today = new Date();

const appBar = reactive<AppBarConfig>({
  title: "Menu superior",
  help: "https://www.google.com",
  notifications: [
    {
      title: "v1.1",
      subtitle: "Nova versão disponível para instalação.",
      date: new Date(today),
      read: false,
    },
    {
      title: "v1",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 1)),
      read: false,
    },
    {
      title: "vBeta",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 2)),
      read: true,
    },
    {
      title: "vAlpha",
      subtitle: "Nova versão disponível para testes.",
      date: new Date(today.setDate(today.getDate() - 3)),
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
<root :appBar="demoNavigationToggleAppBar" :navigationMenu="navigationMenu" data-testid="root-demo-navigation-toggle">
  <h2>O conteúdo da página vai aqui...</h2>
</root>
</demo>

```vue
<template>
  <root :appBar :navigationMenu>
    <h2>O conteúdo da página vai aqui...</h2>
  </root>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { Root, type AppBarConfig, type NavigationMenuConfig } from "@nexdom/uimed-vue/components";

const appBar: AppBarConfig = {
  title: "Menu superior",
};

const navigationMenu: NavigationMenuConfig = {
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

## Eventos

### Notificações

O evento `update:notificationsOpen` é emitido sempre que o menu de notificações é aberto ou fechado.

<demo contained data-testid="demo-notifications-open-event">
<root :app-bar="eventsAppBar" @update:notifications-open="onNotificationsOpen" data-testid="root-demo-notifications-open">
  <h2 data-testid="root-demo-notifications-open-count">
    {{ notificationsOpenCount }} interação(ões)
  </h2>
</root>
</demo>

```vue
<template>
  <root :app-bar="appBar" @update:notifications-open="onNotificationsOpen">
    <h2>{{ notificationsOpenCount }} interação(ões)</h2>
  </root>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Root, type AppBarConfig } from "@nexdom/uimed-vue/components";

const notificationsOpenCount = ref(0);

const appBar: AppBarConfig = {
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
<root :app-bar="playgroundAppBar" :navigationMenu="playgroundShowNavigationMenu ? playgroundNavigationMenu : undefined" data-testid="root-preview">
  <h2>O conteúdo da página vai aqui...</h2>
</root>
</demo>

<template #actions>
<v-checkbox v-model="playgroundShowNotifications" label="Exibir notificações" density="compact" hide-details data-testid="root-playground-show-notifications" />

<v-checkbox v-model="playgroundShowUser" label="Exibir usuário" density="compact" hide-details data-testid="root-playground-show-user" />

<v-checkbox v-model="playgroundShowNavigationMenu" label="Exibir menu de navegação" density="compact" hide-details data-testid="root-playground-show-navigation-menu" />
</template>
</playground>

## Ver também

Consulte a referência de [API do Root](../../api/components/root) para a lista completa de props, slots e eventos.

<script lang="ts" setup>
  import { computed, reactive, ref } from "vue"
  import { Root, type AppBarConfig, type NavigationMenuConfig } from "../../../dist/components.js"
  import { VCheckbox } from "vuetify/components"

  const today = new Date()

  const notificationsOpenCount = ref(0);
  const playgroundShowUser = ref(false);
  const playgroundShowNotifications = ref(true);
  const playgroundShowNavigationMenu = ref(true);

  const eventsAppBar = reactive<AppBarConfig>({
    title: "Menu superior",
    dataTestid: "demo-root-events-app-bar",
    notifications: [],
  });

  const navigationMenu = reactive<NavigationMenuConfig>({
    dataTestid: "demo-root-navigation-menu",
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
  
  const appBar = reactive<AppBarConfig>({
    title: "Menu superior",
    help: "https://www.google.com",
    dataTestid: "demo-root-app-bar",
    notifications: [
      {
        title: "v1.1",
        subtitle: "Nova versão disponível para instalação.",
        date: new Date(today),
        read: false,
      },
      {
        title: "v1",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 1)),
        read: false,
      },
      {
        title: "vBeta",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 2)),
        read: true,
      },
      {
        title: "vAlpha",
        subtitle: "Nova versão disponível para testes.",
        date: new Date(today.setDate(today.getDate() - 3)),
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
      label: "Título",
      value: "Menu do playground",
      dataTestid: "root-playground-title",
    },
    help: {
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
    }
  });

  const playgroundNotifications = ref<Required<AppBarConfig>["notifications"]>([]);

  function addPlaygroundNotification() {
    playgroundNotifications.value.push({ title: "Lorem ipsum...", read: false, date: new Date() })
  }

  function removePlaygroundNotification() {
    playgroundNotifications.value.pop();
  }

  const playgroundAppBar = computed<AppBarConfig>(() => ({
    dataTestid: "root-playground-app-bar",
    title: playgroundActions.value.title.value,
    help: playgroundActions.value.help.value || undefined,
    notifications: playgroundShowNotifications.value ? playgroundNotifications.value : undefined,
    user: playgroundShowUser.value ? appBar.user : undefined
  }));

  const playgroundNavigationMenu = computed<NavigationMenuConfig>(() => ({
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

  const demoNavigationToggleAppBar = reactive<AppBarConfig>({
    title: "Menu superior",
    dataTestid: "demo-root-navigation-toggle-app-bar",
  });
</script>
