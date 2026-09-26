<script setup lang="ts">
withDefaults(
  defineProps<{
    maxWidth?: string
  }>(),
  { maxWidth: 'max-w-2xl' },
)
</script>

<template>
  <div class="p-4 pt-4 pb-8 lg:p-6" :class="maxWidth !== 'none' ? maxWidth : ''">
    <slot></slot>
  </div>
</template>
