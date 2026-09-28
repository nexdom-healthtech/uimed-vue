<template>
  <v-dialog
    v-model="model"
    :persistent="props.persistent"
    :max-width="maxWidth"
    :role
    :aria-labelledby="props.title ? titleId : contentId"
    :aria-describedby="host ? contentId : undefined"
    :data-testid="props.dataTestid"
    scrollable
    @after-enter="focusFirstElement"
    @after-leave="emit('afterLeave')"
  >
    <!--
      MD3 dialogs have a 24px padding, 16px between title and content, 24px between content and
      actions, and 8px between the end-aligned actions. Inside a dialog, the card parts already
      have 24px sides, 16px below the title, 24px below the content, and end-aligned actions 8px
      apart, but no prop sets the remaining paddings, hence the spacing classes.
    -->
    <!-- `data-u-dialog` identifies the card to the dialogs opened from this one -->
    <v-card :id="cardId" data-u-dialog>
      <v-card-item v-if="props.title" class="pt-6">
        <!-- Titles wrap instead of being truncated, since they're part of the message -->
        <v-card-title :id="titleId" class="text-wrap">{{ props.title }}</v-card-title>
      </v-card-item>
      <!-- Below a title, the card already removes the content's top padding -->
      <v-card-text :id="contentId" :class="{ 'pt-6': !props.title }"><slot /></v-card-text>
      <v-card-actions v-if="props.actions?.length" class="px-6 pt-0 pb-6">
        <Button
          v-for="({ label, onClick, ...action }, index) in props.actions"
          :key="index"
          v-bind="action"
          @click="onClick"
        >
          {{ label }}
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
/**
 * Dialog component to display content in a modal window, over the page, until it's closed.
 * Its title and actions stay in place while the content scrolls.
 *
 * @example
 * ```vue
 * <template>
 *   <u-dialog v-model="open" title="Title" :actions="[{ label: 'Close', onClick: () => (open = false) }]">
 *     Content
 *   </u-dialog>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/dialog | Dialog Guide}
 */
export default {
  inheritAttrs: false,
};

interface DialogFocus {
  isOpen: () => boolean;

  /** Element focused before the dialog opened, which gets the focus back when it closes. */
  origin: Element | null;
}

/** Focus state of the closed dialogs, by their card, for the dialogs opened from them. */
const closedDialogs = new WeakMap<Element, DialogFocus>();
</script>

<script setup lang="ts">
import Button from "@/components/button/button.vue";
import { dialogHostKey } from "@/components/dialogs/dialog/dialog-host-key.ts";
import type { DialogEmits, DialogProps, DialogSize } from "@/components/dialogs/dialog/types.ts";
import { computed, inject, onMounted, useId, watch } from "vue";
import { VCard, VCardActions, VCardItem, VCardText, VCardTitle, VDialog } from "vuetify/components";

const props = defineProps<DialogProps>();
const emit = defineEmits<DialogEmits>();
const model = defineModel<boolean>({ default: false });

/** Elements that can get the focus when the dialog opens. The first one in the dialog gets it. */
const focusable = [
  "button:not([disabled])",
  "[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

const maxWidths: Record<DialogSize, number> = { small: 400, medium: 560, large: 800 };

const host = inject(dialogHostKey, null);
const cardId = useId();
const titleId = useId();
const contentId = useId();

const maxWidth = computed(() => maxWidths[props.size ?? "medium"]);
const role = computed(() => host?.role() ?? "dialog");

/** Focus state of this dialog, shared with the dialogs opened from it. */
const focusState: DialogFocus = { isOpen: () => model.value, origin: null };

// On mount instead of an immediate watcher, since the DOM doesn't exist during server-side rendering
onMounted(() => onOpenChange(model.value));
watch(model, onOpenChange);

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    focusState.origin = document.activeElement;
    return;
  }

  // Registered once closed, while its card exists, for the dialogs opened from it
  const card = document.getElementById(cardId);
  if (card) closedDialogs.set(card, focusState);

  const target = findFocusTarget(focusState.origin);
  // Icons are usually SVG elements, which are focusable too
  if (hasFocus() && (target instanceof HTMLElement || target instanceof SVGElement)) target.focus();
}

/**
 * Element that gets the focus back when the dialog closes: its origin or, when the origin is
 * inside another dialog that closed meanwhile (and can't get the focus anymore), that dialog's.
 */
function findFocusTarget(origin: Element | null): Element | null {
  const card = origin?.closest("[data-u-dialog]");
  const owner = card && closedDialogs.get(card);
  return owner && !owner.isOpen() ? findFocusTarget(owner.origin) : origin;
}

/**
 * Whether the focus is on this dialog or lost (on nothing or on the page's body), so it can move.
 * Otherwise it moved elsewhere, e.g. to another dialog opened over this one.
 */
function hasFocus() {
  const active = document.activeElement;
  if (!active) return true;

  // Besides the card's elements, its ancestors may have the focus: the card's container, when
  // the dialog has no focusable element or when its text is clicked, or the page's body
  const card = document.getElementById(cardId);
  return card !== null && (card.contains(active) || active.contains(card));
}

function focusFirstElement() {
  document.querySelector<HTMLElement>(`[id="${cardId}"] :is(${focusable})`)?.focus();
}
</script>
