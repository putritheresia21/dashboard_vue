<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { computed } from 'vue'

type FormCellValue = string | number | null | undefined

const props = withDefaults(
  defineProps<{
    value: FormCellValue
    editable?: boolean
    type?: 'number' | 'select' | 'text'
    options?: unknown[]
    min?: number
    placeholder?: string
  }>(),
  {
    editable: false,
    type: 'text',
    options: () => [],
    min: undefined,
    placeholder: '',
  },
)

const emit = defineEmits<{
  'update:value': [value: FormCellValue]
}>()

const numericValue = computed(() => (typeof props.value === 'number' ? props.value : null))
const displayValue = computed(() => props.value ?? '-')
</script>

<template>
  <span v-if="editable" class="text-slate-700">{{ displayValue }}</span>

  <InputNumber
    v-else-if="type === 'number'"
    :model-value="numericValue"
    :min="min ?? 0"
    size="small"
    input-class="!w-12 !text-center !py-1"
    @update:model-value="emit('update:value', $event ?? 0)"
  />

  <Select
    v-else-if="type === 'select'"
    :model-value="value"
    :options="options"
    :placeholder="placeholder"
    size="small"
    class="w-full max-w-[8rem]"
    @update:model-value="emit('update:value', $event)"
  />

  <input
    v-else
    :value="value"
    class="border borderslate-200 rounded px-2 py-1 text-sm w-full"
    @input="emit('update:value', ($event.target as HTMLInputElement).value)"
  />
</template>
