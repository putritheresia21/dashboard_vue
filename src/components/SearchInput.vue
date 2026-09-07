<script setup lang="ts">
import SearchIcon from '@primeicons/vue/search'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="relative">
    <SearchIcon
      size="16"
      color="#94a3b8"
      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    />
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder || 'Search...'"
      class="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-400 w-64"
    />
  </div>
</template>
