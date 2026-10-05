<script setup lang="ts">
import { Badge, Button, Card, CardFooter, Message, Select, Separator, Tag } from '@bernofarm/core'
import {
  Add01Icon,
  BadgeInfoIcon,
  Calendar01Icon,
  CheckIcon,
  CircleIcon,
  Clock01Icon,
  Sun01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ref } from 'vue'

import { mockVisits } from '@/features/visits/mocks/visitData' // mock data
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'

interface VisitSchedule {
  day: string
  date: string
  status: string
}

interface VisitItem {
  name: string
  outlet: string
  quota: number | string
  salesUser: number | null
  salesOutlet: number
  shift: string
  type: string
  role: string
  schedules: VisitSchedule[]
}

const formatCurrency = (value: number | null) => {
  if (value === null) {
    return '-'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const getScheduleIcon = (status: string) => {
  if (status === 'visited') {
    return CheckIcon
  }
  if (status === 'pending') {
    return Clock01Icon
  }
  if (status === 'planned') {
    return Calendar01Icon
  }
  if (status === 'empty') {
    return CircleIcon
  }
  return CircleIcon
}

const getScheduleClass = (status: string) => {
  if (status === 'visited') {
    return 'border-bnf-primary bg-bnf-primary text-bnf-primary-foreground hover:bg-bnf-primary-hover'
  }
  if (status === 'pending') {
    return 'border-bnf-warning bg-bnf-warning/10 text-bnf-warning'
  }
  if (status === 'planned') {
    return 'border-bnf-primary bg-bnf-primary/5 text-bnf-primary'
  }

  if (status === 'empty') {
    return 'border-bnf-border bg-bnf-surface text-bnf-text-muted'
  }

  return 'border-bnf-border bg-bnf-surface text-bnf-text-muted'
}

const selectedYear = ref(2026)
const selectedMonth = ref(9)
const selectedWeek = ref(5)

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
const weekOptions = [1, 2, 3, 4, 5].map((week) => ({ label: `Minggu ke ${week}`, value: week }))

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
    icon: Clock01Icon,
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
    <div class="@container">
      <div class="mb-bnf-md flex flex-col gap-bnf-xl">
        <div
          class="flex flex-col items-stretch gap-bnf-md @lg:grid @lg:grid-cols-[minmax(0,1fr)_auto] @lg:items-start @lg:gap-bnf-lg"
        >
          <Message
            severity="warn"
            size="small"
            class="w-full @lg:w-fit @lg:max-w-full @lg:self-start"
          >
            <template #icon>
              <HugeiconsIcon :icon="BadgeInfoIcon" :size="16" :stroke-width="1.8" />
            </template>
            Tambah <strong>42</strong> kunjungan lagi untuk memenuhi minimum 50/minggu
          </Message>

          <Button
            label="Tambah kunjungan"
            severity="primary"
            class="w-full shrink-0 whitespace-nowrap px-bnf-md py-bnf-sm text-[11px] font-semibold transition-colors @lg:w-auto @lg:justify-self-end"
          >
            <template #icon>
              <HugeiconsIcon :icon="Add01Icon" :size="16" :stroke-width="1.8" />
            </template>
          </Button>
        </div>
      </div>

      <div class="mb-bnf-md grid grid-cols-[5fr_6fr_7fr] gap-bnf-sm @lg:max-w-xl @lg:gap-bnf-md">
        <div class="flex min-w-0 flex-col gap-bnf-xs">
          <label for="weekly-plan-year" class="text-xs text-bnf-text-muted">Tahun</label>
          <Select
            id="weekly-plan-year"
            v-model="selectedYear"
            size="small"
            :options="yearOptions"
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="flex min-w-0 flex-col gap-bnf-xs">
          <label for="weekly-plan-month" class="text-xs text-bnf-text-muted">Bulan</label>
          <Select
            id="weekly-plan-month"
            v-model="selectedMonth"
            size="small"
            :options="monthOptions"
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="flex min-w-0 flex-col gap-bnf-xs">
          <label for="weekly-plan-week" class="text-xs text-bnf-text-muted">Minggu</label>
          <Select
            id="weekly-plan-week"
            v-model="selectedWeek"
            size="small"
            :options="weekOptions"
            option-label="label"
            option-value="value"
          />
        </div>
      </div>

      <div
        class="mb-bnf-md flex w-full flex-wrap items-center justify-between gap-x-bnf-sm gap-y-bnf-md"
      >
        <div class="flex flex-wrap gap-1.5">
          <Button
            v-for="filter in filters"
            :key="filter"
            :label="filter"
            :severity="selectedFilter === filter ? 'primary' : 'secondary'"
            :outlined="selectedFilter !== filter"
            :class="
              selectedFilter === filter
                ? ''
                : 'border-bnf-border bg-bnf-surface! text-bnf-text hover:bg-bnf-surface-muted!'
            "
            rounded
            size="small"
            class="px-bnf-sm text-[11px] @lg:px-bnf-sm @lg:text-xs"
            @click="selectedFilter = filter"
          />
        </div>

        <Tag
          severity="success"
          variant="soft"
          rounded
          class="shrink-0 whitespace-nowrap px-bnf-sm py-1.5 text-[9px] leading-none @lg:px-bnf-md @lg:py-bnf-sm @lg:text-[11px]"
        >
          <span class="font-medium">MCL Aktif:</span>
          <span class="ml-1 font-bold">Triwulan II 2026</span>
        </Tag>
      </div>

      <div
        class="mb-bnf-md flex w-full items-center justify-between gap-bnf-sm text-[10px] font-medium text-bnf-text @lg:text-sm"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-bnf-xs @lg:gap-bnf-sm">
          <div v-for="item in statuses" :key="item.label" class="flex items-center gap-bnf-xs">
            <!-- Box Icon -->
            <div
              :class="[
                'flex size-3 items-center justify-center rounded-sm @lg:size-4',
                item.boxClass,
              ]"
            >
              <HugeiconsIcon
                v-if="item.icon"
                :icon="item.icon"
                :size="14"
                :stroke-width="1.8"
                :class="item.iconClass"
              />
            </div>

            <!-- Label Text -->
            <span class="@lg:text-xs">{{ item.label }}</span>
          </div>
        </div>

        <span class="shrink-0 whitespace-nowrap"><strong>8</strong>/53 kunjungan</span>
      </div>
    </div>

    <div class="@container">
      <DynamicList
        :items="mockVisits"
        layout="column"
        :gap="4"
        :padding="0"
        background="bg-transparent"
        rounded="rounded-none"
        :show-arrow="false"
      >
        <template #item="{ item }">
          <Card class="w-full max-w-none overflow-hidden text-sm">
            <div
              class="grid grid-cols-[minmax(0,47%)_auto_minmax(0,1fr)] @4xl:grid-cols-[19rem_auto_minmax(0,1fr)]"
            >
              <div
                class="flex min-w-0 flex-col justify-center gap-bnf-sm p-bnf-md @4xl:gap-bnf-md @4xl:p-5"
              >
                <div class="flex items-start justify-between gap-bnf-sm @4xl:gap-bnf-md">
                  <div class="min-w-0">
                    <h2
                      class="wrap-break-word text-sm font-bold leading-tight text-bnf-text @4xl:truncate @4xl:text-lg"
                    >
                      {{ (item as VisitItem).name }}
                    </h2>
                    <p
                      class="mt-0.5 wrap-break-word text-[11px] text-bnf-text-muted @4xl:mt-0.5 @4xl:truncate @4xl:text-sm"
                    >
                      {{ (item as VisitItem).outlet }}
                    </p>
                  </div>
                  <Badge
                    class="shrink-0 px-bnf-sm py-0.5 text-[10px] @4xl:px-2.5 @4xl:py-0.5 @4xl:text-xs"
                  >
                    {{ (item as VisitItem).quota }}
                  </Badge>
                </div>

                <div class="flex flex-wrap items-center gap-bnf-xs @4xl:gap-bnf-sm">
                  <Tag
                    severity="warn"
                    variant="soft"
                    rounded
                    class="px-1.5 py-0 text-[9px] leading-4 @4xl:px-2.5 @4xl:py-0.5 @4xl:text-xs @4xl:leading-5"
                  >
                    <template #icon>
                      <HugeiconsIcon
                        :icon="Sun01Icon"
                        :size="10"
                        :stroke-width="1.8"
                        class="@4xl:size-3.5"
                      />
                    </template>
                    {{ (item as VisitItem).shift }}
                  </Tag>
                  <Tag
                    severity="primary"
                    variant="soft"
                    rounded
                    class="px-1.5 py-0 text-[9px] leading-4 @4xl:px-2.5 @4xl:py-0.5 @4xl:text-xs @4xl:leading-5"
                  >
                    {{ (item as VisitItem).type }}
                  </Tag>
                  <Tag
                    severity="primary"
                    variant="soft"
                    rounded
                    class="px-1.5 py-0 text-[9px] leading-4 @4xl:px-2.5 @4xl:py-0.5 @4xl:text-xs @4xl:leading-5"
                  >
                    {{ (item as VisitItem).role }}
                  </Tag>
                </div>
              </div>

              <Separator orientation="vertical" />

              <div class="min-w-0 overflow-x-auto p-bnf-sm @4xl:p-5">
                <div class="grid grid-cols-6 gap-bnf-xs @4xl:min-w-96 @4xl:gap-bnf-md">
                  <div
                    v-for="(schedule, index) in (item as VisitItem).schedules"
                    :key="`${schedule.day}-${schedule.date}-${index}`"
                    class="flex min-w-0 flex-col items-center gap-bnf-xs @4xl:gap-bnf-sm"
                  >
                    <div class="text-center">
                      <p class="text-[9px] font-semibold uppercase text-bnf-text @4xl:text-xs">
                        {{ schedule.day }}
                      </p>
                      <p class="text-sm font-bold leading-tight text-bnf-text @4xl:text-lg">
                        {{ schedule.date.replace(/^0/, '') }}
                      </p>
                    </div>

                    <div
                      :class="[
                        'flex size-7 items-center justify-center rounded-lg border transition-colors @4xl:size-11',
                        getScheduleClass(schedule.status),
                      ]"
                      :aria-label="schedule.status"
                    >
                      <HugeiconsIcon
                        v-if="getScheduleIcon(schedule.status)"
                        :icon="getScheduleIcon(schedule.status)"
                        :size="16"
                        :stroke-width="2"
                        class="size-4 @4xl:size-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />

            <CardFooter
              class="flex-wrap gap-x-bnf-xl gap-y-bnf-xs bg-bnf-surface-muted px-bnf-md py-bnf-sm text-xs @4xl:gap-x-10 @4xl:gap-y-bnf-xs @4xl:px-5 @4xl:py-bnf-md @4xl:text-sm"
            >
              <div>
                Sales User:
                <span class="ml-1 font-bold text-bnf-primary">
                  {{ formatCurrency((item as VisitItem).salesUser) }}
                </span>
              </div>
              <div>
                Sales Outlet:
                <span class="ml-1 font-bold text-bnf-primary">
                  {{ formatCurrency((item as VisitItem).salesOutlet) }}
                </span>
              </div>
            </CardFooter>
          </Card>
        </template>
      </DynamicList>
    </div>
  </AppHeader>
</template>
