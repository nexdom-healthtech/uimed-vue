<template>
  <v-dialog
    :model-value="isOpen"
    :persistent="isRunning"
    :role="request?.role"
    :aria-labelledby="request?.title ? titleId : messageId"
    :aria-describedby="messageId"
    max-width="560"
    @update:model-value="dismiss"
    @after-enter="focusFirstAction"
    @after-leave="showNext"
  >
    <!--
      MD3 dialogs have a 24px padding, 16px between title and message, 24px between message and
      actions, and 8px between the end-aligned actions. Inside a dialog, the card parts already
      have 24px sides, 16px below the title, 24px below the message, and end-aligned actions 8px
      apart, but no prop sets the remaining paddings, hence the spacing classes.
    -->
    <v-card v-if="request">
      <v-card-item v-if="request.title" class="pt-6">
        <!-- Titles wrap instead of being truncated, since they're part of the message -->
        <v-card-title :id="titleId" class="text-wrap">{{ request.title }}</v-card-title>
      </v-card-item>
      <!-- Below a title, the card already removes the message's top padding -->
      <v-card-text :id="messageId" :class="{ 'pt-6': !request.title }">{{
        request.message
      }}</v-card-text>
      <v-card-actions v-if="request.actions.length > 0" ref="actions" class="px-6 pt-0 pb-6">
        <Button
          v-for="(action, index) in request.actions"
          :key="index"
          :variant="action.variant"
          :color="action.color"
          :loading="selected === action"
          :disabled="isRunning && selected !== action"
          @click="select(request, action)"
        >
          {{ action.text }}
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import Button from "@/components/button/button.vue";
import type { DialogRequest, DialogRequestAction } from "@/composables/dialogs/types.ts";
import { owners, requests } from "@/composables/dialogs/use-dialog.ts";
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from "vue";
import { VCard, VCardActions, VCardItem, VCardText, VCardTitle, VDialog } from "vuetify/components";

const owner = Symbol("dialog");
const titleId = useId();
const messageId = useId();
const actions = useTemplateRef<ComponentPublicInstance>("actions");

const isOwner = computed(() => owners.value[0] === owner);
const next = computed(() => (isOwner.value ? requests.value[0] : undefined));

/** Dialog on display, kept until its leave transition ends. */
const request = shallowRef<DialogRequest>();
const isOpen = ref(false);
const selected = shallowRef<DialogRequestAction>();
const isRunning = computed(() => selected.value !== undefined);

/** Element focused before the dialog opened, which gets the focus back when it closes. */
let origin: Element | null = null;

onMounted(() => owners.value.push(owner));
onUnmounted(() => (owners.value = owners.value.filter((item) => item !== owner)));

watch(next, show);

function show() {
  if (request.value) return;

  origin = document.activeElement;
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

  // Icons are usually SVG elements, which are focusable too
  if (origin instanceof HTMLElement || origin instanceof SVGElement) origin.focus();
}

function dismiss() {
  if (request.value) void select(request.value);
}

function focusFirstAction() {
  actions.value?.$el.querySelector("button").focus();
}
</script>
