<script setup lang="ts">
import SearchIcon from '@primeicons/vue/search'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    variant?: 'light' | 'dark'
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

const roundedClass: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}
</script>

<template>
  <div class="relative w-full">
    <SearchIcon
      size="16"
      color="var(--bnf-color-text-muted)"
      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    />
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder || 'Search...'"
      :class="[
        'pl-9 pr-3 text-sm outline-none w-full transition-colors',
        h ? `h-[${h}px]` : 'py-1 sm:py-2',
        roundedClass[props.rounded],
        variant === 'dark'
          ? 'bg-[color:var(--bnf-color-sidebar-hover)] border border-[color:var(--bnf-color-sidebar-border)] text-[color:var(--bnf-color-sidebar-foreground)] placeholder:text-[color:var(--bnf-color-sidebar-muted)] focus:border-bnf-primary'
          : 'bg-bnf-surface border border-bnf-border text-bnf-text placeholder:text-bnf-text-muted focus:border-bnf-primary',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
