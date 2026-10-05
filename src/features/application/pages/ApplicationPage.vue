<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { sidebarMenu } from '@/app/navigation/sidebarMenu'
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'

const isMobile = useIsMobile()
const router = useRouter()

interface MenuItem {
  id: string
  label: string
  icon: string
  tag?: string
  route: string
}

const specialTags: Record<string, string> = {
  Visit: 'SERING',
}

const menuItems = computed<MenuItem[]>(() =>
  sidebarMenu.map((menu) => ({
    id: menu.label.toLocaleLowerCase().replace(/\s+/g, '-'),
    label: menu.label,
    icon: menu.icon,
    tag: specialTags[menu.label],
    route: menu.parentRoute,
  })),
)

function goToMenu(item: unknown) {
  const menu = item as MenuItem
  router.push(menu.route)
}
</script>

<template>
  <AppHeader
    title="Aplikasi Saya"
    subtitle="Akses seluruh perangkat kerja perusahaan anda"
    :show-back="false"
  >
    <DynamicList
      :items="menuItems"
      :layout="isMobile ? 'column' : 'grid'"
      :columns="isMobile ? 1 : 2"
      :padding="3"
      item-orientation="horizontal"
      background="bg-bnf-surface shadow-sm border border-bnf-border"
      clickable
      :show-arrow="!isMobile"
      @item-click="goToMenu"
    >
      <template #item="{ item }">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bnf-primary/5 shadow-md"
        >
          <img
            :src="(item as MenuItem).icon"
            :alt="(item as MenuItem).label"
            class="h-6 w-6 object-contain"
          />
        </div>
        <div class="flex min-w-0 items-center gap-2">
          <span class="truncate text-sm font-medium text-bnf-text">{{
            (item as MenuItem).label
          }}</span>
          <span
            v-if="(item as MenuItem).tag"
            class="shrink-0 rounded-md bg-bnf-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-bnf-primary"
            >{{ (item as MenuItem).tag }}</span
          >
        </div>
      </template>
    </DynamicList>
  </AppHeader>
</template>
