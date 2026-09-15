<template>
  <v-app :data-testid="props.dataTestid">
    <app-bar
      v-if="appBarProps"
      v-bind="appBarProps"
      v-model:notifications-open="notificationsOpen"
      v-model:navigation-open="navigationMenuOpen"
    />

    <navigation-menu
      v-if="props.navigationMenu"
      v-bind="props.navigationMenu"
      v-model="navigationMenuOpen"
    />

    <v-main>
      <container>
        <slot />
        <toast />
      </container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
/**
 * Root component to be placed at the top of the component tree.
 *
 * @example
 * ```vue
 * <root>
 *   <!-- uimed-components -->
 * </root>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/root | Root Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import AppBar from "@/components/app-bar/app-bar.vue";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import { type RootProps } from "@/components/root/types.ts";
import { VApp, VMain } from "vuetify/components";
import Container from "@/components/grid/container/container.vue";
import Toast from "@/components/dialogs/toast.vue";
import { computed, ref } from "vue";

const props = defineProps<RootProps>();
const appBarProps = computed(() =>
  props.appBar ? { ...props.appBar, navigation: props.navigationMenu !== undefined } : undefined,
);

const notificationsOpen = defineModel<boolean>("notificationsOpen", { default: false });
const navigationMenuOpen = ref<boolean>(false);
</script>
