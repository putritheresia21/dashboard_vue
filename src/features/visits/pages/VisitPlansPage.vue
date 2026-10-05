<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { mockVisits } from '@/features/visits/mocks/visitData'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
// import FilterBar from '@/components/filters/FilterBar.vue'
import getWeeksInMonth from '@/shared/utils/weeksInMonthHelper'
interface WeeklyFilters {
  tahun: number | null
  bulan: number | null
  week: unknown
}

const activeFilters = ref<WeeklyFilters>({
  tahun: null,
  bulan: null,
  week: null,
})

const years = (() => {
  const currentYear = new Date().getFullYear()
  const addYear = 5
  return Array.from({ length: addYear }, (_, i) => currentYear + i)
})()

const months = Array.from({ length: 12 }, (_, i) => ({
  label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2024, i)),
  value: i, // 1 = Januari, 12 = Desember
}))

const weeks = computed(() => {
  if (activeFilters.value.tahun === null || activeFilters.value.bulan === null) {
    return []
  }
  const tempWeeks = getWeeksInMonth(activeFilters.value['tahun'], activeFilters.value['bulan'])
  return tempWeeks.map((temp) => ({
    label: `Minggu ke-${temp.week}`,
    value: temp,
  }))
})

watch(
  () => activeFilters.value['tahun'],
  (newTahun) => {
    if (!newTahun) {
      activeFilters.value['bulan'] = null // atau undefined
    }
  },
)

watch([() => activeFilters.value.tahun, () => activeFilters.value.bulan], () => {
  activeFilters.value.week = null
})

const filters = computed(() => [
  { type: 'select' as const, key: 'tahun', placeholder: 'Tahun', options: years },
  {
    type: 'select' as const,
    key: 'bulan',
    placeholder: 'Bulan',
    options: months,
    optionLabel: 'label',
    optionValue: 'value',
    disabled: !activeFilters.value['tahun'],
  },
  {
    type: 'select' as const,
    key: 'week',
    placeholder: 'Pilih Minggu',
    options: weeks.value,
    optionLabel: 'label',
    optionValue: 'value',
    disabled: activeFilters.value.bulan === null,
  },
])
</script>

<template>
  <AppHeader title="Rencana Visit" subtitle="Atur periode rencana visit yang ingin Anda kelola.">
    <FilterBar v-model="activeFilters" :filters="filters" :data="mockVisits" :show-reset="false" />
  </AppHeader>
</template>
