<template>
  <div class="vp-raw demo" :class="classes">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  col?: boolean;
  contained?: boolean;
  itemsCenter?: boolean;
}

const props = defineProps<Props>();
const classes = computed(() => ({
  "demo-col": props.col,
  "demo-contained": props.contained,
  "demo-items-center": props.itemsCenter,
}));
</script>

<style lang="scss" scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  // Apps render the components inside `UMain`, which sets the theme's text color. The demos
  // don't, so they'd inherit the docs' text color instead
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-background)) calc(var(--v-high-emphasis-opacity) * 100%),
    transparent
  );

  &-items-center {
    align-items: center;
  }

  &-contained {
    contain: layout;
  }

  &-col {
    flex-direction: column;
  }
}

/**
This class is a workaround, since Vuetify's V-App uses v-layout class to fill full with
but, since we don't actually use V-Layout, its class isn't bundled for production.
 */
:deep(.v-layout) {
  flex: 1 1 auto;
  overflow: hidden;
}
</style>
