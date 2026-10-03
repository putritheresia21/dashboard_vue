<script setup lang="ts" generic="T">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed, ref, useSlots, watch } from 'vue'

import CellInput from './cells/CellInput.vue'
import CellSelect from './cells/CellSelect.vue'
import type { ColumnDef, DataRow } from './custom-data-table.types'

type Flag = boolean | ((row: DataRow) => boolean)

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    data: T[]
    columns: ColumnDef[]
    rows?: number
    showActions?: boolean
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
    rowKey?: string
    readonly?: boolean
    groupRowsBy?: string | string[]
    // rowEditable?: (row: any) => boolean
  }>(),
  {
    title: '',
    subtitle: '',
    rows: 10,
    showActions: false,
    showView: false,
    showEdit: false,
    showDelete: false,
    rowKey: 'id',
    readonly: false,
    groupRowsBy: undefined,
  },
)

const emit = defineEmits<{
  view: [row: T]
  edit: [row: T]
  delete: [row: T]
  'update:data': [rows: T[]]
  change: [payload: { row: T; key: string; value: unknown; rows: T[] }]
}>()

const slots = useSlots()

const hasActionsColumn = computed(
  () =>
    props.showActions && (!!slots.actions || props.showView || props.showEdit || props.showDelete),
)

function alignClass(align?: 'left' | 'center' | 'right') {
  if (align === 'center') {
    return 'text-center'
  }
  if (align === 'right') {
    return 'text-right'
  }
  return undefined
}

const defaultBadgeColor = { bg: '#dbeafe', text: '#1d4ed8' }

function badgeStyle(col: ColumnDef, value: unknown) {
  const key = String(value)
  const custom = col.badgeMap?.[key]
  if (custom) {
    return { backgroundColor: custom.bg, color: custom.text }
  }
  return { backgroundColor: defaultBadgeColor.bg, color: defaultBadgeColor.text }
}

function badgeLabel(col: ColumnDef, value: unknown) {
  return col.badgeMap?.[String(value)]?.label ?? value
}

//kotak dan editable
function flag(f: Flag | undefined, row: DataRow) {
  return typeof f === 'function' ? !!f(row) : !!f
}

function isBoxed(col: ColumnDef, row: DataRow) {
  return col.boxed === undefined ? flag(col.editable, row) : flag(col.boxed, row)
}

function canEdit(col: ColumnDef, row: DataRow) {
  if (!isBoxed(col, row)) {
    return false
  }
  if (props.readonly) {
    return false
  }
  // if (props.rowEditable && !props.rowEditable(row)) return false
  return flag(col.editable, row)
}

function updateCell(row: T, key: string, value: unknown) {
  const rowRecord = row as DataRow
  const id = rowRecord[props.rowKey]
  const rows = props.data.map((r) => {
    const record = r as DataRow
    return record[props.rowKey] === id ? ({ ...record, [key]: value } as T) : r
  })
  emit('update:data', rows)
  emit('change', { row: { ...row, [key]: value }, key, value, rows })
}

//custom paggination state
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.data.length / props.rows)))

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * props.rows
  return props.data.slice(start, start + props.rows)
})

const rangeStart = computed(() =>
  props.data.length === 0 ? 0 : (currentPage.value - 1) * props.rows + 1,
)
const rangeEnd = computed(() => Math.min(currentPage.value * props.rows, props.data.length))

watch(
  () => props.data.length,
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return
  }
  currentPage.value = page
}

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxButtons = 5

  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + maxButtons - 1)
  start = Math.max(1, end - maxButtons + 1)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
    <div v-if="title || subtitle" class="p-5 border-b border-slate-100">
      <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
      <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
    </div>

    <div class="overflow-x-auto w-full">
      <DataTable
        :value="pagedData"
        table-style="width: 100%"
        row-group-mode="rowspan"
        :group-rows-by="groupRowsBy"
      >
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.uniqueField ?? col.field"
          :header="col.header"
          :sortable="col.sortable"
          :style="col.width ? { width: col.width, minWidth: col.width } : { width: 'auto' }"
          :header-class="alignClass(col.headerAlign ?? col.align)"
          :body-class="alignClass(col.align)"
        >
          <template #body="slotProps">
            <span v-if="col.type === 'index'">{{
              (currentPage - 1) * rows + slotProps.index + 1
            }}</span>

            <slot v-else-if="col.slot" :name="col.slot" v-bind="slotProps">
              {{ slotProps.data[col.field] }}
            </slot>

            <span
              v-else-if="col.type === 'badge'"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
              :style="badgeStyle(col, slotProps.data[col.field])"
            >
              {{ badgeLabel(col, slotProps.data[col.field]) }}
            </span>

            <!--dot-->
            <span
              v-else-if="col.type === 'dot'"
              class="inline-block h-2.5 w-2.5 rounded-full"
              :style="{ background: col.dotColor?.(slotProps.data) ?? 'transparent' }"
            ></span>

            <template v-else-if="isBoxed(col, slotProps.data)">
              <CellSelect
                v-if="col.type === 'select'"
                :model-value="slotProps.data[col.field]"
                :options="col.options ?? []"
                :disabled="!canEdit(col, slotProps.data)"
                @update:model-value="updateCell(slotProps.data, col.field, $event)"
              />
              <CellInput
                v-else
                :type="col.type === 'number' ? 'number' : 'text'"
                :model-value="slotProps.data[col.field]"
                :min="col.min"
                :max="col.max"
                :disabled="!canEdit(col, slotProps.data)"
                @update:model-value="updateCell(slotProps.data, col.field, $event)"
              />
            </template>

            <span v-else :title="slotProps.data[col.field]">
              {{ slotProps.data[col.field] }}
            </span>
          </template>
        </Column>

        <Column v-if="hasActionsColumn" header="AKSI" style="width: 6rem">
          <template #body="slotProps">
            <div class="flex items-center justify-end gap-1">
              <slot v-if="$slots.actions" name="actions" v-bind="slotProps" />
              <template v-else>
                <Button
                  v-if="showView"
                  label="Review"
                  icon="pi pi-eye"
                  severity="info"
                  rounded
                  size="small"
                  class="!bg-slate-800 !border-slate-800 !text-xs !py-1 !px-3"
                  @click="emit('view', slotProps.data)"
                />
                <Button
                  v-if="showEdit"
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="emit('edit', slotProps.data)"
                />
                <Button
                  v-if="showDelete"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="emit('delete', slotProps.data)"
                />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <!--custom paginator-->
  <div class="mt-4 flex w-full items-center justify-end gap-3 text-sm text-gray-400">
    <span class="text-xs text-slate-400">
      Menampilkan {{ rangeStart }}-{{ rangeEnd }} dari {{ data.length }} data
    </span>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <i class="pi pi-chevron-left text-xs"></i>
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="min-w-8 h-8 px-2 rounded-full text-sm font-medium transition-colors"
        :class="
          page === currentPage
            ? 'bg-slate-800 text-white'
            : 'bg-slate-100 text-slate-600 hiver:bg-slate-200'
        "
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <i class="pi pi-chevron-right text-xs"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable-table) {
  table-layout: auto;
  width: 100%;
}

:deep(.p-datatable-thead > tr > th) {
  background: #fafbfc;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 10px 14px;
}
:deep(.p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 8px 14px;
  font-size: 0.8125rem;
  color: #334155;
  vertical-align: top;
}
:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
}
:deep(.p-datatable-tbody > tr) {
  transition: background-color 0.15s ease;
}
:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.text-center) {
  text-align: center;
}
:deep(.text-right) {
  text-align: right;
}
:deep(.text-center .p-datatable-column-header-content) {
  justify-content: center;
}
:deep(.text-right .p-datatable-column-header-content) {
  justify-content: flex-end;
}
</style>
