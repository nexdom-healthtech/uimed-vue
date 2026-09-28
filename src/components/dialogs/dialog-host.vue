<template>
  <!-- PascalCase, since `<dialog>` in the template would render the native HTML element instead -->
  <Dialog
    :model-value="isOpen"
    :title="request?.title"
    :actions
    :persistent="isRunning"
    @update:model-value="dismiss"
    @after-leave="showNext"
    >{{ request?.message }}</Dialog
  >
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import Dialog from "@/components/dialogs/dialog/dialog.vue";
import { dialogHostKey } from "@/components/dialogs/dialog/dialog-host-key.ts";
import type { DialogButtonAction } from "@/components/dialogs/dialog/types.ts";
import type { DialogRequest, DialogRequestAction } from "@/composables/dialogs/types.ts";
import { owners, requests } from "@/composables/dialogs/use-dialog.ts";
import { computed, onMounted, onUnmounted, provide, ref, shallowRef, watch } from "vue";

const owner = Symbol("dialog");

const isOwner = computed(() => owners.value[0] === owner);
const next = computed(() => (isOwner.value ? requests.value[0] : undefined));

/** Dialog on display, kept until its leave transition ends. */
const request = shallowRef<DialogRequest>();
const isOpen = ref(false);
const selected = shallowRef<DialogRequestAction>();
const isRunning = computed(() => selected.value !== undefined);

const actions = computed(() => {
  const current = request.value;
  if (!current) return undefined;

  return current.actions.map((action): DialogButtonAction => ({
    label: action.text,
    variant: action.variant,
    color: action.color,
    loading: selected.value === action,
    disabled: isRunning.value && selected.value !== action,
    onClick: () => void select(current, action),
  }));
});

// Confirmations are alert dialogs, and their text messages describe them
provide(dialogHostKey, { role: () => request.value?.role });

onMounted(() => owners.value.push(owner));
onUnmounted(() => (owners.value = owners.value.filter((item) => item !== owner)));

watch(next, show);

function show() {
  if (request.value) return;

  request.value = next.value;
  isOpen.value = next.value !== undefined;
}

function showNext() {
  request.value = undefined;
  show();
}

async function select(current: DialogRequest, action?: DialogRequestAction) {
  if (isRunning.value) return;

  requests.value.shift();
  selected.value = action;
  await current.select(action?.value);
  selected.value = undefined;
  isOpen.value = false;
}

function dismiss() {
  if (request.value) void select(request.value);
}
</script>
