<script setup lang="ts">
import { Button, Select } from '@bernofarm/core'
import { Clock01Icon } from '@hugeicons/core-free-icons'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

import { useAuthStore } from '@/features/auth/stores/authStore'
import CellInput from '@/features/visits/master-call-list/components/CellInput.vue'
import MasterCallListTable from '@/features/visits/master-call-list/components/MasterCallListTable.vue'
import MclPeriodFilter from '@/features/visits/master-call-list/components/MclPeriodFilter.vue'
import SummaryCard from '@/features/visits/master-call-list/components/SummaryCard.vue'
import AdditionalInformation from '@/shared/components/AdditionalInformation.vue'
import DynamicList from '@/shared/components/DynamicList.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import SearchInput from '@/shared/components/SearchInput.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { outlets, type Visitor, visitorList } from '@/shared/mocks/customerData'
import { formatRupiah } from '@/shared/utils/formatter'

const auth = useAuthStore()
const { role } = storeToRefs(auth)

const isMobile = useIsMobile()

const loading = ref(false)

const targetVisits = computed(() => [
  ...(role.value === 'dm'
    ? [
        { detail: 'MR', value: 12 },
        { detail: 'SPV', value: 4 },
        { detail: 'DM', value: 4 },
      ]
    : [{ detail: 'SM', value: 12 }]
  ).map((item) => ({
    ...item,
    detail: `TARGET VISIT ${item.detail}`, // Menimpa 'MR' menjadi 'Target Visit MR', dsb.
  })),

  { detail: 'SIANG / MALAM', value: 1 },

  ...(role.value === 'dm'
    ? [
        { detail: 'TOTAL USER', value: 7 },
        { detail: 'TOTAL OUTLET', value: 3 },
      ]
    : [{ detail: 'USER / OUTLET', value: '7/3' }]),
])

const shiftOptions = ['Siang', 'Malam']

const currentYear = new Date().getFullYear()

const years = (() => {
  const addYear = 5
  return Array.from({ length: addYear }, (_, i) => currentYear + i)
})()

const selectedQuarter = ref()

const selectedYear = ref<number>(currentYear)

const quarters = computed(() => {
  const today = new Date()
  const year = selectedYear.value // Pastikan selectedYear adalah ref() atau reactive

  const baseQuarters = [
    { label: 'Triwulan I (Jan-Mar)', value: 1, startMonth: 0 }, // startMonth: 0 = Januari
    { label: 'Triwulan II (Apr-Jun)', value: 2, startMonth: 3 }, // startMonth: 3 = April
    { label: 'Triwulan III (Jul-Sep)', value: 3, startMonth: 6 }, // startMonth: 6 = Juli
    { label: 'Triwulan IV (Okt-Des)', value: 4, startMonth: 9 }, // startMonth: 9 = Oktober
  ]

  return baseQuarters.map((q) => {
    // 1. Tentukan tanggal mulai quarter (Tanggal 1 di bulan dimulainya quarter)
    const startDate = new Date(year, q.startMonth, 1)

    // 2. Hitung tanggal aturan "2 minggu (14 hari) sebelum dimulainya quarter"
    const ruleDate = new Date(startDate)
    ruleDate.setDate(startDate.getDate() - 14)

    // 3. Tentukan apakah status pengajuan valid (disabled: false)
    // Asumsi: Pengajuan HANYA BISA dilakukan MAKSIMAL 2 minggu sebelum quarter mulai.
    // Jika maksudnya "baru dibuka 2 minggu sebelum", ubah operator menjadi: today >= ruleDate
    const isEligible = today <= ruleDate

    return {
      label: q.label,
      value: q.value,
      disabled: !isEligible,
      // Opsional: Anda bisa menyimpan tanggal batas untuk ditampilkan di UI
      ruleDate,
    }
  })
})

watch(
  selectedYear,
  () => {
    // Cari quarter pertama yang 'isDisabled'-nya false
    const firstAvailableQuarter = quarters.value.find((q) => !q.disabled)

    if (firstAvailableQuarter) {
      // Jika ada yang buka, otomatis pilih itu
      selectedQuarter.value = firstAvailableQuarter.value
    } else {
      // Jika di tahun tersebut semua quarter sudah ditutup (misal tahun lalu)
      selectedQuarter.value = null
    }
  },
  { immediate: true },
)

const selected = ref('user')

const options = [
  { label: 'User', value: 'user' },
  { label: 'Outlet', value: 'outlet' },
]

const search = ref('')

const handleSubmit = () => {
  return undefined
}

function updateMclCell({ row, key, value }: { row: unknown; key: string; value: unknown }) {
  if (row && typeof row === 'object') {
    Object.assign(row, { [key]: value })
  }
}

const salesData = ref<Visitor[]>([])

onMounted(() => {
  // PROSES TRANSFORMASI DATA (Flattening)
  salesData.value = outlets.flatMap((outlet) => {
    return outlet.visitor.map((visitor) => {
      // Menggabungkan data outlet dengan data visitor per baris
      return {
        outlet: outlet.name,
        tipe: outlet.type,
        uniqueTipe: outlet.type + outlet.name, // Untuk menghindari duplikasi badge tipe di group rows
        ...visitor, // Memasukkan user, jabatan, mr, dll
      }
    })
  })
})
</script>

<template>
  <AppHeader
    title="Tambah MCL"
    subtitle="Pilih user yang akan diajukan ke dalam Master Call List untuk periode triwulan berjalan"
    max-width="max-w-8xl"
    class="pb-bnf-xl"
  >
    <AdditionalInformation :icon="Clock01Icon">
      <strong>Batas pengajuan: 2 minggu sebelum awal periode triwulan</strong>
    </AdditionalInformation>

    <MclPeriodFilter
      v-model:year="selectedYear"
      v-model:quarter="selectedQuarter"
      v-model:view="selected"
      :year-options="years"
      :quarter-options="quarters"
      :view-options="options"
      quarter-placeholder="Tidak ada triwulan..."
      class="mt-bnf-md"
    />

    <div class="mt-bnf-md flex w-full flex-row gap-bnf-md">
      <SearchInput
        v-model="search"
        placeholder="Cari nama user / outlet"
        variant="light"
        :h="38"
        rounded="lg"
      />
      <Button label="Search" severity="info" size="small" class="h-9.5 w-30.75" />
    </div>

    <SummaryCard :summaries="targetVisits" />

    <form @submit.prevent="handleSubmit">
      <div v-if="isMobile">
        <DynamicList
          v-if="selected === 'user'"
          :items="visitorList"
          layout="column"
          :gap="4"
          :show-arrow="false"
        >
          <template #item="{ item, index }">
            <div class="relative w-full">
              <div class="flex w-full flex-col">
                <div
                  v-if="item.aktif"
                  class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-bnf-success"
                ></div>

                <span class="text-[15px] font-semibold text-bnf-text">
                  {{ item.user }}
                </span>

                <span
                  class="inline-flex items-center self-start rounded-bnf-md bg-bnf-primary/5 px-bnf-md py-bnf-xs text-[10.5px] font-semibold text-bnf-primary"
                >
                  {{ item.jabatan }}
                </span>
              </div>

              <hr class="my-bnf-md w-full border-bnf-border" />
              <div class="grid grid-cols-[80px_1fr] gap-x-bnf-lg gap-y-bnf-sm">
                <span class="text-bnf-text-muted text-sm">Outlet:</span>
                <span class="text-[13px] font-bold text-bnf-text">{{ item.outlet }}</span>

                <span class="text-bnf-text-muted text-sm">Tipe:</span>
                <span
                  class="w-fit rounded-bnf-md bg-bnf-primary/5 px-bnf-md py-bnf-xs text-[11px] font-semibold text-bnf-primary"
                  >{{ item.tipe }}</span
                >
              </div>

              <hr class="my-bnf-md w-full border-bnf-border" />
              <div v-if="role === 'dm'" class="grid w-full grid-cols-[1fr_1fr_1fr_2fr] gap-4">
                <div class="flex flex-col items-center gap-bnf-xs">
                  <label :for="`mr-${index}`" class="text-[11px] text-bnf-text-muted">MR</label>
                  <CellInput
                    :id="`mr-${index}`"
                    v-model="item.mr"
                    type="number"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-bnf-xs">
                  <label :for="`spv-${index}`" class="text-[11px] text-bnf-text-muted">SPV</label>
                  <CellInput
                    :id="`spv-${index}`"
                    v-model="item.spv"
                    type="number"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-bnf-xs">
                  <label :for="`dm-${index}`" class="text-[11px] text-bnf-text-muted">DM</label>
                  <CellInput
                    :id="`dm-${index}`"
                    v-model="item.dm"
                    type="number"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-bnf-xs">
                  <label :for="`shift-${index}`" class="text-[11px] text-bnf-text-muted"
                    >SHIFT</label
                  >
                  <Select
                    :id="`shift-${index}`"
                    v-model="item.shift"
                    :options="shiftOptions"
                    class="w-full"
                    size="small"
                    input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-bnf-text"
                  />
                </div>
              </div>

              <div v-if="role === 'sm'" class="flex w-full flex-row gap-bnf-md">
                <div class="flex flex-1 flex-col items-center gap-bnf-xs">
                  <label :for="`dm-${index}`" class="text-[11px] text-bnf-text-muted"
                    >TARGET VISIT SM</label
                  >
                  <CellInput
                    :id="`sm-${index}`"
                    v-model="item.dm"
                    type="number"
                    width="w-full"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-1 flex-col items-center gap-bnf-xs">
                  <label :for="`shift-${index}`" class="text-[11px] text-bnf-text-muted"
                    >SHIFT</label
                  >
                  <Select
                    :id="`shift-${index}`"
                    v-model="item.shift"
                    :options="shiftOptions"
                    class="w-full"
                    size="small"
                    input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-bnf-text"
                  />
                </div>
              </div>

              <hr class="my-bnf-md w-full border-bnf-border" />
              <div class="flex w-full flex-col gap-bnf-xs">
                <div class="flex justify-between">
                  <span class="text-bnf-text-muted font-medium">Sales User (3 Bln):</span>
                  <span class="font-bold text-bnf-text text-[13px]">{{
                    item.salesUser ? formatRupiah(item.salesUser) : '-'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-bnf-text-muted font-medium">Sales Outlet (3 Bln):</span>
                  <span class="font-bold text-bnf-text text-[13px]">{{
                    formatRupiah(item.salesOutlet)
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </DynamicList>

        <DynamicList
          v-else
          :items="outlets"
          layout="column"
          :gap="4"
          :show-arrow="false"
          :is-expanded="true"
          rounded=""
          :background="(_, index) => (index % 2 === 1 ? 'bg-bnf-warning/10' : 'bg-bnf-primary/5')"
          :padding="0"
        >
          <template #item="{ item, index }">
            <!-- Container utama slot untuk menata posisi elemen berjejer -->
            <div class="relative flex w-full cursor-pointer items-center py-bnf-sm">
              <!-- Garis samping kiri (Absolute Position) -->
              <div
                class="absolute left-0 top-0 bottom-0 w-1"
                :class="index % 2 === 1 ? 'bg-(--bnf-color-accent)' : 'bg-bnf-text'"
              ></div>

              <!-- Area Angka Index (Kiri) -->
              <div class="ml-bnf-xs w-10 shrink-0 text-center">
                <span class="text-bnf-text-muted font-bold text-[13px]">{{ index + 1 }}</span>
              </div>

              <!-- Area Teks Tengah (Mengisi sisa ruang dengan flex-1) -->
              <div class="ml-bnf-sm flex flex-1 flex-col gap-bnf-sm">
                <!-- Judul Utama -->
                <span class="text-bnf-text font-extrabold text-[15px] leading-none tracking-tight">
                  {{ item.name }}
                </span>

                <!-- Area Badge dan Sub-teks -->
                <div class="flex items-center gap-bnf-sm">
                  <!-- Badge Label ("RS") -->
                  <span
                    class="rounded-bnf-sm border border-bnf-border bg-bnf-surface-muted px-bnf-sm py-bnf-xs text-sm font-bold text-bnf-text"
                  >
                    {{ item.type }}
                  </span>
                  <!-- Teks Keterangan Tambahan -->
                  <span class="text-bnf-text-muted text-[12px] font-semibold">
                    {{ item.visitor.length }} user terkait
                  </span>
                </div>
              </div>
            </div>
          </template>

          <template #expanded="{ item }">
            <div class="flex flex-col w-full bg-bnf-surface-muted pb-4">
              <!-- Garis putus-putus pembatas -->
              <div class="mb-bnf-md w-full border-t border-dashed border-bnf-border"></div>

              <!-- Label Judul -->
              <div
                class="mb-bnf-md px-bnf-lg text-[10px] font-extrabold uppercase tracking-wider text-bnf-text-muted"
              >
                User PIC Outlet Ini
              </div>

              <!-- Nested List Container -->
              <div class="px-bnf-lg">
                <DynamicList :items="item.visitor" layout="column" :gap="4" :show-arrow="false">
                  <template #item="{ item: visitor, index }">
                    <div class="relative w-full">
                      <div class="flex w-full flex-col">
                        <div
                          v-if="visitor.aktif"
                          class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-bnf-success"
                        ></div>

                        <span class="text-[15px] font-semibold text-bnf-text">
                          {{ visitor.user }}
                        </span>

                        <span
                          class="inline-flex items-center self-start rounded-bnf-md bg-bnf-primary/5 px-bnf-md py-bnf-xs text-[10.5px] font-semibold text-bnf-primary"
                        >
                          {{ visitor.jabatan }}
                        </span>
                      </div>

                      <hr class="my-bnf-md w-full border-bnf-border" />
                      <div
                        v-if="role === 'dm'"
                        class="grid w-full grid-cols-[1fr_1fr_1fr_2fr] gap-4"
                      >
                        <div class="flex flex-col items-center gap-bnf-xs">
                          <label :for="`mr-${index}`" class="text-[11px] text-bnf-text-muted"
                            >MR</label
                          >
                          <CellInput
                            :id="`mr-${index}`"
                            v-model="visitor.mr"
                            type="number"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-bnf-xs">
                          <label :for="`spv-${index}`" class="text-[11px] text-bnf-text-muted"
                            >SPV</label
                          >
                          <CellInput
                            :id="`spv-${index}`"
                            v-model="visitor.spv"
                            type="number"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-bnf-xs">
                          <label :for="`dm-${index}`" class="text-[11px] text-bnf-text-muted"
                            >DM</label
                          >
                          <CellInput
                            :id="`dm-${index}`"
                            v-model="visitor.dm"
                            type="number"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-bnf-xs">
                          <label :for="`shift-${index}`" class="text-[11px] text-bnf-text-muted"
                            >SHIFT</label
                          >
                          <Select
                            :id="`shift-${index}`"
                            v-model="visitor.shift"
                            :options="shiftOptions"
                            class="w-full"
                            size="small"
                            input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-bnf-text"
                          />
                        </div>
                      </div>
                      <div v-if="role === 'sm'" class="flex w-full flex-row gap-bnf-md">
                        <div class="flex flex-1 flex-col items-center gap-bnf-xs">
                          <label :for="`dm-${index}`" class="text-[11px] text-bnf-text-muted"
                            >TARGET VISIT SM</label
                          >
                          <CellInput
                            :id="`sm-${index}`"
                            v-model="visitor.dm"
                            type="number"
                            width="w-full"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-1 flex-col items-center gap-bnf-xs">
                          <label :for="`shift-${index}`" class="text-[11px] text-bnf-text-muted"
                            >SHIFT</label
                          >
                          <Select
                            :id="`shift-${index}`"
                            v-model="visitor.shift"
                            :options="shiftOptions"
                            class="w-full"
                            size="small"
                            input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-bnf-text"
                          />
                        </div>
                      </div>

                      <hr class="my-bnf-md w-full border-bnf-border" />
                      <div class="flex w-full flex-col gap-bnf-xs">
                        <div class="flex justify-between">
                          <span class="text-bnf-text-muted font-medium">Sales User (3 Bln):</span>
                          <span class="font-bold text-bnf-text text-[13px]">{{
                            visitor.salesUser ? formatRupiah(visitor.salesUser) : '-'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-bnf-text-muted font-medium">Sales Outlet (3 Bln):</span>
                          <span class="font-bold text-bnf-text text-[13px]">{{
                            formatRupiah(visitor.salesOutlet)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </DynamicList>
              </div>
            </div>
          </template>
        </DynamicList>
      </div>

      <MasterCallListTable
        v-else
        :data="selected === 'user' ? visitorList : salesData"
        :selected="selected"
        :role="role"
        :rows="10"
        :loading="loading"
        @change="updateMclCell"
      />

      <div
        class="fixed bottom-16 left-0 z-40 flex w-full items-center justify-center gap-bnf-sm border-t border-bnf-border bg-bnf-surface/90 px-bnf-lg py-bnf-lg backdrop-blur-sm lg:static lg:justify-end lg:gap-bnf-lg lg:border-transparent lg:bg-transparent lg:backdrop-blur-none"
      >
        <Button
          type="button"
          label="Batal"
          severity="secondary"
          outlined
          size="small"
          class="h-10.5 max-w-31.25 flex-1 text-[13px] sm:text-[14px]"
        />

        <Button
          type="submit"
          label="Simpan Draft"
          severity="primary"
          outlined
          size="small"
          class="h-10.5 max-w-31.25 flex-1 px-1 text-[13px] leading-tight sm:text-[14px]"
        />

        <Button
          type="submit"
          label="Ajukan"
          severity="primary"
          size="small"
          class="h-10.5 max-w-31.25 flex-1 text-[13px] shadow-bnf-sm sm:text-[14px]"
        />
      </div>
    </form>
  </AppHeader>
</template>
