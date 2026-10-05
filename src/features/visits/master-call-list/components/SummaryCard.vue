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
  <div
    class="my-bnf-md flex flex-row flex-wrap gap-bnf-sm rounded-bnf-xl bg-bnf-sidebar p-bnf-xl shadow-bnf-sm"
  >
    <div
      v-for="summary in summaries"
      :key="summary.detail"
      class="flex grow basis-25 flex-col items-center"
    >
      <span class="text-[11px] text-bnf-sidebar-accent">{{ summary.detail }}</span>
      <span class="text-base font-bold text-bnf-sidebar-foreground">{{ summary.value }}</span>
    </div>
  </div>
</template>
