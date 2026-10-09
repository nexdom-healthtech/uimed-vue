<template>
  <v-icon-btn
    :icon="iconToVuetifyIcon[props.icon]"
    :aria-label="props.label"
    :color
    :data-testid="props.dataTestid"
    @click="onClick"
  />
</template>

<script lang="ts">
/**
 * Button that shows only an icon, for actions whose icon is enough to identify them, such as
 * editing a record of a list. Its `label` is the name assistive technologies read.
 *
 * @example
 * ```vue
 * <template>
 *   <u-icon-button icon="cog" label="Configurações" @click="onClick" />
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/icon-button | IconButton Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VIconBtn } from "vuetify/components";
import type { IconButtonEmits, IconButtonProps } from "@/components/icon-button/types.ts";
import useVuetifyColor from "@/composables/colors/use-vuetify-color.ts";
import { iconToVuetifyIcon } from "@/consts/icons.ts";

const props = defineProps<IconButtonProps>();
const emit = defineEmits<IconButtonEmits>();

const color = useVuetifyColor(() => props.color);

function onClick(event: MouseEvent) {
  emit("click", event);
}
</script>
