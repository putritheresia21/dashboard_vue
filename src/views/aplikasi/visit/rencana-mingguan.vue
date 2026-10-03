<route lang="yaml">
meta:
  title: Rencana Visit Mingguan
  requiresAuth: true
</route>

<script setup lang="ts">
import 'primeicons/primeicons.css'

import { Badge, Button, Tag } from 'primevue'
import { computed, ref, watch } from 'vue'

// import FilterBar from '@/components/filters/FilterBar.vue'
import AdditionalInformation from '@/components/AdditionalInformation.vue'
import DynamicList from '@/components/DynamicList.vue'
import { dummyVisits } from '@/dummy/visitData' //dummy data
import getWeeksInMonth from '@/utils/weeksInMonthHelper'

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
    return 'bg-[#283593] text-white hover:bg-blue-800'
  }
  if (status === 'pending') {
    return 'bg-[#FFF3CD] text-[#D99A00] border border-[#F5C542]'
  }
  // Gaya untuk "rencana" (Biru/ungu pastel yang senada dengan image_0fc01d.png)
  if (status === 'planned') {
    return 'bg-[#EAEAFF] text-[#283593] border border-[#C5CAE9]'
  }

  // Gaya untuk "belum" (Putih bersih dengan border abu-abu yang senada dengan image_0fc03b.png)
  if (status === 'empty') {
    return 'bg-white text-gray-400 border border-gray-200'
  }

  return 'bg-white text-gray-400 border border-gray-300' // Fallback default
}

const selectedFilter = ref('Semua')
const filters = ['Semua', 'RS', 'Klinik', 'Apotek']

const statuses = ref([
  {
    label: 'Rencana',
    // Background biru/ungu sangat muda dengan border
    boxClass: 'bg-indigo-50 border-2 border-indigo-200',
    icon: null,
  },
  {
    label: 'Selesai',
    // Background biru gelap solid
    boxClass: 'bg-indigo-800',
    icon: null,
  },
  {
    label: 'Pending',
    // Background kuning, border kuning, dan warna teks untuk icon
    boxClass: 'bg-yellow-100 border-2 border-yellow-400',
    icon: 'pi-clock',
    iconClass: 'text-yellow-700 text-sm font-bold', // Mengatur warna dan ukuran icon jam
  },
  {
    label: 'Belum',
    // Background putih transparan dengan border
    boxClass: 'bg-white border-2 border-indigo-200',
    icon: null,
  },
])
</script>

<template>
  <div class="flex flex-col gap-6 mb-3">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Rencana Visit Mingguan</h1>
      <p class="text-sm text-slate-400 mt-1">
        semua hari langsung terlihat, centang Siang / Malam per kunjungan
      </p>
    </div>

    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <AdditionalInformation>
        Tambah <strong>42</strong> kunjungan lagi untuk memenuhi minimum 50/minggu
      </AdditionalInformation>

      <Button
        icon="pi pi-plus"
        label="Tambah kunjungan"
        class="bg-[#10365d] hover:bg-[#0a2440] border-none text-[11px] text-white px-3 py-2 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2"
      />
    </div>

    <FilterBar
      v-model="activeFilters"
      :filters="selectFilters"
      :data="dummyVisits"
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
            ? 'bg-[#10365d] border-[#10365d] text-white'
            : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
        "
        @click="selectedFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <span
      class="inline-flex items-center rounded-full bg-green-50 px-3 py-2 text-[11px] font-semibold leading-none text-green-800"
    >
      <span class="font-medium">MCL Aktif:</span>
      <span class="font-bold ml-1">Triwulan II 2026</span>
    </span>
  </div>

  <div
    class="flex flex-wrap items-center justify-between w-full gap-2 text-slate-700 font-medium mb-3"
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

  <DynamicList :items="dummyVisits" layout="column" :gap="4" :show-arrow="false">
    <template #item="{ item }">
      <div
        class="w-full max-w-3xl border border-gray-200 rounded-xl bg-white overflow-hidden text-sm"
      >
        <!-- Bagian Atas (Dibagi 2 kolom) -->
        <div class="flex flex-col md:flex-row border-b border-gray-200">
          <!-- Kolom Kiri: Profil & Info -->
          <div class="p-4 md:w-5/12 md:border-r border-gray-200 flex flex-col justify-center">
            <!-- Nama & Badge -->
            <div class="flex justify-between items-start mb-1">
              <h2 class="text-lg font-bold text-gray-900">{{ (item as VisitItem).name }}</h2>
              <Badge
                :value="(item as VisitItem).quota"
                class="bg-[#1a85ff] text-white px-2 py-0.5 rounded-full text-xs"
              />
            </div>

            <p class="text-gray-500 text-sm mb-3">{{ (item as VisitItem).outlet }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 text-xs">
              <Tag
                class="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"
              >
                <i class="pi pi-sun text-xs"></i> {{ (item as VisitItem).shift }}
              </Tag>
              <Tag class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                {{ (item as VisitItem).type }}
              </Tag>
              <Tag class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                {{ (item as VisitItem).role }}
              </Tag>
            </div>
          </div>

          <!-- Kolom Kanan: Jadwal Hari -->
          <div class="p-4 md:w-7/12 flex justify-between items-center overflow-x-auto gap-2">
            <div
              v-for="(schedule, index) in (item as VisitItem).schedules"
              :key="index"
              class="flex flex-col items-center gap-2 min-w-[3rem]"
            >
              <div class="text-center">
                <p class="text-xs font-medium text-gray-500 uppercase">{{ schedule.day }}</p>
                <p class="text-lg font-bold text-gray-900">{{ schedule.date }}</p>
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
        <div class="px-4 py-3 flex gap-6 items-center bg-gray-50 text-sm text-gray-700">
          <div>Sales User: <span class="font-bold text-[#0f294d]">Rp 310.000</span></div>
          <div>Sales Outlet: <span class="font-bold text-[#0f294d]">Rp 485.000</span></div>
        </div>
      </div>
    </template>
  </DynamicList>
</template>
