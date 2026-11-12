<template>
  <!-- The selected tab's text and indicator take the tertiary's text shade -->
  <v-tabs v-model="modelValue" color="tertiary-text" :data-testid="props.dataTestid">
    <v-tab
      v-for="(item, index) in props.items"
      :key="index"
      :value="item.value"
      :text="item.title"
    />
  </v-tabs>
</template>

<script lang="ts">
/**
 * Row of tabs that selects which content of a `UTabsContent` is displayed. The
 * `UTabs` and the `UTabsContent` share the same `v-model`, which takes the
 * selected tab's `value` (or its position, starting at 0, when it has none).
 * When the `v-model` is empty, the first tab is selected.
 *
 * @example
 * ```vue
 * <template>
 *   <u-tabs v-model="tab" :items="[{ title: 'Dados', value: 'dados' }, { title: 'Endereço', value: 'endereco' }]" />
 *   <u-tabs-content v-model="tab">
 *     <u-tabs-item value="dados">Dados</u-tabs-item>
 *     <u-tabs-item value="endereco">Endereço</u-tabs-item>
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
import { VTab, VTabs } from "vuetify/components";
import type { TabsProps, TabsValue } from "@/components/tabs/types.ts";

const props = defineProps<TabsProps>();
const modelValue = defineModel<TabsValue>();
</script>
