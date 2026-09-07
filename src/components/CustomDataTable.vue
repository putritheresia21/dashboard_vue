<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { ref, computed, watch, nextTick } from 'vue'
import Column from 'primevue/column'
import Select from 'primevue/select'
import SearchInput from '@/components/SearchInput.vue'

export interface ColumnDef {
  field: string
  header: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  slot?: string //nama scoped-slot, defaultnya field
  hideOnMobile?: boolean //sembunyikan kolom ini di layar kecil (<640px)
}

export interface FilterDef {
  key: string
  placeholder: string
  options: string[]
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    data: any[]
    columns: ColumnDef[]
    searchFields?: string[]
    searchPlaceholder?: string
    filters?: FilterDef[]
    rows?: number
    rowsPerPageOptions?: number[]
    showActions?: boolean
  }>(),
  {
    searchFields: () => [],
    searchPlaceholder: () => 'Search...',
    filters: () => [],
    rows: 10,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    showActions: true,
  },
)

const searchQuery = ref('')
const activeFilters = ref<Record<string, string | null>>({})

const filteredData = computed(() => {
  return props.data.filter((item) => {
    const matchesSearch =
      !searchQuery.value ||
      props.searchFields.some((field) =>
        String(item[field] ?? '')
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()),
      )
    const matchesFilters = props.filters.every((f) => {
      const val = activeFilters.value[f.key]
      return !val || item[f.key] === val
    })
    return matchesSearch && matchesFilters
  })
})

function alignClass(align?: ColumnDef['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return undefined
}

function columnClass(col: ColumnDef) {
  const classes = [alignClass(col.align)]
  if (col.hideOnMobile) classes.push('hide-on-mobile')
  return classes.filter(Boolean).join(' ')
}

// reset scroll ke kiri tiap kali data/filter berubah, biar user selalu mulai dari kolom pertama
const scrollContainer = ref<HTMLElement | null>(null)
watch(filteredData, () => {
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollLeft = 0
  })
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-100"
    >
      <div>
        <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm: items-center gap-2">
        <SearchInput
          v-if="searchFields.length"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
        />
        <Select
          v-for="f in filters"
          :key="f.key"
          v-model="activeFilters[f.key]"
          :options="f.options"
          :placeholder="f.placeholder"
          show-clear
          size="small"
          class="w-full sm:w-40"
        />
      </div>
    </div>

    <div class="overflow-x-auto w-full" ref="scrollContainer">
      <DataTable
        :value="filteredData"
        paginator
        :rows="rows"
        :rows-per-page-options="rowsPerPageOptions"
        table-style="min-width: 40rem"
      >
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :style="col.width ? { width: col.width } : undefined"
          :header-class="columnClass(col)"
          :body-class="columnClass(col)"
        >
          <template #body="slotProps">
            <slot :name="col.slot || col.field" v-bind="slotProps">
              {{ slotProps.data[col.field] }}
            </slot>
          </template>
        </Column>

        <Column v-if="showActions && $slots.actions" header="" style="width: 6rem">
          <template #body="slotProps">
            <div class="flex items-center justify-end gap-1">
              <slot name="actions" v-bind="slotProps" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background: #fafbfc;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 14px 20px;
}
:deep(.p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 20px;
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

/* Sembunyikan kolom yang ditandai hideOnMobile di layar < 640px */
@media (max-width: 639px) {
  :deep(.hide-on-mobile) {
    display: none;
  }
}
</style>
