<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
  }>(),
  {
    icon: 'pi pi-info-circle',
  },
)
</script>

<template>
  <div
    class="bg-[#fef3c7] text-[#92400e] px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
  >
    <i :class="[icon, 'text-sm']"></i>
    <span class="text-[11.5px]"><slot /></span>
  </div>
</template>
