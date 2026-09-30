<script setup lang="ts">
import { computed } from 'vue'
import Select from 'primevue/select'
import type { any } from 'zod'

const props = defineProps<{
  modelValue?: string | null
  options: Array<string | { value: string; label: string }>
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const normalized = computed(() =>
  props.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
)

function onChange(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <Select
    :model-value="modelValue"
    :options="normalized"
    option-label="label"
    option-value="value"
    :disabled="disabled"
    class="h-7 w-full rounded-md border border-slate-300 bg-white shadow-sm"
    :class="disabled && 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-100 shadow-none'"
    :pt="{
      label: {
        class: `py-0 pl-2.5 text-[13px] font-bold ${disabled ? 'text-slate-400' : 'text-slate-800'}`,
      },
      dropdown: { class: 'w-7' },
      dropdownIcon: { class: `text-[10px] ${disabled ? 'text-slate-300' : 'text-slate-500'}` },
      option: ({ context }: any) => ({
        class: [
          'hover:bg-slate-100',
          context.focused && !context.selected ? 'bg-slate-100 text-slate-800' : '',
          context.selected ? 'bg-slate-200 text-slate-900' : '',
        ],
      }),
    }"
    @update:model-value="onChange"
  />
</template>
