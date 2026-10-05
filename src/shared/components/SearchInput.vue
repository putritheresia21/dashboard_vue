<script setup lang="ts">
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    variant?: 'light' | 'dark' | 'muted'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    h?: number //dalam ukuran px
  }>(),
  {
    placeholder: 'Search...',
    variant: 'light',
    rounded: 'lg',
    h: undefined,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const variantClass: Record<string, string> = {
  dark: 'bg-[color:var(--bnf-color-sidebar-hover)] border border-[color:var(--bnf-color-sidebar-border)] text-[color:var(--bnf-color-sidebar-foreground)] placeholder:text-[color:var(--bnf-color-sidebar-muted)] focus:border-bnf-primary',
  light:
    'bg-bnf-surface border border-bnf-border text-bnf-text placeholder:text-bnf-text-muted focus:border-bnf-primary',
  muted:
    'bg-bnf-surface-subtle border border-transparent text-bnf-text placeholder:text-bnf-text-muted focus:border-bnf-primary',
}

const roundedClass: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-bnf-sm',
  md: 'rounded-bnf-md',
  lg: 'rounded-bnf-lg',
  xl: 'rounded-bnf-xl',
  '2xl': 'rounded-bnf-xl',
  full: 'rounded-bnf-pill',
}
</script>

<template>
  <div class="relative w-full">
    <HugeiconsIcon
      :icon="Search01Icon"
      :size="16"
      :stroke-width="1.8"
      class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bnf-text-muted"
    />
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder || 'Search...'"
      :style="h ? { height: `${h}px` } : undefined"
      :class="[
        'pl-9 pr-3 text-sm outline-none w-full transition-colors',
        h ? '' : 'py-bnf-xs sm:py-bnf-sm',
        roundedClass[props.rounded],
        variantClass[variant],
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
