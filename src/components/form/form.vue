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
 * <template>
 *  <u-form @submit="onSubmit">
 *    <!-- uimed-field-components -->
 *     <!-- uimed-submit-btn-component -->
 *  </u-form>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/form | Form Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type FormEmits, type FormProps } from "@/components/form/types.ts";
import type { SubmitEventPromise } from "vuetify";
import { VForm } from "vuetify/components";

const props = defineProps<FormProps>();
const emit = defineEmits<FormEmits>();

async function onSubmit(event: SubmitEventPromise) {
  // A submit event always targets its form, but the DOM types its target as any `EventTarget`
  if (hasLoadingSubmitButton(event.target as HTMLFormElement)) return;

  const { valid } = await event;
  if (valid) emit("submit", event satisfies SubmitEvent);
}

/**
 * Whether one of the form's submit buttons, including the ones outside it linked by `form`, is
 * loading, which `Button` marks with `aria-disabled`.
 */
function hasLoadingSubmitButton(form: HTMLFormElement) {
  return Array.from(form.elements).some((element) =>
    element.matches("[type=submit][aria-disabled=true]"),
  );
}
</script>
