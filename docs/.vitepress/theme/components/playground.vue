<template>
  <div class="playground vp-raw">
    <div class="playground-preview">
      <slot />
    </div>
    <div class="playground-controls">
      <template v-for="[index, action] in Object.entries(actions)" :key="index">
        <u-row v-if="action.type === 'button'">
          <u-column>
            <u-button :data-testid="action.dataTestid" @click="action.action">{{
              action.label
            }}</u-button>
          </u-column>
        </u-row>
        <u-checkbox
          v-else-if="action.type === 'checkbox'"
          v-model="action.value"
          :label="action.label"
          :data-testid="action.dataTestid"
        />
        <u-autocomplete-field
          v-else-if="action.type === 'combobox'"
          v-model="action.value"
          :label="action.label"
          :items="action.items"
          :data-testid="action.dataTestid"
          strict
        />
        <u-text-field
          v-else
          v-model="action.value"
          :label="action.label"
          :data-testid="action.dataTestid"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  UTextField,
  UButton,
  URow,
  UColumn,
  UCheckbox,
  UAutocompleteField,
} from "../../../../dist/components.js";

interface BaseAction {
  dataTestid: string;
}

interface BaseInputAction extends BaseAction {
  label: string;
}

interface Input extends BaseInputAction {
  type: "text";
  value: string;
}

interface Combobox extends BaseInputAction {
  type: "combobox";
  value: string;
  items: (string | { label: string; value: string })[];
}

interface Checkbox extends BaseInputAction {
  type: "checkbox";
  value: boolean;
}

interface Button extends BaseAction {
  type: "button";
  label: string;
  action: () => void;
}

type Action = Input | Combobox | Button | Checkbox;

const actions = defineModel<Record<string, Action>>("actions", {
  default: () => ({}),
});
</script>

<style lang="scss" scoped>
.playground {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  &-preview {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    padding: 1rem;
  }

  &-controls {
    flex: 1;
    min-height: 275px;
    min-width: 275px;
  }
}
</style>
