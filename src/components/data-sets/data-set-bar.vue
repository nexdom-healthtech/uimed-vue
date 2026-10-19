<template>
  <Row align-y="end">
    <!-- The search field leaves room above its text for the floating label, so its text, icon and
         underline sit below its middle. Centered on it, the actions would look higher than the
         field, so they line up with its underline instead -->
    <!-- No column grows to push the search field to the end of the line, so the actions and the
         search field share it in two columns, and the search field is aligned to the end of its
         own -->
    <Column v-if="props.actions?.length" :cols="props.searchable ? props.cols : '12'">
      <Row>
        <!-- Each action takes the full width of its column, which only stretches it below sm -->
        <Column
          v-for="({ label, onClick, ...action }, index) in props.actions"
          :key="index"
          cols="auto"
        >
          <Button full-width v-bind="action" @click="onClick">
            {{ label }}
          </Button>
        </Column>
      </Row>
    </Column>
    <Column v-if="props.searchable" :cols="props.actions?.length ? props.cols : '12'">
      <Row align-x="end">
        <Column cols="auto">
          <!-- Hides the empty messages area, which would misalign the field with the actions, and
               keeps the field from shrinking to its label, which is all a column of its own width
               would leave it -->
          <v-defaults-provider :defaults="searchFieldDefaults">
            <TextField v-model="search" type="search" label="Pesquisar" />
          </v-defaults-provider>
        </Column>
      </Row>
    </Column>
  </Row>
</template>

<script lang="ts">
/**
 * Bar above the records of a data set, with its actions at the start and its
 * search field at the end.
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VDefaultsProvider } from "vuetify/components";
import Button from "@/components/button/button.vue";
import Column from "@/components/grid/column/column.vue";
import type { ColumnProps } from "@/components/grid/column/types.ts";
import Row from "@/components/grid/row/row.vue";
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

  /**
   * Width, out of the bar's 12 columns, of the actions and of the search field
   * when both are rendered: `"6"` to share a line, or `"12"` to take a line
   * each, when the bar is too narrow for the search field to fit in half of it.
   */
  cols: Extract<ColumnProps["cols"], "6" | "12">;
}>();

const search = defineModel<string>({ default: "" });

const searchFieldDefaults = {
  VTextField: { hideDetails: "auto", minWidth: minDataSetItemWidth },
};
</script>
