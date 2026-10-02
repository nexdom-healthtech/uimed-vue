<template>
  <v-dialog
    v-model="isActive"
    :persistent="host?.persistent()"
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
    <v-card ref="card" :title data-u-dialog>
      <template #text>
        <div :id="contentId"><slot /></div>
      </template>
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
import {
  computed,
  inject,
  ref,
  useId,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from "vue";
import { VCard, VDialog } from "vuetify/components";

const props = defineProps<DialogProps>();
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

const { focusFirstElement } = useDialogFocus(
  () => isActive.value,
  () => card.value?.$el,
);

function onAfterLeave() {
  // Already `false` when `v-model` closed the dialog, in which case nothing is emitted
  model.value = false;
  host?.afterLeave();
}
</script>
