<template>
  <div class="playground">
    <div class="playground-preview">
      <slot />
    </div>
    <div class="playground-controls">
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playground {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  &-preview {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 275px;
    min-width: 275px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
  }

  &-controls {
    flex: 1;
    min-height: 275px;
    min-width: 275px;
  }
}
</style>
