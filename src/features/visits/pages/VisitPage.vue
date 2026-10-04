<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { sidebarMenu } from '@/app/navigation/sidebarMenu'
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'

const isMobile = useIsMobile()
const router = useRouter()

interface VisitItem {
  id: string
  label: string
  icon?: string
  tag?: string
  to: string
}

const specialTags: Record<string, string> = {
  'Check In / Out': 'SERING',
  'Rencana Visit Mingguan': 'SERING',
}

const visitItems = computed<VisitItem[]>(() => {
  const children = sidebarMenu.find((m) => m.label === 'Visit')?.children ?? []
  return children.map((child) => ({
    id: child.label.toLocaleLowerCase().replace(/\s+/g, '-'),
    label: child.label,
    icon: child.icon,
    tag: specialTags[child.label],
    to: child.to,
  }))
})

function goToItem(item: unknown) {
  router.push((item as VisitItem).to)
}
</script>

<template>
  <AppHeader title="Visit" subtitle="Pilih jenis pengajuan yang ingin Anda buat.">
    <DynamicList
      :items="visitItems"
      :layout="isMobile ? 'column' : 'grid'"
      :columns="isMobile ? 1 : 2"
      :padding="3"
      item-orientation="horizontal"
      background="bg-bnf-surface shadow-sm border border-bnf-border"
      clickable
      :show-arrow="!isMobile"
      @item-click="goToItem"
    >
      <template #item="{ item }">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bnf-primary/5 shadow-md"
        >
          <img
            :src="(item as VisitItem).icon"
            :alt="(item as VisitItem).label"
            class="h-6 w-6 object-contain"
          />
        </div>
        <div class="flex min-w-0 items-center gap-2">
          <span class="truncate text-sm font-medium text-bnf-text">{{
            (item as VisitItem).label
          }}</span>
          <span
            v-if="(item as VisitItem).tag"
            class="shrink-0 rounded-md bg-bnf-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-bnf-primary"
            >{{ (item as VisitItem).tag }}</span
          >
        </div>
      </template>
    </DynamicList>
  </AppHeader>
</template>
