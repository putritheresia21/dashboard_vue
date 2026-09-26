<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@primevue/icons'

type Layout = 'grid' | 'column'
type Columns = 1 | 2 | 3 | 4
type Gap = 1 | 2 | 3 | 4 | 6
type Padding = 2 | 3 | 4 | 5 | 6

interface Props {
  items: unknown[]
  layout?: Layout
  columns?: Columns
  gap?: Gap
  clickable?: boolean
  showArrow?: boolean
  padding?: Padding
  paginate?: boolean
  pageSize?: number
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'column',
  columns: 2,
  gap: 3,
  clickable: false,
  showArrow: true,
  padding: 3,
  paginate: false,
  pageSize: 10,
  emptyText: 'Tidak ada data',
})

const emit = defineEmits<{
  'item-click': [item: unknown, index: number]
  'page-change': [page: number]
}>()

const currentPage = ref(1)

const totalPages = computed((): number => {
  if (!props.paginate) return 1
  return Math.max(1, Math.ceil(props.items.length / props.pageSize))
})

const pagedItems = computed((): unknown[] => {
  if (!props.paginate) return props.items
  const start = (currentPage.value - 1) * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})

const rangeStart = computed((): number =>
  props.items.length === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1,
)

const rangeEnd = computed((): number =>
  Math.min(currentPage.value * props.pageSize, props.items.length),
)

watch(
  () => props.items,
  () => {
    currentPage.value = 1
  },
)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emit('page-change', page)
}

const gridColsClass = computed<string>(
  () =>
    ({
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    })[props.columns] ?? 'grid-cols-2',
)

const gapClass = computed<string>(
  () =>
    ({
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
    })[props.gap] ?? 'gap-3',
)

const paddingClass = computed<string>(
  () =>
    ({
      2: 'p-2',
      3: 'p-3',
      4: 'p-4',
      5: 'p-5',
      6: 'p-6',
    })[props.padding] ?? 'p-3',
)

const handleItemClick = (item: unknown, index: number) => {
  if (props.clickable) emit('item-click', item, index)
}
</script>

<template>
  <div :class="[layout === 'grid' ? `grid ${gridColsClass}` : 'flex flex-col', gapClass]">
    <component
      :is="clickable ? 'button' : 'div'"
      v-for="(item, index) in pagedItems"
      :key="(item as any)?.id ?? index"
      class="relative flex w-full bg-white rounded-xl"
      :class="[
        layout === 'grid'
          ? 'flex-col items-center text-center gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:text-left'
          : 'flex-row items-center justify-between text-left',
        clickable ? 'cursor-pointer active:bg-gray-50' : 'cursor-default',
        paddingClass,
      ]"
      @click="handleItemClick(item, index)"
    >
      <div
        class="flex items-center min-w-0 flex-1"
        :class="layout === 'grid' ? 'flex-col gap-1.5 sm:flex-row sm:gap-2.5' : 'flex-row gap-2.5'"
      >
        <slot name="item" :item="item" :index="index" />
      </div>

      <ChevronRightIcon
        v-if="showArrow"
        class="text-gray-400 shrink-0 ml-2"
        :class="layout === 'grid' ? 'hidden sm:block' : 'block'"
        :style="{ width: '14px', height: '14px' }"
      />
    </component>

    <p v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
      {{ emptyText }}
    </p>
  </div>

  <div
    v-if="paginate && items.length > 0"
    class="mt-4 flex w-full items-center justify-end gap-3 text-sm text-gray-400"
  >
    <span>Menampilkan {{ rangeStart }}-{{ rangeEnd }} dari {{ items.length }} data</span>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeftIcon :style="{ width: '12px', height: '12px' }" />
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium"
        :class="
          page === currentPage ? 'bg-[#0a1e42] text-white' : 'text-gray-500 hover:bg-gray-100'
        "
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRightIcon :style="{ width: '12px', height: '12px' }" />
      </button>
    </div>
  </div>
</template>
