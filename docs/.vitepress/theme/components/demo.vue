<template>
  <div class="vp-raw demo" :class="{ 'demo-col': col }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ col?: boolean }>();
</script>

<style lang="scss" scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

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
}
</style>
