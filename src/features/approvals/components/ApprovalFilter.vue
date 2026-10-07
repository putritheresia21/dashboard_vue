<script setup lang="ts">
import * as Filter from '@/shared/forms/Filter'
import { colorTokens } from '@/shared/utils/colors'

withDefaults(
  defineProps<{
    variant?: 'status' | 'detail'
    data?: { approvalStatus: string }[]
    approvalNo?: string
  }>(),
  { variant: 'status', data: () => [], approvalNo: '' },
)

const status = defineModel<string | null>('status', { default: null })
const search = defineModel<string>('search', { default: '' })
const type = defineModel<string | null>('type', { default: null })

const year = defineModel<string | null>('year', { default: null })
const quarter = defineModel<string | null>('quarter', { default: null })
const viewBy = defineModel<string | null>('viewBy', { default: null })

const statusTabs = [
  { label: 'Semua', value: null },
  { label: 'Menunggu', value: 'PENDING', color: colorTokens.warning },
  { label: 'Disetujui', value: 'APPROVED', color: colorTokens.success },
  { label: 'Ditolak', value: 'REJECTED', color: colorTokens.danger },
]

const yearOptions = ['2026', '2025', '2024']

const approvalTypeOptions = [
  'Relokasi',
  'Perpindahan Outlet',
  'MCL',
  'ED Khusus',
  'Rencana Visit Mingguan',
  'Rotasi Personel',
]

const quarterOptions = [
  { label: 'Triwulan I (Jan-Mar)', value: 'Q1' },
  { label: 'Triwulan II (Apr-Jun)', value: 'Q2' },
  { label: 'Triwulan III (Jul-Sep)', value: 'Q3' },
  { label: 'Triwulan IV (Okt-Des)', value: 'Q4' },
]

const viewByOptions = [
  { label: 'User', value: 'user' },
  { label: 'Outlet', value: 'outlet' },
]
</script>

<template>
  <Filter.Bar v-if="variant === 'status'" class="md:hidden">
    <div class="flex w-full min-w-0 flex-col gap-3">
      <div class="grid w-full grid-cols-2 gap-3">
        <div
          class="min-w-0 [&>*]:w-full [&_input]:h-10 [&_input]:w-full [&_input]:min-w-0 [&_input]:text-sm"
        >
          <Filter.SearchInput v-model="search" placeholder="Cari Approval" />
        </div>

        <div class="min-w-0">
          <Filter.Select
            v-model="type"
            :options="approvalTypeOptions"
            placeholder="Jenis Approval"
            class="max-w-nonw"
          />
        </div>
      </div>

      <div class="w-full min-w-0">
        <Filter.Tabs
          v-model="status"
          :tabs="statusTabs"
          :data="data"
          status-field="approvalStatus"
          title="Status Approval"
        />
      </div>
    </div>
  </Filter.Bar>

  <Filter.Bar
    v-if="variant === 'status'"
    class="hidden flex-wrap items-center justify-between gap-y-3 md:flex md:flex-wrap xl:flex-nowrap"
  >
    <div class="min-w-0 max-w-full">
      <Filter.Tabs
        v-model="status"
        :tabs="statusTabs"
        :data="data"
        status-field="approvalStatus"
        title="Status Approval"
      />
    </div>

    <div class="flex min-w-0 max-w-full flex-wrap items-center gap-3 xl:flex-nowrap">
      <Filter.Divider class="hidden xl:block" />
      <div class="w-full min-w-0 sm:w-64 sm:shrink-0">
        <Filter.SearchInput v-model="search" placeholder="Cari Approval" />
      </div>

      <Filter.InlineSelect
        v-model="type"
        label="Filter"
        :options="approvalTypeOptions"
        placeholder="Jenis Approval"
      />
    </div>
  </Filter.Bar>

  <Filter.Bar v-else class="items-center">
    <div class="grid min-w-0 flex-1 grid-cols-3 gap-3">
      <Filter.Field label="Nomor Approval">
        <InputText :model-value="approvalNo" disabled class="w-full" />
      </Filter.Field>

      <Filter.Field label="Periode Tahun">
        <Filter.Select v-model="year" :options="yearOptions" disabled class="max-w-none" />
      </Filter.Field>

      <Filter.Field label="Triwulan">
        <Filter.Select
          v-model="quarter"
          :options="quarterOptions"
          option-label="label"
          option-value="value"
          disabled
          class="max-w-none"
        />
      </Filter.Field>
    </div>

    <Filter.Divider />

    <Filter.Field label="Lihat Berdasarkan" class="w-72 shrink-0">
      <Filter.Segmented v-model="viewBy" :options="viewByOptions" />
    </Filter.Field>
  </Filter.Bar>
</template>
