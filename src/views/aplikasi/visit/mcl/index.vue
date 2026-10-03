<route lang="yaml">
meta:
  title: MCL
</route>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import DynamicList from '@/components/DynamicList.vue'
import * as Filter from '@/components/Filter'
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const { role } = storeToRefs(useAuthStore())

const canManage = computed((): boolean => ['dm', 'sm'].includes(role.value))

type MclStatus = 'draft' | 'menunggu_approval' | 'disetujui'
type FilterKey = MclStatus | null

interface MclItem {
  id: number
  triwulan: string
  periode: string
  userCount: number
  userTotal: number
  outletCount: number
  outletTotal: number
  status: MclStatus
  updatedAt: string
}

//dummy
const items = ref<MclItem[]>([
  {
    id: 1,
    triwulan: 'Triwulan II 2026',
    periode: 'Apr - Jun 2026',
    userCount: 23,
    userTotal: 50,
    outletCount: 18,
    outletTotal: 50,
    status: 'draft',
    updatedAt: 'Disimpan 12 Mar 2026, 14.20 WIB',
  },
  {
    id: 2,
    triwulan: 'Triwulan I 2026',
    periode: 'Jan - Mar 2026',
    userCount: 23,
    userTotal: 50,
    outletCount: 18,
    outletTotal: 50,
    status: 'menunggu_approval',
    updatedAt: 'Diajukan 15 Des 2025, 09.05 WIB',
  },
  {
    id: 3,
    triwulan: 'Triwulan IV 2025',
    periode: 'Okt - Des 2025',
    userCount: 47,
    userTotal: 50,
    outletCount: 50,
    outletTotal: 50,
    status: 'disetujui',
    updatedAt: 'Disetujui SM, 30 Sep 2025, 11.30 WIB',
  },
  {
    id: 4,
    triwulan: 'Triwulan III 2025',
    periode: 'Jul - Sep 2025',
    userCount: 47,
    userTotal: 50,
    outletCount: 50,
    outletTotal: 50,
    status: 'disetujui',
    updatedAt: 'Disetujui SM, 30 Jun 2025, 11.30 WIB',
  },
  {
    id: 5,
    triwulan: 'Triwulan II 2025',
    periode: 'Apr - Jun 2025',
    userCount: 47,
    userTotal: 50,
    outletCount: 50,
    outletTotal: 50,
    status: 'disetujui',
    updatedAt: 'Disetujui SM, 30 Mar 2025, 11.30 WIB',
  },
])

const statusMeta: Record<MclStatus, { label: string; dot: string; badge: string }> = {
  draft: { label: 'Draft', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  menunggu_approval: {
    label: 'Menunggu Approval',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
  },
  disetujui: {
    label: 'Disetujui',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
}

const statusTabDefs = [
  { label: 'Semua', value: null, activeColor: '#0a1e42' },
  {
    label: 'Draft',
    value: 'draft',
    color: '#fbbf24',
    activeColor: '#0a1e42',
    compute: (data: unknown[]) => data.filter((i) => (i as MclItem).status === 'draft').length,
  },
  {
    label: 'Menunggu Approval',
    value: 'menunggu_approval',
    color: '#f97316',
    activeColor: '#0a1e42',
    compute: (data: unknown[]) =>
      data.filter((i) => (i as MclItem).status === 'menunggu_approval').length,
  },
  {
    label: 'Disetujui',
    value: 'disetujui',
    color: '#10b981',
    activeColor: '#0a1e42',
    compute: (data: unknown[]) => data.filter((i) => (i as MclItem).status === 'disetujui').length,
  },
]

const activeFilter = ref<FilterKey>(null)

//Mr hanya lihat yg disetujui
const baseItems = computed((): MclItem[] =>
  canManage.value ? items.value : items.value.filter((i) => i.status === 'disetujui'),
)

const filteredItems = computed((): MclItem[] => {
  if (!canManage.value) {
    return baseItems.value
  }
  if (activeFilter.value === null) {
    return baseItems.value
  }
  return baseItems.value.filter((i) => i.status === activeFilter.value)
})

function handleItemClick(item: unknown) {
  const mcl = item as MclItem
  router.push({
    path: `/aplikasi/visit/mcl/${mcl.id}`,
    query: { status: mcl.status, triwulan: mcl.triwulan },
  }) //route detailnya atur disini
}

function handleCreateNew() {
  router.push('/aplikasi/visit/mcl/add-mcl')
}
</script>

<template>
  <PageWrapper
    title="MCL - Master Call List"
    description="Lihat MCL yang sudah diajukan"
    max-width="max-w-8xl"
  >
    <button
      v-if="canManage"
      type="button"
      class="flex w-fit min-w-[200px] items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      @click="handleCreateNew"
    >
      <span class="text-lg leading-none">+</span>
      Buat Pengajuan Baru
    </button>

    <div class="mt-6">
      <p class="mb-3 text-sm font-semibold text-gray-700">List MCL</p>

      <Filter.Tabs
        v-if="canManage"
        v-model="activeFilter"
        :tabs="statusTabDefs"
        :data="baseItems"
        class="mb-4"
      />

      <DynamicList
        :items="filteredItems"
        layout="column"
        :gap="3"
        :padding="4"
        clickable
        show-arrow
        paginate
        :page-size="3"
        @item-click="handleItemClick"
      >
        <template #item="{ item }">
          <div class="flex w-full items-center justify-between gap-1.5 text-left">
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-1.5">
                <span class="whitespace-nowrap text-sm font-semibold !text-gray-900 sm:text-base">{{
                  (item as any).triwulan
                }}</span>
                <span class="whitespace-nowrap text-[11px] text-gray-400 sm:text-xs">{{
                  (item as any).periode
                }}</span>
              </div>
              <p class="mt-1 whitespace-nowrap text-xs text-gray-500 sm:text-sm">
                {{ (item as any).userCount }}/{{ (item as any).userTotal }} User ·
                {{ (item as any).outletCount }}/{{ (item as any).outletTotal }} Outlet
              </p>
              <p class="mt-0.5 whitespace-nowrap text-[11px] text-gray-400 sm:text-xs">
                {{ (item as any).updatedAt }}
              </p>
            </div>
            <span
              class="shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium sm:px-3 sm:py-1 sm:text-xs"
              :class="statusMeta[(item as any).status as MclStatus].badge"
            >
              {{ statusMeta[(item as any).status as MclStatus].label }}
            </span>
          </div>
        </template>
      </DynamicList>
    </div>
  </PageWrapper>
</template>
