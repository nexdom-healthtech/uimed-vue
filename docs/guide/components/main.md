---
outline: deep
---

# Componente base

O componente destinado a raiz do projeto se chama `Main`.

É responsável por carregar o menu superior, o menu de navegação lateral, o rodapé, os componentes utilizados pelos composables de [Toasts](../composables/use-toast), [Diálogos](../composables/use-dialog), [Confirmações](../composables/use-confirm) e [Alterações não salvas](../composables/use-unsaved-changes) e os estilos necessários para os demais componentes.

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

As ações do menu superior têm nomes fixos para leitores de tela: "Menu de navegação" (exibido apenas em telas pequenas, que também informa se o menu de navegação está aberto ou fechado), "Ajuda", "Notificações" e "Menu do usuário". Quando há notificações não lidas, o botão de notificações inclui a quantidade no nome, por exemplo "Notificações (2 não lidas)" ou "Notificações (1 não lida)".

No menu do usuário aberto, o avatar aparece maior e centralizado, com o nome (`title`) e o `subtitle` do usuário abaixo dele.

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

#### Usuário sem imagem

O avatar do usuário mostra a imagem informada em `img`. Sem `img`, ele mostra as iniciais do `title`: a primeira letra do primeiro e do último nome, como "RP" para "Rafael Perini". Sem `img` nem `title`, ele mostra um ícone genérico. A regra vale tanto para o botão do menu superior quanto para o menu do usuário aberto.

O avatar é decorativo: leitores de tela não leem as iniciais e continuam anunciando o botão como "Menu do usuário".

<demo contained data-testid="demo-root-user-initials">
<u-main :appBar="userInitialsAppBar" data-testid="root-demo-user-initials">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
  user: {
    title: "Rafael Perini",
    subtitle: "UIMed-Vue Co-Creator",
    options: [{ description: "Sair", action: () => window.alert("Saindo...") }],
  },
};
</script>
```

#### Detalhes do usuário

Para mostrar mais informações do usuário no menu, como a empresa e o perfil de acesso, use o slot `user-section-details`. O conteúdo aparece abaixo do nome e do subtítulo e acima das opções, com o texto centralizado como eles. O slot aceita qualquer conteúdo, inclusive ações, como um botão para gerenciar o perfil.

O slot só é exibido quando há um menu do usuário, ou seja, quando `appBar.user` é informado.

<demo contained data-testid="demo-root-user-details">
<u-main :appBar="userDetailsAppBar" data-testid="root-demo-user-details">
  <template #user-section-details>
    <u-row>
      <u-column cols="12">
        <strong>Unimed do Estado de Santa Catarina</strong>
        <div>Perfil Administrador</div>
      </u-column>
    </u-row>
    <u-row>
      <u-column cols="12">
        <u-button variant="secondary" full-width @click="manageProfile">Gerenciar perfil</u-button>
      </u-column>
    </u-row>
  </template>
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar>
    <template #user-section-details>
      <u-row>
        <u-column cols="12">
          <strong>Unimed do Estado de Santa Catarina</strong>
          <div>Perfil Administrador</div>
        </u-column>
      </u-row>
      <u-row>
        <u-column cols="12">
          <u-button variant="secondary" full-width @click="manageProfile">
            Gerenciar perfil
          </u-button>
        </u-column>
      </u-row>
    </template>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UButton, UColumn, UMain, URow } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
  user: {
    title: "Julyana Costa",
    subtitle: "julyana.costa@example.com",
    options: [{ description: "Sair", action: () => window.alert("Saindo...") }],
  },
};

function manageProfile() {
  window.alert("Abrindo o perfil...");
}
</script>
```

### Menu de navegação

A prop `navigation-menu` define as configurações para apresentação do menu lateral de navegação.

Para ocultar o menu de navegação, basta omitir essa prop.

Em telas largas (a partir de 1145px), o menu fica sempre visível à esquerda do conteúdo, recolhido, mostrando apenas os ícones dos itens e grupos do primeiro nível e um item "Buscar". Ele se expande sobre o conteúdo, sem deslocá-lo, enquanto o mouse está sobre ele, enquanto o foco do teclado está nele ou pelo atalho de busca, e volta a se recolher quando o mouse e o foco saem dele. Recolhido, ele destaca o grupo que contém a página atual; expandido, abre esse grupo e destaca apenas o item da página. Ao se recolher, ele fecha os grupos e limpa o texto da busca.

Em telas pequenas, o menu fica oculto e é aberto sobre o conteúdo pelo botão "Menu de navegação" do menu superior.

Os itens e grupos do primeiro nível do menu exibem um ícone antes da sua descrição, informado pelo nome na propriedade obrigatória `icon`. Os nomes disponíveis estão em [Ícones](../icons). Os itens dentro de um grupo não aceitam ícones, para que o menu siga o mesmo padrão visual em todas as aplicações.

O menu também conta com um campo de busca que filtra itens e grupos em tempo real, no formato _case-insensitive_.

O atalho `Ctrl + K` (`⌘ + K` no macOS), indicado no próprio campo de busca, expande o menu (ou o abre, em telas pequenas) e coloca o foco na busca, com o texto já digitado selecionado. Com o menu expandido ou aberto, o atalho apenas leva o foco de volta à busca. Levar o foco ao item "Buscar" do menu recolhido tem o mesmo efeito. Ele funciona mesmo com o foco em um campo de formulário, mas é ignorado com o foco dentro de diálogos, confirmações, menus suspensos e editores de texto rico, ou no botão de um menu suspenso aberto.

A tecla `Esc` recolhe (ou fecha) o menu enquanto o foco está nele ou, se ele foi expandido pelo atalho, mesmo com o foco fora dele (como durante o carregamento, em que a busca desabilitada não recebe o foco). Se o menu foi expandido pelo atalho ou pelo item "Buscar", o foco volta ao elemento que o tinha antes. Recolhido pelo `Esc`, o menu só volta a se expandir quando o mouse entra nele, quando o foco sai e volta a ele, ou pelo atalho.

Quando a página tem mais de um `UMain` com menu de navegação, apenas o primeiro responde ao atalho. Por isso, nesta página, `Ctrl + K` abre o menu da demonstração abaixo em vez da busca da documentação, que continua disponível pela tecla `/`.

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
      icon: "home",
    },
    {
      description: "Documentação",
      icon: "folder",
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
      icon: "cog",
      action: () => window.alert("Abrindo configurações..."),
    },
  ],
};
</script>
```

### Carregamento

A prop `loading` exibe skeletons no lugar das ações do menu superior (ajuda, notificações e usuário) e dos itens do menu de navegação, enquanto os dados do usuário e as opções de menu são carregados.

A logo e o título continuam visíveis, assim como o botão do menu de navegação, em telas pequenas. O menu de navegação continua se expandindo (ou abrindo, em telas pequenas) normalmente, com a busca e o item "Buscar" desabilitados, e ao final do carregamento os itens aparecem já filtrados pelo texto buscado. Se o menu de notificações estiver aberto quando o carregamento começar, ele é fechado.

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
      icon: "home",
    },
    {
      description: "Configurações",
      icon: "cog",
      action: () => window.alert("Abrindo configurações..."),
    },
  ],
};
</script>
```

### Rodapé

A prop `footer` exibe um texto fixo na parte inferior da tela, como a versão da aplicação, para que o usuário consiga informá-la ao suporte ao relatar um problema. O texto fica centralizado e o conteúdo da página termina acima do rodapé, sem ficar coberto por ele.

Para ocultar o rodapé, basta omitir essa prop ou deixar o seu `description` vazio, por exemplo enquanto o usuário não estiver autenticado. O carregamento (prop `loading`) não afeta o rodapé.

<demo contained data-testid="demo-root-footer">
<u-main :appBar="{ title: appBar.title }" :footer="footer">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>

```vue
<template>
  <u-main :appBar :footer="isAuthenticated ? footer : undefined">
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const isAuthenticated = ref(true);

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
};

const footer: NonNullable<MainProps["footer"]> = {
  description: "Versão 1.4.2",
};
</script>
```

### Cor de fundo

A prop `background` aplica uma cor ao fundo de toda a aplicação, como em landing pages, com as mesmas opções de cor do [Botão](./button): `primary`, `secondary`, `positive`, `informative`, `caution` e `danger`. Quando omitida, a aplicação usa o fundo padrão do tema.

O texto colocado diretamente sobre o fundo passa a usar a cor associada a ele (branco ou preto). O menu superior, o rodapé, as [Sections](./section) e os diálogos mantêm os próprios fundos.

Cuide do contraste ao escolher a cor:

- `secondary` é a mesma cor do fundo das [Sections](./section) e do menu superior, que perdem a separação do restante da página.
- Evite combinações em que o componente some no fundo, como um botão `primary` ou links sobre o fundo `primary`, ou links e campos de formulário sobre o fundo `danger`.

<demo contained data-testid="demo-root-background">
<u-main background="primary" :appBar="backgroundAppBar" data-testid="root-demo-background">
  <h2>Boas-vindas ao portal</h2>
</u-main>
</demo>

```vue
<template>
  <u-main background="primary" :appBar>
    <h2>Boas-vindas ao portal</h2>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
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
<u-main :app-bar="playgroundAppBar" :navigationMenu="playgroundActions.showNavigationMenu.value ? playgroundNavigationMenu : undefined" :loading="playgroundActions.loading.value" :footer="{ description: playgroundActions.footer.value, dataTestid: 'root-playground-footer' }" :background="playgroundBackground" data-testid="root-preview">
  <h2>O conteúdo da página vai aqui...</h2>
</u-main>
</demo>
</playground>

## Ver também

Consulte a referência de [API do UMain](../../api/components/main) para a lista completa de props, slots e eventos.

O conteúdo da página ocupa toda a altura visível abaixo do menu superior (e acima do rodapé, quando exibido): para centralizar o formulário de uma tela de login nela, por exemplo, veja [Altura total](./layout#altura-total) nos componentes de layout.

<script lang="ts" setup>
  import { computed, reactive, ref } from "vue"
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UButton, UColumn, UMain, URow } from "../../../dist/components.js"

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
        icon: "home",
      },
      {
        description: "Documentação",
        icon: "folder",
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
        icon: "cog",
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

  // "Padrão" omite a prop, mantendo o fundo padrão do tema
  const playgroundBackgroundOptions = [{ label: "Padrão", value: "" }, "primary", "secondary", "positive", "informative", "caution", "danger"];

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
    footer: {
      type: "text",
      label: "Texto do rodapé",
      value: "Versão 1.0.0",
      dataTestid: "root-playground-footer-description",
    },
    background: {
      type: "combobox",
      label: "Cor de fundo",
      value: "",
      dataTestid: "root-playground-background",
      items: playgroundBackgroundOptions,
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

  const playgroundBackground = computed(() => (playgroundActions.value.background.value || undefined) as MainProps["background"]);

  const playgroundNavigationMenu = computed<NonNullable<MainProps["navigationMenu"]>>(() => ({
    dataTestid: "root-playground-navigation-menu",
    items: [
      {
        description: "Início",
        route: "/",
        icon: "home",
      },
      {
        description: "Documentação",
        icon: "folder",
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

  const backgroundAppBar: NonNullable<MainProps["appBar"]> = {
    title: "Menu superior",
    dataTestid: "demo-root-background-app-bar",
  };

  const footer: NonNullable<MainProps["footer"]> = {
    description: "Versão 1.4.2",
    dataTestid: "demo-root-footer-footer",
  };

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

  const userInitialsAppBar: NonNullable<MainProps["appBar"]> = {
    title: "Menu superior",
    dataTestid: "demo-root-user-initials-app-bar",
    user: {
      title: "Rafael Perini",
      subtitle: "UIMed-Vue Co-Creator",
      options: [{ description: "Sair", action: () => window.alert("Saindo...") }],
    },
  };

  const userDetailsAppBar: NonNullable<MainProps["appBar"]> = {
    title: "Menu superior",
    dataTestid: "demo-root-user-details-app-bar",
    user: {
      title: "Julyana Costa",
      subtitle: "julyana.costa@example.com",
      options: [{ description: "Sair", action: () => window.alert("Saindo...") }],
    },
  };

  function manageProfile() {
    window.alert("Abrindo o perfil...");
  }

  const loadingNavigationMenu: NonNullable<MainProps["navigationMenu"]> = {
    dataTestid: "demo-root-loading-navigation-menu",
    items: [
      {
        description: "Início",
        route: "/",
        icon: "home",
      },
      {
        description: "Configurações",
        icon: "cog",
        action: () => window.alert("Abrindo configurações..."),
      },
    ],
  };
</script>
