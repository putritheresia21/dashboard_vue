<script setup lang="ts">
import { Button, Card, Tag } from '@bernofarm/core'
import { Add01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/features/auth/stores/authStore'
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import * as Filter from '@/shared/forms/Filter'
import { colorTokens } from '@/shared/utils/colors'

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

// mock data
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

// Warna badge status berasal dari varian soft Tag (token theme).
const statusMeta: Record<MclStatus, { label: string; severity: string }> = {
  draft: { label: 'Draft', severity: 'secondary' },
  menunggu_approval: { label: 'Menunggu Approval', severity: 'warn' },
  disetujui: { label: 'Disetujui', severity: 'success' },
}

const statusTabDefs = [
  { label: 'Semua', value: null, activeColor: colorTokens.brandBlue },
  {
    label: 'Draft',
    value: 'draft',
    color: colorTokens.neutral,
    activeColor: colorTokens.brandBlue,
    compute: (data: unknown[]) => data.filter((i) => (i as MclItem).status === 'draft').length,
  },
  {
    label: 'Menunggu Approval',
    value: 'menunggu_approval',
    color: colorTokens.warning,
    activeColor: colorTokens.brandBlue,
    compute: (data: unknown[]) =>
      data.filter((i) => (i as MclItem).status === 'menunggu_approval').length,
  },
  {
    label: 'Disetujui',
    value: 'disetujui',
    color: colorTokens.success,
    activeColor: colorTokens.brandBlue,
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
    path: `/app/visits/master-call-list/${mcl.id}`,
    query: { status: mcl.status, triwulan: mcl.triwulan },
  }) //route detailnya atur disini
}

function handleCreateNew() {
  router.push('/app/visit/master-call-list/add-master-call-list')
}
</script>

<template>
  <AppHeader
    title="MCL - Master Call List"
    subtitle="Lihat MCL yang sudah diajukan"
    max-width="max-w-8xl"
  >
    <Button
      v-if="canManage"
      label="Buat Pengajuan Baru"
      severity="primary"
      class="w-fit min-w-50 self-start"
      @click="handleCreateNew"
    >
      <template #icon>
        <HugeiconsIcon :icon="Add01Icon" :size="16" :stroke-width="1.8" />
      </template>
    </Button>

    <div class="mt-6">
      <p class="mb-3 text-sm font-semibold text-bnf-text">List MCL</p>

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
        :padding="0"
        background="bg-transparent"
        rounded="rounded-none"
        clickable
        :show-arrow="false"
        paginate
        :page-size="3"
        @item-click="handleItemClick"
      >
        <template #item="{ item }">
          <Card
            class="flex w-full items-center justify-between gap-2 p-4 text-left transition-shadow hover:shadow-bnf-md"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-1.5">
                <span class="whitespace-nowrap text-sm font-semibold text-bnf-text sm:text-base">
                  {{ item.triwulan }}
                </span>
                <span class="whitespace-nowrap text-[11px] text-bnf-text-muted sm:text-xs">
                  {{ item.periode }}
                </span>
              </div>
              <p class="mt-1 whitespace-nowrap text-xs text-bnf-text-muted sm:text-sm">
                {{ item.userCount }}/{{ item.userTotal }} User · {{ item.outletCount }}/{{
                  item.outletTotal
                }}
                Outlet
              </p>
              <p class="mt-0.5 whitespace-nowrap text-[11px] text-bnf-text-muted sm:text-xs">
                {{ item.updatedAt }}
              </p>
            </div>

            <Tag
              :severity="statusMeta[item.status].severity"
              variant="soft"
              rounded
              class="shrink-0 whitespace-nowrap px-1.5 py-0 text-[9px] leading-4 sm:px-3 sm:py-0.5 sm:text-xs sm:leading-5"
            >
              {{ statusMeta[item.status].label }}
            </Tag>

            <HugeiconsIcon
              :icon="ArrowRight01Icon"
              :size="14"
              :stroke-width="1.8"
              class="shrink-0 text-bnf-text-muted"
            />
          </Card>
        </template>
      </DynamicList>
    </div>
  </AppHeader>
</template>
