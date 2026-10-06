<script setup lang="ts">
import { Button } from '@bernofarm/core'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed } from 'vue'

import DynamicList from '@/shared/components/DynamicList.vue'

type PlanStatus = 'draft' | 'waiting' | 'approved'

interface WeeklyVisitPlan {
  id: number
  year: number
  month: number
  week: number
  period: string
  ownerOutlet: string
  status: PlanStatus
  visits: number
  dayVisits: number
  nightVisits: number
  users: number
  outlets: number
  hospitals: number
  clinics: number
  pharmacies: number
  activity: string
  actionLabel: string
}

const props = defineProps<{
  year: number
  month: number
  status: string | null
}>()

const emit = defineEmits<{
  action: [plan: WeeklyVisitPlan]
}>()

const plans: WeeklyVisitPlan[] = [
  {
    id: 4,
    year: 2026,
    month: 9,
    week: 4,
    period: '21–27 September 2026',
    ownerOutlet: 'John · RS Mitra Keluarga',
    status: 'draft',
    visits: 8,
    dayVisits: 6,
    nightVisits: 2,
    users: 6,
    outlets: 5,
    hospitals: 4,
    clinics: 2,
    pharmacies: 2,
    activity: 'Disimpan 21 Sep 2026, 09.15 WIB',
    actionLabel: 'Lanjutkan Draft',
  },
  {
    id: 3,
    year: 2026,
    month: 9,
    week: 3,
    period: '14–20 September 2026',
    ownerOutlet: 'John · RS Mitra Keluarga',
    status: 'waiting',
    visits: 50,
    dayVisits: 25,
    nightVisits: 25,
    users: 50,
    outlets: 20,
    hospitals: 10,
    clinics: 5,
    pharmacies: 5,
    activity: 'Diajukan 10 Sep 2026, 16.30 WIB',
    actionLabel: 'Lihat Detail',
  },
  {
    id: 2,
    year: 2026,
    month: 9,
    week: 2,
    period: '7–13 September 2026',
    ownerOutlet: 'John · RS Mitra Keluarga',
    status: 'approved',
    visits: 50,
    dayVisits: 25,
    nightVisits: 25,
    users: 50,
    outlets: 20,
    hospitals: 10,
    clinics: 5,
    pharmacies: 5,
    activity: 'Disetujui SPV 5 Sep 2026, 16.30 WIB',
    actionLabel: 'Lihat Detail',
  },
  {
    id: 1,
    year: 2026,
    month: 9,
    week: 1,
    period: '1–6 September 2026',
    ownerOutlet: 'John · RS Mitra Keluarga',
    status: 'approved',
    visits: 50,
    dayVisits: 25,
    nightVisits: 25,
    users: 50,
    outlets: 20,
    hospitals: 10,
    clinics: 5,
    pharmacies: 5,
    activity: 'Disetujui SPV 31 Agu 2026, 14.00 WIB',
    actionLabel: 'Lihat Detail',
  },
]

const filteredPlans = computed(() =>
  plans.filter(
    (plan) =>
      plan.year === props.year &&
      plan.month === props.month &&
      (props.status === null || plan.status === props.status),
  ),
)

function statusLabel(status: PlanStatus): string {
  if (status === 'draft') {
    return 'Draft'
  }
  if (status === 'waiting') {
    return 'Menunggu Approval'
  }
  return 'Disetujui'
}

function statusClass(status: PlanStatus): string {
  if (status === 'draft') {
    return 'bg-bnf-surface-muted text-bnf-text-muted'
  }
  if (status === 'waiting') {
    return 'bg-bnf-warning/10 text-bnf-warning'
  }
  return 'bg-bnf-success/10 text-bnf-success'
}
</script>

<template>
  <DynamicList
    :items="filteredPlans"
    layout="column"
    :gap="3"
    :padding="0"
    background="bg-transparent"
    rounded="rounded-none"
    :show-arrow="false"
    empty-text="Tidak ada rencana visit untuk filter ini."
  >
    <template #item="{ item }">
      <article
        class="w-full rounded-bnf-xl border border-bnf-border bg-bnf-surface p-bnf-lg text-left"
      >
        <div class="lg:hidden">
          <div class="flex items-center justify-between gap-bnf-md">
            <h3 class="text-base font-bold text-bnf-text">Minggu ke-{{ item.week }}</h3>
            <span
              class="shrink-0 rounded-full px-bnf-md py-bnf-sm text-xs font-semibold"
              :class="statusClass(item.status)"
            >
              {{ statusLabel(item.status) }}
            </span>
          </div>

          <p class="mt-bnf-md text-sm font-bold text-bnf-text">{{ item.period }}</p>

          <div class="mt-bnf-lg flex items-baseline justify-between gap-bnf-md">
            <p class="text-xl font-bold leading-none text-bnf-text">{{ item.visits }} kunjungan</p>
            <p class="shrink-0 text-xs text-bnf-text-muted">
              {{ item.dayVisits }} Siang · {{ item.nightVisits }} Malam
            </p>
          </div>

          <p class="mt-bnf-md font-bold text-bnf-text">
            {{ item.users }} User · {{ item.outlets }} Outlet
          </p>
          <p class="mt-bnf-sm text-sm text-bnf-text-muted">
            RS {{ item.hospitals }} · Klinik {{ item.clinics }} · Apotek {{ item.pharmacies }}
          </p>

          <hr class="my-bnf-md border-bnf-border" />

          <p class="text-sm text-bnf-text-muted">{{ item.activity }}</p>

          <Button
            outlined
            severity="secondary"
            icon-pos="right"
            class="mt-bnf-md w-full border-bnf-border bg-bnf-surface! font-bold! text-bnf-primary! hover:bg-bnf-surface-muted!"
            :aria-label="`${item.actionLabel}, Minggu ke-${item.week}`"
            @click="emit('action', item)"
          >
            {{ item.actionLabel }}
            <template #icon>
              <HugeiconsIcon :icon="ArrowRight01Icon" :size="20" :stroke-width="1.8" />
            </template>
          </Button>
        </div>

        <div
          class="hidden lg:grid lg:grid-cols-[minmax(0,1.8fr)_minmax(0,0.9fr)_minmax(0,1.4fr)_auto_minmax(11rem,1fr)] lg:items-stretch lg:gap-x-bnf-xl"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline gap-x-bnf-md gap-y-bnf-xs">
              <h3 class="text-base font-bold text-bnf-text">Minggu ke-{{ item.week }}</h3>
              <p class="text-sm text-bnf-text-muted">{{ item.period }}</p>
            </div>
            <p class="mt-bnf-sm text-sm text-bnf-text-muted">{{ item.ownerOutlet }}</p>
            <p class="mt-bnf-md text-sm text-bnf-text-muted">{{ item.activity }}</p>
          </div>

          <div class="min-w-0">
            <p class="text-lg font-bold leading-tight text-bnf-text">{{ item.visits }} kunjungan</p>
            <p class="mt-bnf-sm text-sm text-bnf-text-muted">
              {{ item.dayVisits }} Siang · {{ item.nightVisits }} Malam
            </p>
          </div>

          <div class="min-w-0">
            <p class="font-bold text-bnf-text">{{ item.users }} User · {{ item.outlets }} Outlet</p>
            <p class="mt-bnf-sm text-sm text-bnf-text-muted">
              RS {{ item.hospitals }} · Klinik {{ item.clinics }} · Apotek {{ item.pharmacies }}
            </p>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-bnf-sm self-center rounded-full px-bnf-md py-bnf-sm text-xs font-semibold"
            :class="statusClass(item.status)"
          >
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-current"></span>
            {{ statusLabel(item.status) }}
          </span>

          <Button
            outlined
            severity="secondary"
            icon-pos="right"
            class="w-full self-center border-bnf-border bg-bnf-surface! font-bold! text-bnf-primary! hover:bg-bnf-surface-muted!"
            :aria-label="`${item.actionLabel}, Minggu ke-${item.week}`"
            @click="emit('action', item)"
          >
            {{ item.actionLabel }}
            <template #icon>
              <HugeiconsIcon :icon="ArrowRight01Icon" :size="20" :stroke-width="1.8" />
            </template>
          </Button>
        </div>
      </article>
    </template>
  </DynamicList>
</template>
