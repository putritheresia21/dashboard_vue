<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { ref, computed, watch, nextTick, useSlots } from 'vue'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import SearchInput from '@/components/SearchInput.vue'
import FilterBar from '@/components/filters/FilterBar.vue'
import {
  defaultFilterValue,
  matchesAllFilters,
  type FilterDef,
  type FilterValue,
} from '@/components/filters/filterTypes'
import ExcelExport from './export/ExcelExport.vue'

interface ColumnDef {
  field: string
  header: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  slot?: string
  hideOnMobile?: boolean
  type?: 'text' | 'icon-text'
  format?: (value: any, row: any) => string

  iconField?: string
  titleField?: string
  subtitleField?: string
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
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
    showExport?: boolean
    exportFileName?: string
  }>(),
  {
    searchFields: () => [],
    searchPlaceholder: () => 'Search...',
    filters: () => [],
    rows: 10,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    showActions: true,
    showView: false,
    showEdit: false,
    showDelete: false,
    showExport: false,
    exportFileName: 'export',
  },
)

const emit = defineEmits<{
  view: [row: any]
  edit: [row: any]
  delete: [row: any]
}>()

const slots = useSlots()

const hasActionsColumn = computed(
  () =>
    props.showActions && (!!slots.actions || props.showView || props.showEdit || props.showDelete),
)

const searchQuery = ref('')
const activeFilters = ref<Record<string, FilterValue>>({})

watch(
  () => props.filters,
  (newFilters) => {
    const next: Record<string, FilterValue> = {}
    newFilters.forEach((f) => {
      next[f.key] = activeFilters.value[f.key] ?? defaultFilterValue(f)
    })
    activeFilters.value = next
  },
  { immediate: true },
)

const filteredData = computed(() => {
  return props.data.filter((item) => {
    const matchesSearch =
      !searchQuery.value ||
      props.searchFields.some((field) =>
        String(item[field] ?? '')
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()),
      )
    const matchesFilters = matchesAllFilters(item, props.filters, activeFilters.value)
    return matchesSearch && matchesFilters
  })
})

const exportColumns = computed(() => props.columns.map((c) => ({ key: c.field, header: c.header })))

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

const scrollContainer = ref<HTMLElement | null>(null)
watch(filteredData, () => {
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollLeft = 0
  })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!--card filter-->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5"
        :class="filters.length ? 'border-b border-slate-100' : ''"
      >
        <div>
          <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
          <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
        </div>
        <SearchInput
          v-if="searchFields.length"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
        />
        <ExcelExport
          v-if="showExport"
          :data="filteredData"
          :columns="exportColumns"
          :file-name="exportFileName"
          button-class="w-auto"
        />
      </div>
      <div v-if="filters.length" class="p-5">
        <FilterBar :filters="filters" v-model="activeFilters" :data="data" />
      </div>
    </div>

    <!--Card 2: tabel-->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-w-0">
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
            :style="col.width ? { minWidth: col.width } : undefined"
            :header-class="columnClass(col)"
            :body-class="columnClass(col)"
          >
            <template #body="slotProps">
              <slot v-if="col.slot" :name="col.slot" v-bind="slotProps">
                {{ slotProps.data[col.field] }}
              </slot>

              <div v-else-if="col.type === 'icon-text'" class="flex items-center gap-3">
                <Avatar
                  :image="slotProps.data[col.iconField || `${col.field}Icon`]"
                  shape="circle"
                />
                <div class="flex flex-col">
                  <span class="font-medium text-slate-800">
                    {{ slotProps.data[col.titleField || col.field] }}
                  </span>
                  <span v-if="col.subtitleField" class="text-xs text-slate-400">
                    {{ slotProps.data[col.subtitleField] }}
                  </span>
                </div>
              </div>
              <span v-else>
                {{
                  col.format
                    ? col.format(slotProps.data[col.field], slotProps.data)
                    : slotProps.data[col.field]
                }}
              </span>
            </template>
          </Column>

          <Column v-if="hasActionsColumn" header="" style="width: 6rem">
            <template #body="slotProps">
              <div class="flex items-center justify-end gap-1">
                <slot v-if="$slots.actions" name="actions" v-bind="slotProps" />

                <template v-else>
                  <Button
                    v-if="showView"
                    icon="pi pi-eye"
                    severity="info"
                    text
                    rounded
                    size="small"
                    aria-label="Detail"
                    @click="emit('view', slotProps.data)"
                  />
                  <Button
                    v-if="showEdit"
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    aria-label="Edit"
                    @click="emit('edit', slotProps.data)"
                  />
                  <Button
                    v-if="showDelete"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    size="small"
                    aria-label="Delete"
                    @click="emit('delete', slotProps.data)"
                  />
                </template>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
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

@media (max-width: 639px) {
  :deep(.hide-on-mobile) {
    display: none;
  }
}
</style>
