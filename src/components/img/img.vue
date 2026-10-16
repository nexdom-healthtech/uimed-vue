<template>
  <v-img
    :src="props.src"
    alt=""
    :width="props.width"
    :height="props.height"
    :aspect-ratio="props.aspectRatio"
    :cover="props.cover"
    :eager="props.eager"
    :data-testid="props.dataTestid"
  />
</template>

<script lang="ts">
/**
 * Decorative image, ignored by assistive technologies, loaded when it's about
 * to become visible. Set its dimensions to reserve its space before it loads.
 *
 * @example
 * ```vue
 * <template>
 *   <u-row>
 *     <u-column cols="12">
 *       <u-img src="/logo.svg" :width="380" :height="88" eager />
 *     </u-column>
 *   </u-row>
 * </template>
 * ```
 *
 * @see {@link https://nexdom-healthtech.github.io/uimed-vue/guide/components/img | Img Guide}
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { VImg } from "vuetify/components";
import type { ImgProps } from "@/components/img/types.ts";

const props = defineProps<ImgProps>();
</script>
