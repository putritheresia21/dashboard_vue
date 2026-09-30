<script setup lang="ts">
import StatusTabs from './filters/fields/StatusTabs.vue'
import SearchInput from './SearchInput.vue'
import InlineSelectFilter from './filters/InlineSelectFilter.vue'

interface TabDef {
  label: string
  value: string | null
  color?: string
  activeColor?: string
  activeTextColor?: string
  count?: number
  compute?: (data: any[]) => number
}

const props = withDefaults(
  defineProps<{
    tabs?: TabDef[]
    data?: any[]
    statusField?: string
    tabsIcon?: string
    tabsTitle?: string

    searchPlaceHolder?: string
    filterLabel?: string
    filterIcon?: string
    filterOptions?: any[]
    filterOptionLabel?: string
    filterOptionValue?: string
    filterPlaceholder?: string
  }>(),
  {
    tabs: () => [],
    data: () => [],
    tabsIcon: 'pi pi-list',
    tabsTitle: '',
    searchPlaceHolder: 'Cari....',
    filterLabel: 'FILTER',
    filterIcon: 'pi-pi-filter',
    filterOptions: () => [],
  },
)

const activeTab = defineModel<string | null>('activeTab', { default: null })
const searchQuery = defineModel<string>('searchQuery', { default: '' })
const filterValue = defineModel<any>('filterValue', { default: null })
</script>

<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
  >
    <StatusTabs
      v-if="tabs.length"
      v-model="activeTab"
      :tabs="tabs"
      :data="data"
      :status-field="statusField"
      :icon="tabsIcon"
      :title="tabsTitle"
    />

    <div class="flex items-center gap-3 flex-nowrap">
      <div class="w-full sm:w-64 shrink-0">
        <SearchInput v-model="searchQuery" :placeholder="searchPlaceHolder" />
      </div>

      <div v-if="filterOptions.length" class="w-px h-6 bg-slate-200 hidden sm:block shrink-0" />

      <InlineSelectFilter
        v-if="filterOptions.length"
        v-model="filterValue"
        :label="filterLabel"
        :icon="filterIcon"
        :options="filterOptions"
        :option-label="filterOptionLabel"
        :option-value="filterOptionValue"
        :placeholder="filterPlaceholder"
      />
    </div>
  </div>
</template>
