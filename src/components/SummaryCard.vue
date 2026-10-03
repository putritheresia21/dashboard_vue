<script setup lang="ts">
interface Summary {
  detail: string
  value: number | string
}

defineProps<{
  summaries: Summary[]
}>()
</script>

<template>
  <div class="flex flex-row flex-wrap gap-2 bg-[#0B1734] rounded-2xl p-5 shadow-sm mt-3 mb-3">
    <div
      v-for="summary in summaries"
      :key="summary.detail"
      class="flex grow basis-25 flex-col items-center"
    >
      <span class="text-[11px] text-[#93A2C8]">{{ summary.detail }}</span>
      <span class="text-base text-white font-bold">{{ summary.value }}</span>
    </div>
  </div>
</template>
