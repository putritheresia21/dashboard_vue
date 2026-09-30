<script setup lang="ts">
import Select from 'primevue/select'

defineProps<{
  label: string
  icon?: string
  options: any[]
  placeholder?: string
  optionLabel?: string
  optionValue?: string
}>()

const model = defineModel<any>({ default: null })
</script>

<template>
  <div class="flex items-center gap-2 text-xs text-slate-400 shrink-0">
    <span class="flex items-center gap-1 font-medium whitespace-nowrap">
      <i v-if="icon" :class="icon" class="text-sm"></i>
      {{ label }}
    </span>
    <Select
      v-model="model"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :placeholder="placeholder"
      show-clear
      size="small"
      class="min-w-[10rem]"
    />
  </div>
</template>
