# AGENTS.md

## Project

`@nexdom/uimed-vue` is a Vue 3 UI component library for NEXDOM applications, built on top of [Vuetify](https://vuetifyjs.com/) and [Material Design 3](https://m3.material.io/). It's published to npm and documented via VitePress at https://nexdom-healthtech.github.io/uimed-vue/.

Tooling is built around [Vite+](https://github.com/voidzero-dev/vite-plus) (`vp`/`vpr`/`vpx` CLIs), not raw `vite`/`vitest`/`eslint` invocations.

## Using this library in an app

These steps are for developers _consuming_ `@nexdom/uimed-vue` in a Vue application (not for contributing to this repo — see the rest of this document for that).

### Install

```bash
vp add @nexdom/uimed-vue
# But, if you're not using Vite+ yet...
npm i @nexdom/uimed-vue
# Or
pnpm add @nexdom/uimed-vue
# Or
yarn add @nexdom/uimed-vue
```

Peer dependencies (`@fontsource/roboto`, `@mdi/font`, `@nexdom/shared`, `resize-observer-polyfill`, `vite-plugin-vuetify`, `vite-plus`, `vue`, `vue-router`, `vuetify`) must be installed alongside it — most package managers install these automatically, but confirm versions match what's declared in `package.json`'s `peerDependencies`.

### Setup

Add the Vite plugin:

```ts
// vite.config.ts
import { vitePluginUimed } from "@nexdom/uimed-vue/plugins.ts";

// ...

plugins: [vue(), vitePluginUimed()];

// ...
```

Register the plugin in the Vue app:

```ts
// main.js or main.ts
import { createApp } from "vue";
import { createUimed } from "@nexdom/uimed-vue";

import App from "./App.vue";

const uimed = createUimed();

createApp(App).use(uimed).mount("#app");
```

### Usage

Place the `Root` component at the top of `App.vue`, then add other components as needed:

```vue
<!-- App.vue -->
<template>
  <root>
    <!-- ... -->
  </root>
</template>

<script setup lang="ts">
import { Root } from "@nexdom/uimed-vue/components";
</script>
```

Never write CSS, classes or any kind of styling. Always use component props.

The library doesn't export prop types. Derive them with `ComponentProps` from `vue-component-type-helpers`:

```ts
import type { ComponentProps } from "vue-component-type-helpers";
import { UMain, USection } from "@nexdom/uimed-vue/components";

type MainProps = ComponentProps<typeof UMain>;
type AppBar = NonNullable<MainProps["appBar"]>;
type NavigationMenu = NonNullable<MainProps["navigationMenu"]>;
type SectionAction = NonNullable<ComponentProps<typeof USection>["actions"]>[number];
```

Available entry points: `@nexdom/uimed-vue` (root), `@nexdom/uimed-vue/components`, `@nexdom/uimed-vue/composables`, `@nexdom/uimed-vue/plugins`, `@nexdom/uimed-vue/unit-test` (test helpers, e.g. `vueTestUtilsPluginUimed()` for mounting components with Vuetify in Vitest).

Full component/composable reference lives in the [docs](https://nexdom-healthtech.github.io/uimed-vue/).

## Contributing to this repo

The sections below are for developers working _on_ this library itself.

### Dev environment setup

This project expects to be opened inside its devcontainer (VSCode). If commands below fail with missing shims/commands, run:

```bash
vp env doctor   # diagnose missing parts
vp env setup    # create shims like vpr and vpx
vp install      # install dependencies
```

## Commands

- `vpr check` — lint, formatter, and type-check (requires `build`/`pack` to have run first for the type-check step)
- `vp test --coverage` — unit tests with coverage (Vitest, jsdom, 100% coverage threshold enforced)
- `vpr test:mutations` — mutation tests (Stryker; thresholds: high 100, low 95, break 95)
- `vpr test:e2e` — E2E tests (Playwright, runs against the built docs preview site)
- `vpr depcruise` — architecture/dependency rules (dependency-cruiser)
- `vp pack` / `vpr build` — build the library
- `vpr docs` / `vpr docs:dev` — run docs site (imports the lib from `dist`, not `src` — run `vpr dev` in a second terminal to keep `dist` updated while iterating)

CI (`.github/workflows/ci.yml`) runs, in order: commitlint on PR commits, `vp pack`, `vpr check`, `vpr depcruise`, `vp test --coverage`, `vpr test:mutations`, `vpr test:e2e`. Match this locally before opening a PR.

## Code conventions

- All `src` code is written in English. `docs` content is written in Portuguese (aimed at Brazilian users), even though file/dir names stay in English.
  - `docs` must not mention Vuetify
- Never write CSS, classes or any kind of styling. Always use component props.
- Path aliases: `@/*` → `src/*`, `@e2e/*` → `e2e/*`.
- Every public component follows this pattern to block access to internals and give it an editor-hover description:

  ```vue
  <script lang="ts">
  /**
   * A short description of the component, shown when hovering it in the
   * editor.
   */
  export default {
    inheritAttrs: false,
  };
  </script>

  <script setup lang="ts">
  // component's implementation
  </script>
  ```

- Component layout: `src/components/<name>/<name>.vue`, `types.ts` for prop/option types, `__tests__/<name>.test.ts` for unit tests. Composables follow the same shape under `src/composables/<name>/`.
- Public components/composables/types are re-exported from `src/components/index.ts` and `src/composables/index.ts`.
- Every publicly exported component must use the `U` prefix on its export identifier (e.g., `UButton`, `UMain`), while internal file names and component names remain unprefixed.
- Use [JSDoc](https://jsdoc.app/about-getting-started) on every method/prop/type intended to be part of the public API — it's the primary documentation surface and supports markdown/code examples.
- Known workarounds (see CONTRIBUTING.md before touching related config): `stryker-vue-ignorer` patches a Stryker/Vue macro-hoisting issue; `vue-tsc` is used for type-check instead of Vite+'s built-in one due to an oxlint/Vue support gap. Both are meant to be removed once their upstream issues are fixed — don't build further on top of them without checking if they're still needed.

## Testing conventions

- Unit tests use Vitest + `@vue/test-utils`, with `vueTestUtilsPluginUimed()` from `@/unit-test.ts` to mount a Vuetify instance.
- Global unit test setup (`src/__tests__/setup.ts`) stubs `visualViewport`, uses fake timers, and silences `console.error/warn/log`.
- Coverage threshold is 100%; mutation testing threshold is 100% (break at 100). Don't add code paths without covering tests.
- E2E tests (Playwright, `e2e/`) run against the built docs preview (`http://localhost:4173/uimed-vue/`). Snapshots/screenshots live under `__snapshots__`/`__screenshot__` next to each spec.

## Library documentation and dependencies

The stack is newer than most AI models' training data (Vue 3.5, Vuetify 4, Vue Router 5, Vite+ 0.2, Vitest 4, TypeScript 6, VitePress 2 alpha, Stryker 10, Playwright 1.62), so don't rely on memory for library APIs.

- Before using an API this repo doesn't use yet, or implementing something from scratch, look it up in the version declared in `package.json`. The project's `.mcp.json` provides two servers for that:
  - `context7`, with these library IDs: Vue `/websites/vuejs`, Vuetify `/websites/vuetifyjs_en`, Vue Router `/websites/router_vuejs`, Vite+ `/websites/viteplus_dev`, Vitest `/vitest-dev/vitest`, Vue Test Utils `/vuejs/test-utils`, Playwright `/microsoft/playwright`, VitePress `/vuejs/vitepress`, Stryker `/stryker-mutator/stryker-js`.
  - `vuetify`, Vuetify's own server, for component and composable APIs and release notes. Its tools that create or update bins, links, playgrounds or bug reports publish content outside the repo and are denied in `.claude/settings.json`.
  - Queries to both servers leave your machine: describe what you need in generic terms and never include source code or business rules.
- Before adding a dependency, check whether Vuetify, `@nexdom/shared` or the current dependencies already cover the need. If not, confirm with the requester, check the package's docs, maintenance and license, and declare runtime dependencies as `peerDependencies` (enforced by dependency-cruiser's `use-peer-deps` rule).
- Vuetify is an internal detail: consumers use the library's props, and `docs` never mention Vuetify.

## AI agents

Besides this file, the repo ships Claude Code subagents in `.claude/agents/`:

- `issue-planner`: turns an issue into an API proposal plus open questions, before any code is written.
- `issue-implementer`: implements an issue end to end (source, tests, docs, E2E).
- `code-reviewer`: reviews a branch or PR against these conventions, without changing code.
- `dependency-updater`: evaluates and applies dependency updates, such as Dependabot PRs.

## Git workflow

- Trunk-based development. `main` is the only long-lived branch (`beta`/`alpha` exist only for pre-release/prototype work — see CONTRIBUTING.md for when to use them). `main`, `beta`, `alpha` are all protected against direct pushes.
- Short-lived branches are named after their intention (e.g. `fix-some-method-behavior`) and are deleted after merging back via PR.
- Commit messages MUST follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — enforced by commitlint in CI. Recent examples: `feat(components): ...`, `fix(composables): ...`, `test(e2e): ...`, `docs(root): ...`, `chore: ...`.
- Releases are automated via `semantic-release` (conventional-commits preset) — don't hand-edit versions/changelogs.
