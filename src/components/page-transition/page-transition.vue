<template>
  <!-- The page is wrapped so any page can be animated, whatever it renders at its root. The
  wrapper takes the parent's height, so pages with `fullHeight` still have a height to fill -->
  <v-fade-transition mode="out-in">
    <div :key="getPageKey(slots.default?.())" class="h-100">
      <slot />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
/**
 * Animates the change between the pages rendered by the app's router: the
 * current page fades out before the next one fades in. When the operating
 * system asks for reduced motion, the pages change without animation.
 *
 * The page is rendered inside a `div` that takes the whole height of its
 * parent, so any page is animated, whatever it renders at its root. The
 * change happens when the slot renders another component, or the same one
 * with another `key` (e.g. `:key="route.fullPath"`, to also animate a route
 * whose params change). Attributes (`class`, `style`...) aren't passed on.
 *
 * @example
 * ```vue
 * <template>
 *   <u-main>
 *     <router-view v-slot="{ Component }">
 *       <u-page-transition>
 *         <component :is="Component" />
 *       </u-page-transition>
 *     </router-view>
 *   </u-main>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/page-transition | Page Transition Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import type { VNode } from "vue";
import { VFadeTransition } from "vuetify/components";
import { getPageKey } from "@/utils/page-key.ts";

const slots = defineSlots<{
  /** The page to animate, usually the route's component (`<component :is="Component" />`). */
  default?: () => VNode[];
}>();
</script>
