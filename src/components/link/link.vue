<template>
  <!-- No Vuetify component renders an inline text link, so the classes remove the browser's underline
  and set the theme's link color, instead of the browser's blue and purple -->
  <component
    :is="isExternalRoute(props.route) ? 'a' : RouterLink"
    v-bind="routeProps"
    class="text-decoration-none text-link"
    :data-testid="props.dataTestid"
  >
    <slot />
  </component>
</template>

<script lang="ts">
/**
 * Standalone text link, such as "Forgot your password?" below a login form.
 * Routes inside the app navigate through the app's router, and URLs starting
 * with `http` navigate through the browser, in the same tab.
 *
 * @example
 * ```vue
 * <template>
 *   <u-link route="/forgot-password">Forgot your password?</u-link>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/link | Link Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { LinkProps } from "@/components/link/types.ts";
import useRouteProps, { isExternalRoute } from "@/composables/navigation/use-route-props.ts";

const props = defineProps<LinkProps>();

const routeProps = useRouteProps(() => props.route);
</script>
