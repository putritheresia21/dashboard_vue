<script setup lang="ts">
import { Card, Column, DataTable, InputNumber, Select, Tag } from '@bernofarm/core'
import { computed } from 'vue'

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

// Badge memakai varian soft dari core; warnanya mengikuti token theme.
const badgeClass = 'whitespace-nowrap px-2 py-0 text-[11px] leading-5'

const tipeSeverity: Record<string, string> = {
  RS: 'primary',
  Klinik: 'success',
  Apotek: 'danger',
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

function tipeBadge(value: unknown) {
  return tipeSeverity[String(value)] ?? 'primary'
}

function displaySales(value: unknown) {
  if (typeof value === 'number') {
    return formatRupiah(value)
  }
  return value || '-'
}
</script>

<template>
  <Card class="min-w-0 overflow-hidden">
    <div class="w-full overflow-x-auto">
      <DataTable
        :key="selected"
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
              <Tag severity="primary" variant="soft" rounded :class="badgeClass">{{
                row.jabatan
              }}</Tag>
            </template>
          </Column>
          <Column field="outlet" header="Outlet" />
          <Column field="tipe" header="Tipe" :style="{ width: '5rem' }">
            <template #body="{ data: row }">
              <Tag :severity="tipeBadge(row.tipe)" variant="soft" rounded :class="badgeClass">
                {{ row.tipe }}
              </Tag>
            </template>
          </Column>
        </template>

        <template v-else>
          <Column field="outlet" header="Outlet" />
          <Column field="uniqueTipe" header="Tipe" :style="{ width: '5rem' }">
            <template #body="{ data: row }">
              <Tag :severity="tipeBadge(row.tipe)" variant="soft" rounded :class="badgeClass">
                {{ row.tipe }}
              </Tag>
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
            <Tag severity="primary" variant="soft" rounded :class="badgeClass">{{
              row.jabatan
            }}</Tag>
          </template>
        </Column>

        <Column
          field="salesUser"
          header="Sales User (3 bln)"
          :style="{ width: '11rem' }"
          header-class="whitespace-nowrap"
          body-class="text-right"
        >
          <template #body="{ data: row }">{{ displaySales(row.salesUser) }}</template>
        </Column>
        <Column
          field="salesOutlet"
          header="Sales Outlet (3 bln)"
          :style="{ width: '11rem' }"
          header-class="whitespace-nowrap"
          body-class="text-right"
        >
          <template #body="{ data: row }">{{ displaySales(row.salesOutlet) }}</template>
        </Column>
      </DataTable>
    </div>
  </Card>
</template>
