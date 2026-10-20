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
import Row from "@/components/grid/row/row.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { DataSetBarProps } from "@/components/data-sets/types.ts";
import { minDataSetItemWidth } from "@/composables/data-set/data-set.ts";

const props = defineProps<DataSetBarProps>();

const search = defineModel<string>({ default: "" });

const searchFieldDefaults = {
  VTextField: { hideDetails: "auto", minWidth: minDataSetItemWidth },
};
</script>
