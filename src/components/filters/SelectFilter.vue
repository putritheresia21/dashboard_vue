<script setup lang="ts">
import Select from 'primevue'

defineProps<{
  filter: {
    type: 'select'
    key: string
    placeholder: string
    options?: string[]
  }
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()
</script>

<template>
  <Select
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :options="filter.options"
    :placeholder="filter.placeholder"
    show-clear
    size="small"
    class="w-full sm:w-40"
  />
</template>
