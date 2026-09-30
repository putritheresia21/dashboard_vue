<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { computed } from 'vue'
import { any } from 'zod'

const props = withDefaults(
  defineProps<{
    value: any
    editable?: boolean
    type?: 'number' | 'select' | 'text'
    options?: any[]
    min?: number
    placeholder?: string
  }>(),
  {
    editable: false,
    type: 'text',
  },
)

const emit = defineEmits<{
  'update:value': [value: any]
}>()

const displayValue = computed(() => props.value ?? '-')
</script>

<template>
  <span v-if="editable" class="text-slate-700">{{ displayValue }}</span>

  <InputNumber
    v-else-if="type === 'number'"
    :model-value="value"
    @update:model-value="emit('update:value', $event ?? 0)"
    :min="min ?? 0"
    size="small"
    input-class="!w-12 !text-center !py-1"
  />

  <Select
    v-else-if="type === 'select'"
    :model-value="value"
    @update:model-value="emit('update:value', $event)"
    :options="options"
    :placeholder="placeholder"
    size="small"
    class="w-full max-w-[8rem]"
  />

  <input
    v-else
    :value="value"
    @input="emit('update:value', ($event.target as HTMLInputElement).value)"
    class="border borderslate-200 rounded px-2 py-1 text-sm w-full"
  />
</template>
