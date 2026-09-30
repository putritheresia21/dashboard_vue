<script setup lang="ts">
import { computed } from 'vue'

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
    tabs: TabDef[]
    data?: any[]
    statusField?: string
    icon?: string
    title?: string
  }>(),
  {
    data: () => [],
    icon: 'pi pi-list',
    title: '',
  },
)

const model = defineModel<string | null>({ default: null })

function countFor(tab: TabDef): number | null {
  if (tab.count !== undefined) return tab.count
  if (tab.compute) return tab.compute(props.data)
  if (!props.statusField) return null
  return tab.value === null
    ? props.data.length
    : props.data.filter((d) => d[props.statusField!] === tab.value).length
}

const resolvedTabs = computed(() =>
  props.tabs.map((tab) => ({ ...tab, resolvedCount: countFor(tab) })),
)

function tabStyle(tab: TabDef & { resolvedCount: number | null }) {
  const isActive = model.value === tab.value
  return {
    flexShrink: 0,
    fontSize: '12px',
    lineHeight: '1.4',
    padding: '8px 14px',
    borderRadius: '9999px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isActive ? (tab.activeColor ?? '#1e293b') : '#f8fafc',
    color: isActive ? (tab.activeTextColor ?? '#fff') : '#64748b',
  }
}
</script>

<template>
  <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
    <span
      v-if="title"
      class="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-400 shrink-0"
    >
      <i v-if="icon" :class="icon" class="text-xs sm:text-sm"></i>
      {{ title }}
    </span>

    <div
      style="display: flex; align-items: center; gap: 6px; overflow-x: auto"
      class="scrollbar-hide"
    >
      <button
        v-for="tab in resolvedTabs"
        :key="tab.value ?? 'all'"
        @click="model = tab.value"
        type="button"
        :style="tabStyle(tab)"
      >
        <span
          v-if="tab.color"
          style="width: 6px; height: 6px; border-radius: 9999px; flex-shrink: 0"
          :style="{ backgroundColor: tab.color }"
        ></span>
        {{ tab.label }}
        <template v-if="tab.resolvedCount !== null"> ({{ tab.resolvedCount }})</template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
