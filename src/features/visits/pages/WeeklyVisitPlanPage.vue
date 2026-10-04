<script setup lang="ts">
import 'primeicons/primeicons.css'

import { Badge, Button, Tag } from 'primevue'
import { computed, ref, watch } from 'vue'

import { mockVisits } from '@/features/visits/mocks/visitData' // mock data
// import FilterBar from '@/components/filters/FilterBar.vue'
import AdditionalInformation from '@/shared/components/AdditionalInformation.vue'
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import getWeeksInMonth from '@/shared/utils/weeksInMonthHelper'

interface VisitSchedule {
  day: string
  date: string
  status: string
}

interface VisitItem {
  name: string
  outlet: string
  quota: number | string
  shift: string
  type: string
  role: string
  schedules: VisitSchedule[]
}

const years = (() => {
  const currentYear = new Date().getFullYear()
  const addYear = 5
  return Array.from({ length: addYear }, (_, i) => currentYear + i)
})()

const months = Array.from({ length: 12 }, (_, i) => ({
  label: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2024, i)),
  value: i, // 1 = Januari, 12 = Desember
}))

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
      activeFilters.value['bulan'] = null
    }
  },
)

watch([() => activeFilters.value.tahun, () => activeFilters.value.bulan], () => {
  activeFilters.value.week = null
})

const selectFilters = computed(() => [
  { type: 'select' as const, key: 'tahun', placeholder: 'Tahun', options: years },
  {
    type: 'select' as const,
    key: 'bulan',
    placeholder: 'Bulan',
    options: months,
    optionLabel: 'label',
    optionValue: 'value',
    disabled: activeFilters.value.tahun === null,
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

const getScheduleIcon = (status: string) => {
  if (status === 'visited') {
    return 'pi pi-check'
  }
  if (status === 'pending') {
    return 'pi pi-clock'
  }
  if (status === 'planned') {
    return 'pi pi-calendar'
  }
  if (status === 'empty') {
    return 'pi pi-circle'
  }
  return 'pi pi-circle'
}

const getScheduleClass = (status: string) => {
  if (status === 'visited') {
    return 'bg-bnf-primary text-[color:var(--bnf-color-foreground)] hover:bg-bnf-primary-hover'
  }
  if (status === 'pending') {
    return 'bg-bnf-warning/10 text-bnf-warning border border-bnf-warning'
  }
  // Gaya untuk "rencana" (Biru/ungu pastel yang senada dengan image_0fc01d.png)
  if (status === 'planned') {
    return 'bg-bnf-primary/5 text-bnf-primary border border-bnf-primary'
  }

  // Gaya untuk "belum" (Putih bersih dengan border abu-abu yang senada dengan image_0fc03b.png)
  if (status === 'empty') {
    return 'bg-bnf-surface text-bnf-text-muted border border-bnf-border'
  }

  return 'bg-bnf-surface text-bnf-text-muted border border-bnf-border' // Fallback default
}

const selectedFilter = ref('Semua')
const filters = ['Semua', 'RS', 'Klinik', 'Apotek']

const statuses = ref([
  {
    label: 'Rencana',
    // Background biru/ungu sangat muda dengan border
    boxClass: 'bg-bnf-primary/5 border-2 border-bnf-primary',
    icon: null,
  },
  {
    label: 'Selesai',
    // Background biru gelap solid
    boxClass: 'bg-bnf-primary',
    icon: null,
  },
  {
    label: 'Pending',
    // Background kuning, border kuning, dan warna teks untuk icon
    boxClass: 'bg-bnf-warning/10 border-2 border-bnf-warning',
    icon: 'pi-clock',
    iconClass: 'text-bnf-warning text-sm font-bold', // Mengatur warna dan ukuran icon jam
  },
  {
    label: 'Belum',
    // Background putih transparan dengan border
    boxClass: 'bg-bnf-surface border-2 border-bnf-primary',
    icon: null,
  },
])
</script>

<template>
  <AppHeader
    title="Rencana Visit Mingguan"
    subtitle="Semua hari langsung terlihat, centang siang atau malam per kunjungan."
    max-width="max-w-8xl"
  >
    <div class="flex flex-col gap-6 mb-3">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <AdditionalInformation>
          Tambah <strong>42</strong> kunjungan lagi untuk memenuhi minimum 50/minggu
        </AdditionalInformation>

        <Button
          icon="pi pi-plus"
          label="Tambah kunjungan"
          class="bg-(--bnf-color-brand-blue) hover:bg-(--bnf-color-brand-blue-hover) border-none text-[11px] text-(--bnf-color-foreground) px-3 py-2 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
        />
      </div>

      <FilterBar
        v-model="activeFilters"
        :filters="selectFilters"
        :data="mockVisits"
        :show-reset="false"
      />
    </div>

    <div class="flex justify-between items-center w-full mb-3">
      <div class="flex gap-1.5">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          class="px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 cursor-pointer outline-none"
          :class="
            selectedFilter === filter
              ? 'bg-(--bnf-color-brand-blue) border-(--bnf-color-brand-blue) text-(--bnf-color-foreground)'
              : 'bg-bnf-surface border-bnf-border text-bnf-text-muted hover:bg-bnf-surface-muted'
          "
          @click="selectedFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <span
        class="inline-flex items-center rounded-full bg-bnf-success/10 px-3 py-2 text-[11px] font-semibold leading-none text-bnf-success"
      >
        <span class="font-medium">MCL Aktif:</span>
        <span class="font-bold ml-1">Triwulan II 2026</span>
      </span>
    </div>

    <div
      class="flex flex-wrap items-center justify-between w-full gap-2 text-bnf-text font-medium mb-3"
    >
      <div class="flex flex-wrap items-center gap-2">
        <div v-for="item in statuses" :key="item.label" class="flex items-center gap-1">
          <!-- Box Icon -->
          <div :class="['w-4 h-4 flex items-center justify-center rounded-sm', item.boxClass]">
            <!-- Tampilkan ikon PrimeIcons jika ada di dalam data -->
            <i v-if="item.icon" :class="['pi', item.icon, item.iconClass]"></i>
          </div>

          <!-- Label Text -->
          <span class="text-xs">{{ item.label }}</span>
        </div>
      </div>

      <span><strong>8</strong>/53 kunjungan</span>
    </div>

    <DynamicList :items="mockVisits" layout="column" :gap="4" :show-arrow="false">
      <template #item="{ item }">
        <div
          class="w-full max-w-3xl border border-bnf-border rounded-xl bg-bnf-surface overflow-hidden text-sm"
        >
          <!-- Bagian Atas (Dibagi 2 kolom) -->
          <div class="flex flex-col md:flex-row border-b border-bnf-border">
            <!-- Kolom Kiri: Profil & Info -->
            <div class="p-4 md:w-5/12 md:border-r border-bnf-border flex flex-col justify-center">
              <!-- Nama & Badge -->
              <div class="flex justify-between items-start mb-1">
                <h2 class="text-lg font-bold text-bnf-text">{{ (item as VisitItem).name }}</h2>
                <Badge
                  :value="(item as VisitItem).quota"
                  class="bg-bnf-primary text-(--bnf-color-foreground) px-2 py-0.5 rounded-full text-xs"
                />
              </div>

              <p class="text-bnf-text-muted text-sm mb-3">{{ (item as VisitItem).outlet }}</p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 text-xs">
                <Tag
                  class="bg-bnf-warning/10 text-bnf-warning px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"
                >
                  <i class="pi pi-sun text-xs"></i> {{ (item as VisitItem).shift }}
                </Tag>
                <Tag class="bg-bnf-primary/5 text-bnf-primary px-2.5 py-1 rounded-full font-medium">
                  {{ (item as VisitItem).type }}
                </Tag>
                <Tag class="bg-bnf-primary/5 text-bnf-primary px-2.5 py-1 rounded-full font-medium">
                  {{ (item as VisitItem).role }}
                </Tag>
              </div>
            </div>

            <!-- Kolom Kanan: Jadwal Hari -->
            <div class="p-4 md:w-7/12 flex justify-between items-center overflow-x-auto gap-2">
              <div
                v-for="(schedule, index) in (item as VisitItem).schedules"
                :key="index"
                class="flex flex-col items-center gap-2 min-w-12"
              >
                <div class="text-center">
                  <p class="text-xs font-medium text-bnf-text-muted uppercase">
                    {{ schedule.day }}
                  </p>
                  <p class="text-lg font-bold text-bnf-text">{{ schedule.date }}</p>
                </div>

                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    getScheduleClass(schedule.status),
                  ]"
                  :aria-label="schedule.status"
                >
                  <i
                    v-if="getScheduleIcon(schedule.status)"
                    :class="['pi text-sm font-bold', getScheduleIcon(schedule.status)]"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <!-- Bagian Bawah: Info Sales -->
          <div class="px-4 py-3 flex gap-6 items-center bg-bnf-surface-muted text-sm text-bnf-text">
            <div>Sales User: <span class="font-bold text-bnf-text">Rp 310.000</span></div>
            <div>Sales Outlet: <span class="font-bold text-bnf-text">Rp 485.000</span></div>
          </div>
        </div>
      </template>
    </DynamicList>
  </AppHeader>
</template>
