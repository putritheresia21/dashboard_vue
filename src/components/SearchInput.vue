<script setup lang="ts">
import SearchIcon from '@primeicons/vue/search'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    variant?: 'light' | 'dark'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  }>(),
  {
    rounded: 'lg',
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
      :color="variant === 'dark' ? '#94a3b8' : '#94a3b8'"
      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    />
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="placeholder || 'Search...'"
      :class="[
        'pl-9 pr-3 py-1 sm:py-2 text-sm outline-none w-full transition-colors',
        roundedClass[props.rounded],
        variant === 'dark'
          ? 'bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:border-blue-400'
          : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400',
      ]"
    />
  </div>
</template>
