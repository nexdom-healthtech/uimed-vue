<template>
  <div
    :role="props.alt ? 'img' : undefined"
    :aria-label="props.alt || undefined"
    :data-testid="props.dataTestid"
  >
    <!--
      v-img gives the same alt to its root (as role="img" with aria-label) and to its inner <img>,
      which screen readers announce twice. This wrapper carries the alternative text instead, and
      v-img stays decorative.
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

const props = defineProps<ImgProps>();
</script>
