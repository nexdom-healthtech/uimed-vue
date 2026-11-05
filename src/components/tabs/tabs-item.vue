<template>
  <v-tabs-window-item :value="props.value" role="tabpanel" :data-testid="props.dataTestid">
    <slot />
  </v-tabs-window-item>
</template>

<script lang="ts">
/**
 * Content of a tab, displayed while the tab of the same `value` is selected in
 * the `UTabs`. It's only rendered when its tab is opened for the first time.
 * It must be placed inside a `UTabsContent`.
 *
 * @example
 * ```vue
 * <template>
 *   <u-tabs-content v-model="tab">
 *     <u-tabs-item value="dados">Dados</u-tabs-item>
 *   </u-tabs-content>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/tabs | Tabs Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VTabsWindowItem } from "vuetify/components";
import type { TabsItemProps } from "@/components/tabs/types.ts";

const props = defineProps<TabsItemProps>();
</script>
