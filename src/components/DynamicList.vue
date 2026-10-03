<script setup lang="ts" generic="T">
import { ChevronLeftIcon, ChevronRightIcon } from '@primevue/icons'
import { computed, ref, watch } from 'vue'

type Layout = 'grid' | 'column'
type Columns = 1 | 2 | 3 | 4
type Gap = 1 | 2 | 3 | 4 | 6
type Padding = 0 | 2 | 3 | 4 | 5 | 6 | 8

interface Props {
  items: T[]
  layout?: Layout
  columns?: Columns
  gap?: Gap
  clickable?: boolean
  isExpanded?: boolean
  showArrow?: boolean
  padding?: Padding
  paginate?: boolean
  pageSize?: number
  emptyText?: string
  background?: string | ((item: T, index: number) => string)
  rounded?: string
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'column',
  columns: 2,
  gap: 3,
  clickable: false,
  isExpanded: false,
  showArrow: true,
  padding: 3,
  paginate: false,
  pageSize: 10,
  emptyText: 'Tidak ada data',
  background: 'bg-white',
  rounded: 'rounded-xl',
})

const emit = defineEmits<{
  'item-click': [item: T, index: number]
  'page-change': [page: number]
}>()

const currentPage = ref(1)

function itemKey(item: T, index: number): PropertyKey {
  const candidate = (item as { id?: unknown })?.id
  return typeof candidate === 'string' || typeof candidate === 'number' ? candidate : index
}

const totalPages = computed((): number => {
  if (!props.paginate) {
    return 1
  }
  return Math.max(1, Math.ceil(props.items.length / props.pageSize))
})

const pagedItems = computed((): T[] => {
  if (!props.paginate) {
    return props.items
  }
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
  if (page < 1 || page > totalPages.value) {
    return
  }
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
      0: 'p-0',
      2: 'p-2',
      3: 'p-3',
      4: 'p-4',
      5: 'p-5',
      6: 'p-6',
      8: 'p-8',
    })[props.padding] ?? 'p-3',
)

const handleItemClick = (item: T, index: number) => {
  if (props.clickable && !props.isExpanded) {
    emit('item-click', item, index)
  } else if (props.isExpanded) {
    toggleExpand(index)
  }
}

const expandedIndexes = ref<number[]>([])

const toggleExpand = (index: number) => {
  const i = expandedIndexes.value.indexOf(index)
  if (i > -1) {
    expandedIndexes.value.splice(i, 1) // Tutup jika sudah ada
  } else {
    expandedIndexes.value.push(index) // Buka jika belum ada
  }
}
</script>

<template>
  <div :class="[layout === 'grid' ? `grid ${gridColsClass}` : 'flex flex-col', gapClass]">
    <div v-for="(item, index) in pagedItems" :key="itemKey(item, index)">
      <component
        :is="clickable ? 'button' : 'div'"
        class="relative flex w-full"
        :class="[
          typeof background === 'function' ? background(item, index) : background,
          rounded,
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
          :class="
            layout === 'grid' ? 'flex-col gap-1.5 sm:flex-row sm:gap-2.5' : 'flex-row gap-2.5'
          "
        >
          <slot name="item" :item="item" :index="index" />
        </div>

        <ChevronRightIcon
          v-if="showArrow"
          class="text-gray-400 shrink-0 ml-2"
          :class="layout === 'grid' ? 'hidden sm:block' : 'block'"
          :style="{ width: '14px', height: '14px' }"
        />
        <div v-else-if="isExpanded" class="px-4 text-gray-500 shrink-0">
          <svg
            v-if="expandedIndexes.includes(index)"
            class="w-5 h-5 bg-white rounded shadow-sm p-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 bg-white rounded shadow-sm p-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </component>
      <div
        v-show="expandedIndexes.includes(index)"
        class="flex flex-col w-full cursor-default"
        :class="paddingClass"
      >
        <slot name="expanded" :item="item" :index="index" />
      </div>
    </div>
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
