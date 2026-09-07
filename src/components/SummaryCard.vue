<script setup lang="ts">
import ArrowUpIcon from '@primeicons/vue/arrow-up'
import ArrowDownIcon from '@primeicons/vue/arrow-down'

withDefaults(
  defineProps<{
    cards: {
      label: string
      value: string
      change?: string
      positive?: boolean
    }[]
    columns?: 2 | 3 | 4
  }>(),
  { columns: 4 },
)
</script>

<template>
  <div
    class="grid grid-cols-2 gap-4"
    :class="columns === 2 ? 'lg:grid-cols-2' : columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'"
    style="margin-bottom: 22px; margin-top: 22px"
  >
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
    >
      <p class="text-sm text-slate-500">{{ card.label }}</p>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xl sm:text-2xl font-bold text-slate-800">{{ card.value }}</span>
        <span
          v-if="card.change"
          class="flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full"
          :class="card.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
        >
          <component :is="card.positive ? ArrowUpIcon : ArrowDownIcon" size="10" />
          {{ card.change }}
        </span>
      </div>
    </div>
  </div>
</template>
