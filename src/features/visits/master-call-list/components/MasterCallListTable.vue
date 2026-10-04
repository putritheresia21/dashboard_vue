<script setup lang="ts">
import { Column, DataTable, InputNumber, Select } from '@bernofarm/core'
import { computed } from 'vue'

import { colorTokens } from '@/shared/utils/colors'
import { formatRupiah } from '@/shared/utils/formatter'

interface TableRow {
  id?: number
  user?: string
  aktif?: boolean
  jabatan?: string
  outlet?: string
  tipe?: string
  mr?: number
  spv?: number
  dm?: number
  shift?: string
  salesUser?: number | string | null
  salesOutlet?: number | string | null
  uniqueTipe?: string
}

const props = withDefaults(
  defineProps<{
    data: TableRow[]
    selected?: 'user' | 'outlet' | string
    role?: string
    loading?: boolean
    readonly?: boolean
    rows?: number
  }>(),
  {
    selected: 'user',
    role: 'sm',
    loading: false,
    readonly: false,
    rows: 10,
  },
)

const emit = defineEmits<{
  change: [payload: { row: TableRow; key: string; value: unknown }]
}>()

const shiftOptions = ['Siang', 'Malam']

const tipeMap: Record<string, { bg: string; text: string }> = {
  RS: {
    bg: 'color-mix(in srgb, var(--bnf-color-primary) 12%, transparent)',
    text: colorTokens.primary,
  },
  Klinik: {
    bg: 'color-mix(in srgb, var(--bnf-color-success) 12%, transparent)',
    text: colorTokens.success,
  },
  Apotek: {
    bg: 'color-mix(in srgb, var(--bnf-color-danger) 12%, transparent)',
    text: colorTokens.danger,
  },
}

const targetColumns = computed(() => {
  if (props.role === 'dm') {
    return ['mr', 'spv', 'dm']
  }
  return ['dm']
})

const targetLabels: Record<string, string> = {
  mr: 'MR',
  spv: 'SPV',
  dm: 'DM',
}

function updateCell(row: TableRow, key: string, value: unknown) {
  const nextValue = ['mr', 'spv', 'dm'].includes(key)
    ? Math.max(0, Math.floor(Number(value) || 0))
    : value

  emit('change', { row, key, value: nextValue })
}

function getCellValue(row: TableRow, field: string) {
  return row[field as keyof TableRow]
}

function badgeStyle(value: unknown) {
  const type = tipeMap[String(value)] ?? {
    bg: 'color-mix(in srgb, var(--bnf-color-primary) 12%, transparent)',
    text: colorTokens.primary,
  }
  return { backgroundColor: type.bg, color: type.text }
}

function displaySales(value: unknown) {
  if (typeof value === 'number') {
    return formatRupiah(value)
  }
  return value || '-'
}
</script>

<template>
  <div
    class="min-w-0 overflow-hidden rounded-2xl border border-bnf-border bg-bnf-surface shadow-sm"
  >
    <div class="w-full overflow-x-auto">
      <DataTable
        :value="data"
        :data-key="data.some((row) => row.id !== undefined) ? 'id' : 'user'"
        :group-rows-by="selected === 'outlet' ? ['outlet', 'uniqueTipe'] : undefined"
        paginator
        :rows="rows"
        :loading="loading"
        empty-message="Tidak ada data"
        responsive-layout="scroll"
      >
        <template v-if="selected === 'user'">
          <Column field="user" header="User" :style="{ width: '11rem' }" />
          <Column header="" :style="{ width: '2rem' }">
            <template #body="{ data: row }">
              <span
                v-if="row.aktif"
                class="inline-block h-2.5 w-2.5 rounded-full bg-bnf-success"
                aria-label="Aktif"
              />
            </template>
          </Column>
          <Column field="jabatan" header="Jabatan" :style="{ width: '10rem' }">
            <template #body="{ data: row }">
              <span
                class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium"
                :style="{
                  backgroundColor: 'color-mix(in srgb, var(--bnf-color-primary) 12%, transparent)',
                  color: colorTokens.primary,
                }"
              >
                {{ row.jabatan }}
              </span>
            </template>
          </Column>
          <Column field="outlet" header="Outlet" />
          <Column field="tipe" header="Tipe" :style="{ width: '5rem' }">
            <template #body="{ data: row }">
              <span
                class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium"
                :style="badgeStyle(row.tipe)"
              >
                {{ row.tipe }}
              </span>
            </template>
          </Column>
        </template>

        <template v-else>
          <Column field="outlet" header="Outlet" />
          <Column field="uniqueTipe" header="Tipe" :style="{ width: '5rem' }">
            <template #body="{ data: row }">
              <span
                class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium"
                :style="badgeStyle(row.tipe)"
              >
                {{ row.tipe }}
              </span>
            </template>
          </Column>
          <Column field="user" header="User" :style="{ width: '11rem' }" />
          <Column header="" :style="{ width: '2rem' }">
            <template #body="{ data: row }">
              <span
                v-if="row.aktif"
                class="inline-block h-2.5 w-2.5 rounded-full bg-bnf-success"
                aria-label="Aktif"
              />
            </template>
          </Column>
        </template>

        <Column
          v-for="field in targetColumns"
          :key="field"
          :field="field"
          :header="role === 'sm' && field === 'dm' ? 'SM' : targetLabels[field]"
          :style="{ width: '4rem' }"
          body-class="text-center"
        >
          <template #body="{ data: row }">
            <InputNumber
              :model-value="getCellValue(row, field) as number"
              :disabled="readonly"
              size="small"
              :class="readonly ? 'w-full' : 'w-full min-w-16'"
              @update:model-value="updateCell(row, field, $event)"
            />
          </template>
        </Column>

        <Column field="shift" header="Shift" :style="{ width: '9rem' }">
          <template #body="{ data: row }">
            <Select
              :model-value="row.shift"
              :options="shiftOptions"
              :disabled="readonly"
              size="small"
              class="min-w-32"
              @update:model-value="updateCell(row, 'shift', $event)"
            />
          </template>
        </Column>

        <Column
          v-if="selected === 'outlet'"
          field="jabatan"
          header="Jabatan"
          :style="{ width: '10rem' }"
        >
          <template #body="{ data: row }">
            <span
              class="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium"
              :style="{
                backgroundColor: 'color-mix(in srgb, var(--bnf-color-primary) 12%, transparent)',
                color: colorTokens.primary,
              }"
            >
              {{ row.jabatan }}
            </span>
          </template>
        </Column>

        <Column
          field="salesUser"
          header="Sales User (3 bln)"
          :style="{ width: '10rem' }"
          body-class="text-right"
        >
          <template #body="{ data: row }">{{ displaySales(row.salesUser) }}</template>
        </Column>
        <Column
          field="salesOutlet"
          header="Sales Outlet (3 bln)"
          :style="{ width: '10rem' }"
          body-class="text-right"
        >
          <template #body="{ data: row }">{{ displaySales(row.salesOutlet) }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
