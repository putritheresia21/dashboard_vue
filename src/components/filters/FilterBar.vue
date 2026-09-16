<script setup lang="ts">
import { computed, type Component } from 'vue'
import Button from 'primevue/button'
import SelectFilter from './fields/SelectFilter.vue'
import RangeFilter from './fields/RangeFilter.vue'

const componentMap: Record<string, any> = {
  select: SelectFilter,
  range: RangeFilter,
}

const props = withDefaults(
  defineProps<{
    filters: any[]
    modelValue: Record<string, any>
    data?: any[]
    showReset?: boolean
  }>(),
  {
    data: () => [],
    showReset: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const resolvedFilters = computed(() =>
  props.filters.map((f) => {
    if (f.type === 'select' && !Array.isArray(f.options)) {
      const opts = [...new Set(props.data.map((item) => item[f.key]))].filter(Boolean).sort()
      return { ...f, options: opts }
    }
    return f
  }),
)

const groupedRows = computed(() => {
  const rows = new Map<string, any[]>()
  resolvedFilters.value.forEach((f) => {
    const rowKey = f.row !== undefined ? `r-${f.row}` : `t-${f.type}`
    if (!rows.has(rowKey)) rows.set(rowKey, [])
    rows.get(rowKey)!.push(f)
  })
  return [...rows.values()]
})

function updateValue(key: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function resetAll() {
  const reset: Record<string, any> = {}
  props.filters.forEach((f) => {
    reset[f.key] = f.type === 'range' ? [f.min ?? 0, f.max ?? 100] : null
  })
  emit('update:modelValue', reset)
}
</script>

<template>
  <div v-if="filters.length" class="flex flex-col gap-3">
    <div
      v-for="(rowFilters, idx) in groupedRows"
      :key="idx"
      class="flex flex-wrap items-start gap-3"
    >
      <component
        :is="componentMap[f.type]"
        v-for="f in rowFilters"
        :key="f.key"
        :filter="f"
        :model-value="modelValue[f.key]"
        @update:model-value="updateValue(f.key, $event)"
      />
    </div>
    <div v-if="showReset" class="flex justify-end">
      <Button
        label="Reset Semua Filter"
        outlined
        text
        size="small"
        class="!border-teal-500 !text-teal-600 hover:!bg-teal-50"
        @click="resetAll"
      />
    </div>
  </div>
</template>
