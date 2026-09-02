<template>
  <VForm :id="props.id" :data-testid="props.dataTestid" @submit.prevent="onSubmit">
    <slot />
  </VForm>
</template>

<script lang="ts">
/**
 * Form component to be used throughout the application.
 *
 * @example
 * ```vue
 * <frm @submit="onSubmit">
 *   <!-- uimed-field-components -->
 *   <!-- uimed-submit-btn-component -->
 * </frm>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/frm | Form Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type FrmEmits, type FrmProps } from "@/components/frm/types.ts";
import type { SubmitEventPromise } from "vuetify";
import { VForm } from "vuetify/components";

const props = defineProps<FrmProps>();
const emit = defineEmits<FrmEmits>();

async function onSubmit(event: SubmitEventPromise) {
  const { valid } = await event;
  if (valid) emit("submit", event satisfies SubmitEvent);
}
</script>
