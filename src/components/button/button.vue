<template>
  <v-btn
    :variant="type"
    :color="color"
    :disabled="disabled"
    :loading="loading"
    :position="position"
    @click="$emit('click', $event)"
  >
    <template #default>
      <slot name="default" />
    </template>
    <template v-if="$slots.loader" #loader>
      <slot name="loader" />
    </template>
  </v-btn>
</template>

<script lang="ts">
 /**
 * Button component to be used throughout the application.
 */
</script>

<script setup lang="ts">
import { computed } from "vue";
import { VBtn } from "vuetify/components";

defineOptions({
  inheritAttrs: false,
});

type VBtnProps = InstanceType<typeof VBtn>["$props"];

/**
 * Props exposed by the {@link Button} component.
 */
type ButtonProps = {
  /**
   * Applies a distinct style variation to the button.
   * One of `elevated`, `flat`, `outlined`, `plain`, `text`, or `tonal`.
   * @default "elevated"
   */
  type?: VBtnProps["variant"];
  /**
   * Applies a color to the button. Accepts any color from the theme's
   * color palette, or a valid CSS color value.
   */
  color?: VBtnProps["color"];
  /**
   * Removes the ability to click or target the button.
   * @default false
   */
  disabled?: VBtnProps["disabled"];
  /**
   * Displays a loading indicator on the button, disabling interaction.
   * Pass a string to use a named slot as the loader, or `true` for the
   * default spinner.
   * @default false
   */
  loading?: VBtnProps["loading"];
  /**
   * Sets the CSS `position` of the button.
   * One of `absolute`, `fixed`, `relative`, `static`, or `sticky`.
   * When omitted, no positioning class is applied and the browser's
   * default (`static`) is used.
   * @default "static"
   */
  position?: VBtnProps["position"];
};

/**
 * Events emitted by the {@link Button} component.
 */
type ButtonEmits = {
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  click: (event: MouseEvent) => void;
};

const {
  type = "elevated",
  color = "primary",
  disabled = false,
  loading = false,
  position = "static",
} = defineProps<ButtonProps>();

const emit = defineEmits<ButtonEmits>();
</script>
