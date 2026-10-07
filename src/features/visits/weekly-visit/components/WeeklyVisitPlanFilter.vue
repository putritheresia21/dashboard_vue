<script setup lang="ts">
import * as Filter from '@/shared/forms/Filter'

interface MonthOption {
  label: string
  value: number
}

interface StatusTab {
  label: string
  value: string | null
  count: number
}

defineProps<{
  yearOptions: { label: string; value: number }[]
  monthOptions: MonthOption[]
  statusTabs: StatusTab[]
}>()

const year = defineModel<number>('year', { default: 2026 })
const month = defineModel<number>('month', { default: 9 })
const status = defineModel<string | null>('status', { default: null })
</script>

<template>
  <div class="my-bnf-sm">
    <Filter.Bar>
      <div class="flex w-full flex-col gap-bnf-md">
        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-bnf-md">
          <Filter.Field label="Tahun" for="visit-plan-year">
            <Filter.Select
              id="visit-plan-year"
              v-model="year"
              :options="yearOptions"
              option-label="label"
              option-value="value"
              :show-clear="false"
              class="w-full max-w-none"
            />
          </Filter.Field>

          <Filter.Field label="Bulan" for="visit-plan-month">
            <Filter.Select
              id="visit-plan-month"
              v-model="month"
              :options="monthOptions"
              option-label="label"
              option-value="value"
              :show-clear="false"
              class="w-full max-w-none"
            />
          </Filter.Field>
        </div>

        <Filter.Tabs v-model="status" :tabs="statusTabs" />
      </div>
    </Filter.Bar>
  </div>
</template>
