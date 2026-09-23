<template>
  <div class="playground vp-raw">
    <div class="playground-preview">
      <slot />
    </div>
    <div class="playground-controls">
      <template v-for="[index, action] in Object.entries(actions)" :key="index">
        <u-row v-if="isButtonAction(action)">
          <u-column>
            <u-button :data-testid="action.dataTestid" @click="action.action">{{
              action.label
            }}</u-button>
          </u-column>
        </u-row>
        <u-checkbox
          v-else-if="isCheckboxAction(action)"
          :model-value="action.value"
          :label="action.label"
          :data-testid="action.dataTestid"
          @update:model-value="action.value = $event"
        />
        <u-text-field
          v-else
          :model-value="action.value"
          :label="action.label"
          :data-testid="action.dataTestid"
          @update:model-value="action.value = $event"
        />
      </template>
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UTextField, UButton, URow, UColumn, UCheckbox } from "../../../../dist/components.js";

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

interface Checkbox extends BaseInputAction {
  type: "checkbox";
  value: boolean;
}

interface Button extends BaseAction {
  type: "button";
  label: string;
  action: () => void;
}

type Action = Input | Button | Checkbox;

const actions = defineModel<Record<string, Action>>("actions", {
  default: () => ({}),
});

function isButtonAction(action: Action): action is Button {
  return action.type === "button";
}

function isCheckboxAction(action: Action): action is Checkbox {
  return action.type === "checkbox";
}
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
