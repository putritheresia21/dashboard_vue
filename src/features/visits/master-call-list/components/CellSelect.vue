<script setup lang="ts">
import { Select } from '@bernofarm/core'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

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
    v-bind="$attrs"
    :model-value="modelValue"
    :options="normalized"
    option-label="label"
    option-value="value"
    :disabled="disabled"
    class="h-7 w-full rounded-md border border-bnf-border bg-bnf-surface shadow-sm"
    :class="
      disabled &&
      'cursor-not-allowed border-bnf-border bg-bnf-surface-muted opacity-100 shadow-none'
    "
    :pt="{
      label: {
        class: `py-0 pl-2.5 text-[13px] font-bold ${disabled ? 'text-bnf-text-muted' : 'text-bnf-text'}`,
      },
      dropdown: { class: 'w-7' },
      dropdownIcon: {
        class: `text-[10px] ${disabled ? 'text-bnf-text-muted' : 'text-bnf-text-muted'}`,
      },
      option: ({ context }: { context: { focused?: boolean; selected?: boolean } }) => ({
        class: [
          'hover:bg-bnf-surface-muted',
          context.focused && !context.selected ? 'bg-bnf-surface-muted text-bnf-text' : '',
          context.selected ? 'bg-bnf-surface-muted text-bnf-text' : '',
        ],
      }),
    }"
    @update:model-value="onChange"
  />
</template>
