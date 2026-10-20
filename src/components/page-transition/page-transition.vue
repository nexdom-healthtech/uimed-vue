<template>
  <!-- The page is wrapped so any page can be animated, whatever it renders at its root. The
  wrapper takes the parent's height, so pages with `fullHeight` still have a height to fill -->
  <v-fade-transition mode="out-in">
    <div :key="pageKey" class="h-100">
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
 * change is animated whenever `transitionKey` changes, which defaults to the
 * current route's `fullPath`: every navigation is animated, including the
 * ones that only change the route's params, query or hash. Attributes
 * (`class`, `style`...) aren't passed on.
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
import { computed } from "vue";
import { useRoute } from "vue-router";
import { VFadeTransition } from "vuetify/components";
import type { PageTransitionProps } from "@/components/page-transition/types.ts";

const props = defineProps<PageTransitionProps>();

const route = useRoute();

const pageKey = computed(() => props.transitionKey ?? route.fullPath);
</script>
