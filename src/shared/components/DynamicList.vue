<script setup lang="ts" generic="T">
import { ChevronLeftIcon, ChevronRightIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref, watch } from 'vue'

type Layout = 'grid' | 'column'
type Columns = 1 | 2 | 3 | 4
type Gap = 1 | 2 | 3 | 4 | 6
type Padding = 0 | 2 | 3 | 4 | 5 | 6 | 8
type ItemOrientation = 'responsive' | 'horizontal' | 'vertical'

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
  itemOrientation?: ItemOrientation
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
  background: 'bg-bnf-surface',
  rounded: 'rounded-bnf-xl',
  itemOrientation: 'responsive',
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
      1: 'gap-bnf-xs',
      2: 'gap-bnf-sm',
      3: 'gap-bnf-md',
      4: 'gap-bnf-lg',
      6: 'gap-bnf-xl',
    })[props.gap] ?? 'gap-bnf-md',
)

const paddingClass = computed<string>(
  () =>
    ({
      0: 'p-0',
      2: 'p-bnf-sm',
      3: 'p-bnf-md',
      4: 'p-bnf-lg',
      5: 'p-bnf-lg',
      6: 'p-bnf-xl',
      8: 'p-bnf-xl',
    })[props.padding] ?? 'p-bnf-md',
)

const itemOrientationClass = computed<string>(() => {
  if (props.layout !== 'grid') {
    return 'flex-row items-center justify-between text-left'
  }

  if (props.itemOrientation === 'horizontal') {
    return 'flex-row items-center justify-between gap-bnf-sm text-left'
  }

  if (props.itemOrientation === 'vertical') {
    return 'flex-col items-center gap-bnf-sm text-center'
  }

  return 'flex-col items-center gap-bnf-sm text-center sm:flex-row sm:justify-between sm:text-left'
})

const itemContentOrientationClass = computed<string>(() => {
  if (props.layout !== 'grid') {
    return 'flex-row gap-bnf-md'
  }

  if (props.itemOrientation === 'horizontal') {
    return 'flex-row gap-bnf-md'
  }

  if (props.itemOrientation === 'vertical') {
    return 'flex-col gap-bnf-sm'
  }

  return 'flex-col gap-bnf-sm sm:flex-row sm:gap-bnf-md'
})

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
          itemOrientationClass,
          clickable ? 'cursor-pointer active:bg-bnf-surface-muted' : 'cursor-default',
          paddingClass,
        ]"
        @click="handleItemClick(item, index)"
      >
        <div class="flex items-center min-w-0 flex-1" :class="itemContentOrientationClass">
          <slot name="item" :item="item" :index="index" />
        </div>

        <HugeiconsIcon
          v-if="showArrow"
          :icon="ChevronRightIcon"
          :size="14"
          :stroke-width="1.8"
          class="ml-2 h-3.5 w-3.5 shrink-0 text-bnf-text-muted"
          :class="
            props.layout === 'grid' && props.itemOrientation === 'responsive'
              ? 'hidden sm:block'
              : 'block'
          "
        />
        <div v-else-if="isExpanded" class="shrink-0 px-bnf-lg text-bnf-text-muted">
          <svg
            v-if="expandedIndexes.includes(index)"
            class="h-5 w-5 rounded-bnf-sm bg-bnf-surface p-0.5 shadow-bnf-sm"
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
            class="h-5 w-5 rounded-bnf-sm bg-bnf-surface p-0.5 shadow-bnf-sm"
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
    <p v-if="items.length === 0" class="py-bnf-xl text-center text-sm text-bnf-text-muted">
      {{ emptyText }}
    </p>
  </div>

  <div
    v-if="paginate && items.length > 0"
    class="mt-bnf-lg flex w-full items-center justify-end gap-bnf-md text-sm text-bnf-text-muted"
  >
    <span>Menampilkan {{ rangeStart }}-{{ rangeEnd }} dari {{ items.length }} data</span>

    <div class="flex items-center gap-bnf-xs">
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-bnf-sm text-bnf-text-muted hover:bg-bnf-surface-muted disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <HugeiconsIcon :icon="ChevronLeftIcon" :size="12" :stroke-width="1.8" class="h-3 w-3" />
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-bnf-sm text-xs font-medium"
        :class="
          page === currentPage
            ? 'bg-bnf-text text-bnf-primary-foreground'
            : 'text-bnf-text-muted hover:bg-bnf-surface-muted'
        "
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-bnf-sm text-bnf-text-muted hover:bg-bnf-surface-muted disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <HugeiconsIcon :icon="ChevronRightIcon" :size="12" :stroke-width="1.8" class="h-3 w-3" />
      </button>
    </div>
  </div>
</template>
