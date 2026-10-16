<template>
  <!-- Each action takes the full width of its column, which only stretches it below sm -->
  <Column v-for="({ label, onClick, ...action }, index) in props.actions" :key="index" cols="auto">
    <Button full-width v-bind="action" @click="onClick">
      {{ label }}
    </Button>
  </Column>
  <!-- No prop pushes a column to the end of its line, and UColumn takes no classes, so an
       automatic start margin does it without setting a spacing value -->
  <v-col v-if="props.searchable" cols="12" sm="auto" class="ms-auto">
    <!-- Hides the empty messages area, which would misalign the field with the actions, and
         keeps the field from shrinking to its label, which is all a column of its own width
         would leave it -->
    <v-defaults-provider :defaults="searchFieldDefaults">
      <TextField v-model="search" type="search" label="Pesquisar" />
    </v-defaults-provider>
  </v-col>
</template>

<script lang="ts">
/**
 * Columns of the bar above the records of a data set, with its actions and its
 * search field, to be placed in the row that lays out the records below them.
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VCol, VDefaultsProvider } from "vuetify/components";
import Button from "@/components/button/button.vue";
import Column from "@/components/grid/column/column.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { SectionAction } from "@/components/sections/section/types.ts";
import { minDataSetItemWidth } from "@/composables/data-set/data-set.ts";

const props = defineProps<{
  /**
   * Actions about the whole list, rendered as buttons at the start of the bar.
   */
  actions?: SectionAction[];

  /**
   * Whether the search field is rendered at the end of the bar.
   */
  searchable?: boolean;
}>();

const search = defineModel<string>({ default: "" });

const searchFieldDefaults = {
  VTextField: { hideDetails: "auto", minWidth: minDataSetItemWidth },
};
</script>
