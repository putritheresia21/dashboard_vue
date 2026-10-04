<script setup lang="ts">
interface Step {
  title: string
  subtitle?: string
  done: boolean
}

defineProps<{
  steps: Step[]
}>()
</script>

<template>
  <div class="w-full overflow-x-auto">
    <ol class="flex w-max min-w-full">
      <li
        v-for="(step, i) in steps"
        :key="`${i}-${step.title}`"
        class="flex min-w-32 flex-none flex-col"
        :class="i < steps.length - 1 ? 'pr-10' : ''"
      >
        <div class="flex items-center">
          <span
            class="h-2.5 w-2.5 shrink-0"
            :class="step.done ? 'bg-bnf-text' : 'bg-bnf-text-muted'"
          ></span>
          <span
            v-if="i < steps.length - 1"
            class="-mr-10 h-px flex-1"
            :class="steps[i + 1]?.done ? 'bg-bnf-text' : 'bg-bnf-text-muted'"
          ></span>
        </div>

        <div class="mt-2 whitespace-nowrap">
          <p class="text-xs font-bold" :class="step.done ? 'text-bnf-text' : 'text-bnf-text-muted'">
            {{ step.title }}
          </p>
          <p v-if="step.subtitle" class="text-xs text-bnf-text">
            {{ step.subtitle }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
