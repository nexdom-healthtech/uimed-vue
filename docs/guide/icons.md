---
outline: deep
---

# Ícones

Os componentes que aceitam um ícone, como os itens e grupos do [menu de navegação](./components/main#menu-de-navegacao), recebem o nome de um dos ícones listados nesta página na propriedade `icon`.

## Uso

Informe o nome do ícone em `icon`:

```vue
<template>
  <u-main :appBar :navigationMenu>
    <h2>O conteúdo da página vai aqui...</h2>
  </u-main>
</template>

<script lang="ts" setup>
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;

const appBar: NonNullable<MainProps["appBar"]> = {
  title: "Menu superior",
};

const navigationMenu: NonNullable<MainProps["navigationMenu"]> = {
  items: [
    { description: "Início", route: "/", icon: "home" },
    { description: "Agenda", route: "/agenda", icon: "calendar" },
    { description: "Configurações", route: "/configuracoes", icon: "cog" },
  ],
};
</script>
```

O ícone aparece antes da descrição, na cor do texto do menu. Ele é decorativo: leitores de tela anunciam apenas a descrição.

Utilize ícones em todos os itens de um mesmo nível do menu, ou em nenhum deles. Itens sem ícone ao lado de itens com ícone ficam com os títulos desalinhados.

## Ícones disponíveis

Os nomes descrevem o desenho do ícone, e não onde ele deve ser usado. A coluna "Uso sugerido" traz exemplos de telas que costumam usar cada um.

Quase todos os ícones têm uma versão contornada, com o sufixo `-outline` no nome. Prefira usar a mesma versão (preenchida ou contornada) em todos os itens do menu.

<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Versão contornada</th>
      <th>Uso sugerido</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="{ icon, outline, usage } in icons" :key="icon">
      <td><code>{{ icon }}</code></td>
      <td><code v-if="outline">{{ outline }}</code></td>
      <td>{{ usage }}</td>
    </tr>
  </tbody>
</table>

## Visualização

Abra o menu de navegação da demonstração abaixo para ver cada ícone ao lado do seu nome.

Nesta página, o atalho `Ctrl + K` (`⌘ + K` no macOS) abre o menu da demonstração em vez da busca da documentação, que continua disponível pela tecla `/`.

<demo contained data-testid="demo-icons">
<u-main :appBar :navigationMenu>
  <h2>Abra o menu de navegação para ver os ícones.</h2>
</u-main>
</demo>

## Ver também

Consulte o [Componente base](./components/main#menu-de-navegacao) para mais detalhes sobre o menu de navegação, e a [API do UMain](../api/components/main#navigationmenuitem) para a lista completa das suas propriedades.

<script lang="ts" setup>
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UMain } from "../../dist/components.js"

  type MainProps = ComponentProps<typeof UMain>
  type NavigationMenu = NonNullable<MainProps["navigationMenu"]>
  type NavigationMenuItem = NonNullable<NavigationMenu["items"]>[number]
  type Icon = NonNullable<NavigationMenuItem["icon"]>

  // The table and the demo below list the same icons
  const icons: Array<{ icon: Icon; outline?: Icon; usage: string }> = [
    { icon: "home", outline: "home-outline", usage: "Início" },
    { icon: "account", outline: "account-outline", usage: "Perfil, beneficiário" },
    { icon: "account-group", outline: "account-group-outline", usage: "Pacientes, equipes" },
    { icon: "calendar", outline: "calendar-outline", usage: "Agenda" },
    { icon: "clipboard-text", outline: "clipboard-text-outline", usage: "Prontuário, atendimentos" },
    { icon: "file-document", outline: "file-document-outline", usage: "Documentos, guias" },
    { icon: "flask", outline: "flask-outline", usage: "Exames" },
    { icon: "folder", outline: "folder-outline", usage: "Cadastros" },
    { icon: "chart-box", outline: "chart-box-outline", usage: "Relatórios" },
    { icon: "wallet", outline: "wallet-outline", usage: "Financeiro" },
    { icon: "cog", outline: "cog-outline", usage: "Configurações" },
    { icon: "stethoscope", usage: "Consultas" },
    { icon: "pill", usage: "Medicamentos" },
    { icon: "hospital", usage: "Unidades, rede" },
  ]

  const appBar: NonNullable<MainProps["appBar"]> = {
    title: "Ícones",
    dataTestid: "demo-icons-app-bar",
  }

  const navigationMenu: NavigationMenu = {
    dataTestid: "demo-icons-navigation-menu",
    items: icons
      .flatMap(({ icon, outline }) => (outline ? [icon, outline] : [icon]))
      .map((icon) => ({ description: icon, icon })),
  }
</script>
