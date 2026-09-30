<script setup lang="ts">
import Select from 'primevue/select'

defineProps<{
  filter: {
    type: 'select'
    key: string
    row?: number
    placeholder: string
    [key: string]: any
  }
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()
</script>

<template>
  <Select
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    v-bind="filter"
    show-clear
    size="small"
    class="flex-1 min-w-[10rem] max-w-xs"
  />
</template>
