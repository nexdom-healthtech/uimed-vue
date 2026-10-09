---
outline: deep
---

# Ícones

Os componentes que aceitam um ícone, como o [botão de ícone](./components/icon-button) e os itens e grupos do [menu de navegação](./components/main#menu-de-navegacao), recebem o nome de um dos ícones listados nesta página na propriedade `icon`.

## Uso

Informe o nome do ícone em `icon`. No [botão de ícone](./components/icon-button), o ícone é todo o conteúdo do botão, e a propriedade `label` define o nome que os leitores de tela anunciam no lugar dele:

```vue
<template>
  <u-icon-button icon="cog" label="Configurações" />
</template>

<script lang="ts" setup>
import { UIconButton } from "@nexdom/uimed-vue/components";
</script>
```

Nos itens e grupos do menu de navegação, o ícone aparece antes da descrição:

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

No menu, o ícone usa a cor do texto do menu. Ele é decorativo: leitores de tela anunciam apenas a descrição.

Utilize ícones em todos os itens de um mesmo nível do menu, ou em nenhum deles. Itens sem ícone ao lado de itens com ícone ficam com os títulos desalinhados.

## Ícones disponíveis

Os nomes descrevem o desenho do ícone, e não onde ele deve ser usado.

Quase todos os ícones têm uma versão alternativa do mesmo desenho (atualmente, contornada), com o sufixo `-alternative` no nome. Prefira usar a mesma versão (a original ou a alternativa) em todos os itens do menu.

Busque um ícone pelo nome, sem diferenciar maiúsculas, minúsculas ou acentos, e clique no ícone para copiar o seu nome.

<demo data-testid="demo-icons">
<u-main>
<u-text-field v-model="search" type="search" label="Buscar ícone" data-testid="icons-search" />
<p aria-live="polite" data-testid="icons-count">{{ countText }}</p>
<u-row v-if="filteredIcons.length" list data-testid="icons-list">
<u-column v-for="icon in filteredIcons" :key="icon" cols="3" list-item>
<u-icon-button :label="`Copiar o nome ${icon}`" :icon @click="copy(icon)" />
<div><code>{{ icon }}</code></div>
</u-column>
</u-row>
</u-main>
</demo>

## Ver também

Consulte o [botão de ícone](./components/icon-button) e o [Componente base](./components/main#menu-de-navegacao) para mais detalhes sobre os componentes que exibem ícones.

<script lang="ts" setup>
  import { computed, ref } from "vue"
  import type { ComponentProps } from "vue-component-type-helpers"
  import { UMain, URow, UColumn, UTextField, UIconButton } from "../../dist/components.js"
  import { useToast } from "../../dist/composables.js"

  type Icon = ComponentProps<typeof UIconButton>["icon"]

  // Every icon the components accept, in the order of the library's map of icons
  // (`src/consts/icons.ts`). An icon added to the map must also be added here
  const icons: Array<Icon> = [
    "home",
    "home-alternative",
    "account",
    "account-alternative",
    "account-group",
    "account-group-alternative",
    "calendar",
    "calendar-alternative",
    "clipboard-text",
    "clipboard-text-alternative",
    "file-document",
    "file-document-alternative",
    "flask",
    "flask-alternative",
    "folder",
    "folder-alternative",
    "chart-box",
    "chart-box-alternative",
    "wallet",
    "wallet-alternative",
    "cog",
    "cog-alternative",
    "stethoscope",
    "pill",
    "hospital",
  ]

  const { toast } = useToast()
  const search = ref("")

  // Icons whose name contains the search, ignoring case and accents
  const filteredIcons = computed(() => {
    const query = normalize(search.value.trim())
    return icons.filter((icon) => normalize(icon).includes(query))
  })

  const countText = computed(() => {
    const count = filteredIcons.value.length
    if (count === 0) return "Nenhum ícone encontrado."
    return count === 1 ? "1 ícone" : `${count} ícones`
  })

  async function copy(icon: Icon) {
    try {
      await globalThis.navigator.clipboard.writeText(icon)
      toast({ message: `Nome "${icon}" copiado.`, color: "positive" })
    } catch {
      // Also reached when the browser has no clipboard API, such as outside a secure context
      toast({
        message: `Não foi possível copiar. Selecione o nome "${icon}" abaixo do ícone.`,
        color: "danger",
      })
    }
  }

  function normalize(text: string) {
    return text.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase()
  }
</script>
