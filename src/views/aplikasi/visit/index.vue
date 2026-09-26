<route lang="yaml">
meta:
  title: Visit
</route>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DynamicList from '@/components/DynamicList.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { sidebarMenu } from '@/config/sidebarMenu'
import PageWrapper from '@/layouts/shared/PageWrapper.vue'

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
  <PageWrapper title="Visit">
    <DynamicList
      :items="visitItems"
      :layout="isMobile ? 'column' : 'grid'"
      :columns="isMobile ? 1 : 2"
      :padding="6"
      clickable
      :show-arrow="!isMobile"
      @item-click="goToItem"
    >
      <template #item="{ item }">
        <span
          v-if="(item as VisitItem).tag"
          class="absolute top-1.5 right-1.5 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded z-10"
          >{{ (item as VisitItem).tag }}</span
        >
        <div
          class="w-10 h-10 flex items-center justify-center rounded-xl shadow-md bg-blue-50 shrink-0"
        >
          <img
            :src="(item as VisitItem).icon"
            :alt="(item as VisitItem).label"
            class="w-6 h-6 object-contain"
          />
        </div>
        <span class="text-sm font-medium text-slate-800 truncate">{{
          (item as VisitItem).label
        }}</span>
      </template>
    </DynamicList>
  </PageWrapper>
</template>
