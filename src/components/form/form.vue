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
 * <form @submit="onSubmit">
 *   <!-- uimed-field-components -->
 *   <!-- uimed-submit-btn-component -->
 * </form>
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
  const { valid } = await event;
  if (valid) emit("submit", event satisfies SubmitEvent);
}
</script>
