<template>
  <v-tabs-window v-model="modelValue" :data-testid="props.dataTestid">
    <slot />
  </v-tabs-window>
</template>

<script lang="ts">
/**
 * Content of a `UTabs`, displaying the `UTabsItem` of the selected tab. It
 * shares the same `v-model` with the `UTabs`, and should come right after it.
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
import { VTabsWindow } from "vuetify/components";
import type { TabsContentProps, TabsValue } from "@/components/tabs/types.ts";

const props = defineProps<TabsContentProps>();
const modelValue = defineModel<TabsValue>();
</script>
