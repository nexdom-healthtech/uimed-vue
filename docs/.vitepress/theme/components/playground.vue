<template>
  <div class="playground vp-raw">
    <div class="playground-preview">
      <slot />
    </div>
    <div class="playground-controls">
      <template v-for="[index, action] in Object.entries(actions)">
        <row v-if="action.type === 'button'">
          <column>
            <btn :data-testid="action.dataTestid" @click="action.action">{{ action.label }}</btn>
          </column>
        </row>
        <text-field
          v-else
          :model-value="action.value"
          :label="action.label"
          :data-testid="action.dataTestid"
          @update:model-value="updateActions(index, $event)"
        />
      </template>
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TextField, Btn, Row, Column } from "../../../../dist/components.js";

interface Input {
  type: "text";
  value: string;
  label: string;
  dataTestid: string;
}

interface Button {
  type: "button";
  label: string;
  dataTestid: string;
  action: () => void;
}

const actions = defineModel<Record<string, Input | Button>>("actions", { default: () => ({}) });

function updateActions(index: keyof typeof actions.value, newValue: string) {
  const action = actions.value[index];
  const newAction = { ...action, value: newValue };
  actions.value = { ...actions.value, [index]: newAction };
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
    min-height: 275px;
    min-width: 275px;
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
