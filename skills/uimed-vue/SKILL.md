---
name: uimed-vue
description: Use when writing or changing a Vue app that uses @nexdom/uimed-vue (NEXDOM's UI library) — setting it up, choosing and configuring its components and composables, styling, unit tests and upgrading between versions.
---

# Using @nexdom/uimed-vue in an app

This skill ships with the installed version of `@nexdom/uimed-vue`, so it describes exactly the components, props and rules of that version. It only covers how to _use_ the library in an app: the app's own conventions (Git workflow, agents, code style) stay in the app's instructions.

The complete guides and API pages of this version are in [`references/`](references/), in Portuguese, generated from the library's documentation:

- [`references/guide/getting-started.md`](references/guide/getting-started.md): installation and setup.
- [`references/guide/components/`](references/guide/components/) and [`references/guide/composables/`](references/guide/composables/): how to use each component and composable, with examples.
- [`references/api/`](references/api/): props, events, slots and types of each component and composable.
- [`references/guide/icons.md`](references/guide/icons.md): the icon names the components accept.
- [`references/guide/unit-testing.md`](references/guide/unit-testing.md): unit tests with Vitest and Vue Test Utils.
- [`references/guide/migration-v1-to-v2.md`](references/guide/migration-v1-to-v2.md): migrating from v1.

Read the page of a component or composable before using it, instead of relying on memory: the library is recent, and its API is not in most models' training data.

## Install

```bash
vp add @nexdom/uimed-vue
# Or, without Vite+
npm i @nexdom/uimed-vue
```

Its peer dependencies (`@mdi/js`, `@nexdom/shared`, `resize-observer-polyfill`, `sass-embedded`, `vite-plus`, `vue`, `vue-component-type-helpers`, `vue-router`, `vuetify`) must be installed in the app too, in the versions declared in the library's `package.json`.

## Setup

Add the Vite plugin, which compiles the components' styles with the library's font and settings. It's required: without it, the components lose the Unimed Slab font and the library's styles.

```ts
// vite.config.ts
import { vitePluginUimed } from "@nexdom/uimed-vue/plugins";

// ...

plugins: [vue(), vitePluginUimed()];

// ...
```

Register the library in the Vue app:

```ts
// main.ts
import { createApp } from "vue";
import { createUimed } from "@nexdom/uimed-vue";
import App from "./App.vue";

createApp(App).use(createUimed()).mount("#app");
```

## Rules

- Place `UMain` at the top of `App.vue`, and build the screens with the library's components (prefixed with `U`), imported from `@nexdom/uimed-vue/components`:

  ```vue
  <template>
    <u-main :app-bar="appBar">
      <!-- the page goes here -->
    </u-main>
  </template>

  <script setup lang="ts">
  import { UMain } from "@nexdom/uimed-vue/components";
  </script>
  ```

- Style only through the components' props. Never write CSS, `<style>` blocks, classes or utility classes (spacing, colors, typography) on the library's components: the library only generates the styles its components use, so other classes may not exist.
- The library is built on Vuetify, but that is an internal detail: don't use Vuetify's components or APIs directly in the app, and don't depend on its classes or theme variables.
- The library doesn't export prop types. Derive them with `ComponentProps` from `vue-component-type-helpers`:

  ```ts
  import type { ComponentProps } from "vue-component-type-helpers";
  import { UMain, USection } from "@nexdom/uimed-vue/components";

  type MainProps = ComponentProps<typeof UMain>;
  type AppBar = NonNullable<MainProps["appBar"]>;
  type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];
  ```

- `UMain` shows a "back to top" floating button on its own once the page scrolls past a screen, so don't add one to the screens.
- A navigation menu item stays highlighted on the pages below its route's path (e.g. a form opened in a dialog at `/people/new` highlights the item of `/people`, but `/people-archive` doesn't), so give those pages paths below the item's. The root (`/`) only highlights on its own page, and when several items contain the page, only the one with the longest path is highlighted.
- Icons are passed by name (e.g. `icon="cog"`), from the list in [`references/guide/icons.md`](references/guide/icons.md).
- The components' internal texts, such as their messages and the names read by screen readers, are in Portuguese (pt-BR).

## Entry points

| Import                          | Contents                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `@nexdom/uimed-vue`             | `createUimed()`, to register the library in the app                                    |
| `@nexdom/uimed-vue/components`  | The components (`UMain`, `USection`, `UButton`, ...)                                   |
| `@nexdom/uimed-vue/composables` | The composables (`useDialog`, `useConfirm`, `useToast`, ...)                           |
| `@nexdom/uimed-vue/plugins`     | `vitePluginUimed()` for Vite, and `vitestServerPluginUimed()` for Vitest               |
| `@nexdom/uimed-vue/unit-test`   | `vueTestUtilsPluginUimed()`, to mount the components in unit tests with Vue Test Utils |

## Breaking changes in 2.0

When upgrading an app from an earlier version, check each change below. The renames, imports, notifications and row alignment have before and after examples in [`references/guide/migration-v1-to-v2.md`](references/guide/migration-v1-to-v2.md).

- The components were renamed with the `U` prefix (e.g. `Root` → `UMain`, `Btn` → `UButton`, `ContentSet` → `USection`).
- The prop types (e.g. `AppBarConfig`, `SectionAction`) are no longer exported: derive them with `ComponentProps`.
- The theme is light only, with the library's own palette.
- `vitePluginUimed()` is required: it now provides the Unimed Slab font, which `createUimed()` no longer sets, and `sass-embedded` became a peer dependency (`vite-plugin-vuetify` no longer is).
- The app bar notifications take `when` (a text shown as is, e.g. `"10:30"` or `"Ontem"`) instead of `date`: the app formats the date.
- `URow` aligns its columns to the top by default, and its former `align` prop is now `alignY` (`align-y` in templates); `alignX` aligns them horizontally.
- `UMaskField` with `mask="cnpj"` accepts the alphanumeric CNPJ: its `v-model` may contain uppercase letters.
- The icons are inline SVGs from `@mdi/js`: the library no longer loads the Material Design Icons font, so `mdi-*` classes in the app stop working. Use the components' icon names.
- The items inside a navigation menu group no longer accept `icon`: only the first level items show icons.
- The navigation menu's first level items and groups require `icon`. From 1145px wide up, the menu is a 56px rail always visible on the left of the content, and the app bar no longer shows the button that opens it.
- The library only generates the utility classes its components use: the app can't rely on other utility classes (e.g. `ga-*`, `d-sm-flex`, `bg-red`).
