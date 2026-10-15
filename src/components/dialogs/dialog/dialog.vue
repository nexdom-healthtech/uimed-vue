<template>
  <v-dialog
    v-model="isActive"
    :persistent="isLoading"
    :max-width="maxWidth"
    :role
    :aria-label="title"
    :aria-labelledby="title ? undefined : contentId"
    :aria-describedby="host ? contentId : undefined"
    :data-testid="props.dataTestid"
    scrollable
    @after-enter="focusFirstElement"
    @after-leave="onAfterLeave"
  >
    <!-- `data-u-dialog` identifies the card to the dialogs opened from this one -->
    <v-card ref="card" data-u-dialog>
      <v-card-item>
        <!-- The card's title prop has no room for the close button, so the title is built by hand.
        The flex classes place the button at the end, and the truncation brings back the ellipsis
        that the flex layout turns off -->
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-truncate">{{ title }}</span>
          <v-icon-btn
            icon="$close"
            aria-label="Fechar"
            :aria-disabled="isLoading"
            variant="text"
            size="small"
            data-u-dialog-close
            :disabled="isLoading"
            @click="close"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <div :id="contentId"><slot /></div>
      </v-card-text>
      <template v-if="props.actions?.length" #actions>
        <Button
          v-for="({ label, onClick, ...action }, index) in props.actions"
          :key="index"
          v-bind="action"
          @click="onClick"
        >
          {{ label }}
        </Button>
      </template>
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
</script>

<script setup lang="ts">
import Button from "@/components/button/button.vue";
import { dialogHostKey } from "@/components/dialogs/dialog/dialog-host-key.ts";
import type { DialogProps, DialogSize } from "@/components/dialogs/dialog/types.ts";
import { useDialogFocus } from "@/composables/dialogs/use-dialog-focus.ts";
import { useDialogLoading } from "@/composables/dialogs/use-dialog-loading.ts";
import {
  computed,
  inject,
  ref,
  useId,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from "vue";
import { VCard, VCardItem, VCardText, VCardTitle, VDialog, VIconBtn } from "vuetify/components";

const props = defineProps<DialogProps>();
/**
 * Whether the dialog is open. Updated to `false` when the user closes it with the "Fechar" button
 * at its top right, `Esc`, a click outside or the browser's back button, once its leave transition
 * ends.
 */
const model = defineModel<boolean>({ default: false });

const maxWidths: Record<DialogSize, number> = { small: 400, medium: 560, large: 800 };

const host = inject(dialogHostKey, null);
const contentId = useId();
const card = useTemplateRef<ComponentPublicInstance>("card");

const title = computed(() => props.title || undefined);
const maxWidth = computed(() => maxWidths[props.size ?? "medium"]);
const role = computed(() => host?.role() ?? "dialog");

/**
 * Whether the dialog is displayed. It follows `v-model`, but turns `false` as soon as the user
 * closes the dialog, while `v-model` only does once the leave transition ends.
 */
const isActive = ref(model.value);
watch(model, (value) => (isActive.value = value));

// The user can't close the dialog while an action loads, but `v-model` still can. Nor can they
// with the close button, which is disabled meanwhile
const { isLoading } = useDialogLoading(() => props.actions);

const { focusFirstElement } = useDialogFocus(
  () => isActive.value,
  () => card.value?.$el,
);

/**
 * Closes the dialog from its close button, unless an action loads. The icon button's `disabled`
 * only blocks pointer clicks and leaves the native `disabled` attribute out, hence its
 * `aria-disabled`.
 */
function close() {
  // A key press still activates the disabled button while it has the focus
  if (!isLoading.value) isActive.value = false;
}

function onAfterLeave() {
  // Already `false` when `v-model` closed the dialog, in which case nothing is emitted
  model.value = false;
  host?.afterLeave();
}
</script>
