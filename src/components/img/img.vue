<template>
  <div
    :role="props.alt ? 'img' : undefined"
    :aria-label="props.alt || undefined"
    :data-testid="props.dataTestid"
  >
    <!--
      The image component exposes the alternative text twice, on its root element and on the
      inner image, so screen readers announce it twice. This wrapper carries the text instead,
      and the image component stays decorative.
    -->
    <v-img
      :src="props.src"
      alt=""
      :width="props.width"
      :height="props.height"
      :aspect-ratio="props.aspectRatio"
      :cover="props.cover"
      :eager="props.eager"
    />
  </div>
</template>

<script lang="ts">
/**
 * Image component, loaded when it's about to become visible. Set its
 * dimensions to reserve its space before it loads.
 *
 * @example
 * ```vue
 * <template>
 *   <u-row>
 *     <u-column cols="12">
 *       <u-img src="/logo.svg" alt="Logo do produto" :width="380" :height="88" eager />
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

const props = withDefaults(defineProps<ImgProps>(), {
  alt: "",
});
</script>
