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
</style>
