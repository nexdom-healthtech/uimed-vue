<template>
  <Section
    :title="props.title"
    :subtitle="props.subtitle"
    :variant="props.variant"
    :data-testid="props.dataTestid"
    full-height
  >
    <SectionContent v-if="slots.default">
      <slot />
    </SectionContent>
  </Section>
</template>

<script lang="ts">
/**
 * Card of a single record listed by a {@link DataSet}, built on `USection`.
 * It fills the height of its grid column, so the cards of a row line up. Its
 * details, like a vertical `UTable`, go in the default slot.
 *
 * @example
 * ```vue
 * <template>
 *   <u-data-set :items="patients">
 *     <template #default="{ item }">
 *       <u-data-set-item :title="item.name" subtitle="Beneficiário">
 *         <u-table :headers="['Plano', 'Idade']" :items="[[item.plan, item.age]]" vertical />
 *       </u-data-set-item>
 *     </template>
 *   </u-data-set>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/data-set | DataSet Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import Section from "@/components/sections/section/section.vue";
import SectionContent from "@/components/sections/section-content/section-content.vue";
import type {
  DataSetItemProps,
  DataSetItemSlots,
} from "@/components/data-sets/data-set-item/types.ts";

const props = defineProps<DataSetItemProps>();

const slots = defineSlots<DataSetItemSlots>();
</script>
