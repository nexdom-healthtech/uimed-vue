<template>
  <!-- PascalCase, since `<dialog>` in the template would render the native HTML element instead -->
  <Dialog
    :key
    :model-value="isOpen"
    :title="request?.title"
    :actions
    @update:model-value="dismiss"
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
/**
 * Changes for every dialog on display, so each one gets its own `Dialog`, open from the start.
 * The next dialog can then open right after a dismissed one, whose `v-model` stays `true`.
 */
const key = shallowRef<symbol>();
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

// Confirmations are alert dialogs, and their text messages describe them. The dialog can't be
// closed while the confirmed action runs, and the next one is displayed once it leaves
provide(dialogHostKey, {
  role: () => request.value?.role,
  persistent: () => isRunning.value,
  afterLeave: showNext,
});

onMounted(() => owners.value.push(owner));
onUnmounted(() => (owners.value = owners.value.filter((item) => item !== owner)));

watch(next, show);

function show() {
  if (request.value) return;

  request.value = next.value;
  key.value = Symbol();
  isOpen.value = next.value !== undefined;
}

function showNext() {
  request.value = undefined;
  show();
}

async function select(current: DialogRequest, action?: DialogRequestAction) {
  requests.value.shift();
  selected.value = action;
  await current.select(action?.value);
  selected.value = undefined;
  // A dismissed dialog already left, and the next one may be on display by now
  if (action) isOpen.value = false;
}

/** Called once a dialog closed by the user leaves, right before the next one is displayed. */
function dismiss() {
  if (request.value) void select(request.value);
}
</script>
