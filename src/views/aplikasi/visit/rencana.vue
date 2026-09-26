<script setup lang="ts">
import { dummyVisits } from '@/dummy/visitData'
import { ref, watch, computed } from 'vue'
import FilterBar from '@/components/filters/FilterBar.vue'
import getWeeksInMonth from '@/utils/weeksInMonthHelper'
const activeFilters = ref<Record<string, any>>({
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
  if (activeFilters.value['tahun'] == null || activeFilters.value['bulan'] == null) return []
  const tempWeeks = getWeeksInMonth(activeFilters.value['tahun'], activeFilters.value['bulan'])
  return tempWeeks.map((temp) => ({
    label: 'Minggu ke-' + temp.week,
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
    disabled: activeFilters.value['bulan'] == null,
  },
])

watch(activeFilters, (filters) => {
  console.log(filters)
})
</script>

<template>
  <FilterBar :filters="filters" v-model="activeFilters" :data="dummyVisits" :show-reset="false" />
</template>
