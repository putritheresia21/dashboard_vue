<script setup lang="ts">
import { BadgeInfoIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'

withDefaults(
  defineProps<{
    icon?: object
  }>(),
  {
    icon: () => BadgeInfoIcon,
  },
)
</script>

<template>
  <div
    class="flex w-fit max-w-full self-start items-center justify-start gap-bnf-sm rounded-bnf-lg bg-bnf-warning px-bnf-lg py-bnf-md text-left text-sm font-medium text-bnf-warning-foreground"
  >
    <HugeiconsIcon :icon="icon" :size="16" :stroke-width="1.8" class="shrink-0" />
    <span class="text-[11.5px]"><slot /></span>
  </div>
</template>
