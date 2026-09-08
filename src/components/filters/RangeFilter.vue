<script setup lang="ts">
import Slider from 'primevue'

defineProps<{
  filter: {
    type: 'range'
    key: string
    label: string
    min?: number
    max?: number
    unit?: string
    compute?: (row: any) => number
  }
  modelValue: [number, number]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]]
}>()
</script>

<template>
  <div class="bg-slate-50 rounded-xl p-4 w-full sm:w-72">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {{ filter.label }}
      </span>
      <span class="text-xs font-medium px2 py-0.5 rounded-full bg-emerald-50 text-emerald-600"
        >{{ modelValue?.[0] ?? filter.min ?? 0 }}{{ filter.unit }}
        -
        {{ modelValue?.[1] ?? filter.max ?? 100 }}{{ filter.unit }}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-400 w-8 text-right"
        >{{ filter.min ?? 0 }}{{ filter.unit }}</span
      >
      <Slider
        :model-value="modelValue ?? [filter.min ?? 0, filter.max ?? 100]"
        range
        :min="filter.min ?? 0"
        :max="filter.max ?? 100"
        class="flex-1"
      />
      <span class="text-xs text-slate-400 w-10">{{ filter.max ?? 100 }}{{ filter.unit }}</span>
    </div>
  </div>
</template>
