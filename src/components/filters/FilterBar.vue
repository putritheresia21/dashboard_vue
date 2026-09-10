<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import SelectFilter from './SelectFilter.vue'
import RangeFilter from './RangeFilter.vue'
import {
  deriveSelectOptions,
  defaultFilterValue,
  type FilterDef,
  type SelectFilterDef,
} from './FilterTypes.ts'

const props = withDefaults(
  defineProps<{
    filters: FilterDef[]
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

function isSelectFilter(f: FilterDef): f is SelectFilterDef {
  return f.type === 'select'
}

const resolvedFilters = computed<FilterDef[]>(() =>
  props.filters.map((f): FilterDef => {
    if (isSelectFilter(f)) {
      const rawOptions = f.options
      const options: string[] = Array.isArray(rawOptions)
        ? rawOptions
        : deriveSelectOptions(props.data, f.key)
      return { ...f, options }
    }
    return f
  }),
)

// pisahkan select & range, supaya bisa dirender di baris terpisah
const selectFilters = computed(() => resolvedFilters.value.filter(isSelectFilter))
const rangeFilters = computed(() => resolvedFilters.value.filter((f) => f.type === 'range'))

function updateValue(key: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function resetAll() {
  const reset: Record<string, any> = {}
  props.filters.forEach((f) => {
    reset[f.key] = defaultFilterValue(f)
  })
  emit('update:modelValue', reset)
}
</script>

<template>
  <div v-if="filters.length" class="flex flex-col gap-3">
    <!-- baris 1: semua select filter -->
    <div v-if="selectFilters.length" class="flex flex-wrap items-center gap-3">
      <SelectFilter
        v-for="f in selectFilters"
        :key="f.key"
        :filter="f"
        :model-value="modelValue[f.key]"
        @update:model-value="updateValue(f.key, $event)"
      />
    </div>

    <!-- baris 2: semua range filter -->
    <div v-if="rangeFilters.length" class="flex flex-wrap items-start gap-3">
      <RangeFilter
        v-for="f in rangeFilters"
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
