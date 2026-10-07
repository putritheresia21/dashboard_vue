<script setup lang="ts">
import { Button, Card } from '@bernofarm/core'
import { Add01Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useAuthStore } from '@/features/auth/stores/authStore'
import WeeklyVisitPlanFilter from '@/features/visits/weekly-visit/components/WeeklyVisitPlanFilter.vue'
import WeeklyVisitPlanList from '@/features/visits/weekly-visit/components/WeeklyVisitPlanList.vue'
import AdditionalInformation from '@/shared/components/AdditionalInformation.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'

const { role } = storeToRefs(useAuthStore())

const canManage = computed((): boolean => ['dm', 'sm'].includes(role.value))

const selectedYear = ref(2026)
const selectedMonth = ref(9)
const selectedStatus = ref<string | null>(null)

const yearOptions = [2025, 2026, 2027].map((year) => ({ label: String(year), value: year }))
const monthOptions = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
].map((label, index) => ({ label, value: index + 1 }))
const statusTabs = [
  { label: 'Semua', value: null, count: 4 },
  { label: 'Draft', value: 'draft', count: 1 },
  { label: 'Menunggu', value: 'waiting', count: 1 },
  { label: 'Disetujui', value: 'approved', count: 2 },
]
</script>
<template>
  <AppHeader
    title="Rencana Visit Mingguan"
    subtitle="Kelola rencana visit mingguan dan pantau status persetujuan."
  >
    <router-link v-slot="{ navigate }" to="" custom>
      <Button
        v-if="canManage"
        label="Buat Rencana Visit"
        severity="primary"
        class="w-fit min-w-50 self-start"
        @click="navigate()"
      >
        <template #icon>
          <HugeiconsIcon :icon="Add01Icon" :size="16" :stroke-width="1.8" />
        </template>
      </Button>
    </router-link>

    <Card
      class="flex flex-col mt-bnf-md p-4 gap-bnf-md lg:gap-bnf-xl lg:flex-row lg:justify-between lg:items-center"
    >
      <div class="flex flex-col gap-bnf-md w-full">
        <!-- Title -->
        <h2 class="font-bold text-sm">Rencana September 2026</h2>

        <!-- Progress Stats -->
        <div class="flex justify-between items-end">
          <div class="flex items-baseline gap-2">
            <span class="text-2xl leading-none font-bold">100</span>
            <span class="text-sm text-bnf-text-muted">/ 200 kunjungan</span>
          </div>
          <div class="text-sm font-bold">50%</div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-100 rounded-full h-3">
          <div class="bg-[#153f6c] h-3 rounded-full" style="width: 50%"></div>
        </div>

        <!-- Subtitle -->
        <p class="text-bnf-text-muted text-sm">
          Minimum 200 kunjungan per bulan, bukan per minggu.
        </p>
      </div>

      <div class="flex flex-col gap-bnf-md w-full">
        <!-- Details Stats -->
        <div class="flex gap-4 justify-between text-center">
          <!-- Left Stats: RS, Klinik, Apotek -->
          <div class="flex flex-col gap-2">
            <p class="text-bnf-text-muted text-sm">RS</p>
            <p class="text-lg leading-none font-bold">40</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-bnf-text-muted text-sm">Klinik</p>
            <p class="text-lg leading-none font-bold">15</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-bnf-text-muted text-sm">Apotek</p>
            <p class="text-lg leading-none font-bold">15</p>
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-bnf-text-muted text-sm">Total Shift Visit</p>
            <p class="text-lg leading-none font-bold">50 Siang &middot; 50 Malam</p>
          </div>
        </div>

        <AdditionalInformation :icon="Clock01Icon" class="w-full">
          Tambah 8 kunjungan untuk memenuhi minimum bulanan.
        </AdditionalInformation>
      </div>
    </Card>

    <span class="mt-bnf-md text-md font-bold block">List Rencana Visit</span>
    <WeeklyVisitPlanFilter
      v-model:year="selectedYear"
      v-model:month="selectedMonth"
      v-model:status="selectedStatus"
      :year-options="yearOptions"
      :month-options="monthOptions"
      :status-tabs="statusTabs"
    />
    <WeeklyVisitPlanList :year="selectedYear" :month="selectedMonth" :status="selectedStatus" />
  </AppHeader>
</template>
