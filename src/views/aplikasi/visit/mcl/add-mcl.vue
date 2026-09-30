<route lang="yaml">
meta:
  title: Tambah MCL
</route>

<script setup lang="ts">
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import AdditionalInformation from '@/components/AdditionalInformation.vue'
import { Select, InputNumber } from 'primevue'
import { ref, computed, watch } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import FormCell from '@/components/FormCell.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import DynamicList from '@/components/DynamicList.vue'
import { formatRupiah } from '@/utils/formatter'
import { useIsMobile } from '@/composables/useIsMobile'
import { Form, FormField } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms'
import { visitorList, outlets } from '@/dummy/customerData'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { role } = storeToRefs(auth)

const isMobile = useIsMobile()

const tipeBadgeMap = {
  RS: { bg: '#dbeafe', text: '#1d4ed8' },
  Klinik: { bg: '#dcfce7', text: '#15803d' },
  Apotek: { bg: '#fce7f3', text: '#be185d' },
}

const shiftOptions = ['Pagi', 'Siang', 'Malam']

const columns = [
  { field: 'user', header: 'USER', slot: 'user', width: '10rem' },
  { field: 'jabatan', header: 'JABATAN', width: '9rem' },
  { field: 'outlet', header: 'OUTLET', width: '13rem' },
  { field: 'tipe', header: 'TIPE', type: 'badge' as const, badgeMap: tipeBadgeMap, width: '6rem' },
  { field: 'mr', header: 'MR', slot: 'number-mr', align: 'center' as const, width: '4rem' },
  { field: 'spv', header: 'SPV', slot: 'number-spv', align: 'center' as const, width: '4rem' },
  { field: 'dm', header: 'DM', slot: 'number-dm', align: 'center' as const, width: '4rem' },
  { field: 'shift', header: 'SHIFT', slot: 'shift', width: '8rem' },
  {
    field: 'salesUser',
    header: 'SALES USER (3 BLN)',
    align: 'right' as const,
    slot: 'currency-user',
    width: '9rem',
  },
  {
    field: 'salesOutlet',
    header: 'SALES OUTLET (3 BLN)',
    align: 'right' as const,
    slot: 'currency-outlet',
    width: '9rem',
  },
]

function handleBatal() {
  console.log('batal')
}

// function handleSimpanDraft() {
//   console.log('simpan draft', users.value)
// }

// function handleAjukan() {
//   console.log('ajukan', users.value)
// }

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
      ruleDate: ruleDate,
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

const visitorColumns = [
  { field: 'user', header: 'USER', slot: 'visitor-user', width: '10rem' },
  { field: 'outlet', header: 'OUTLET', width: '13rem' },
  { field: 'tipe', header: 'TIPE', type: 'badge' as const, badgeMap: tipeBadgeMap, width: '6rem' },
  { field: 'mr', header: 'MR', slot: 'visitor-mr', align: 'center' as const, width: '4rem' },
  { field: 'spv', header: 'SPV', slot: 'visitor-spv', align: 'center' as const, width: '4rem' },
  { field: 'dm', header: 'DM', slot: 'visitor-dm', align: 'center' as const, width: '4rem' },
  { field: 'shift', header: 'SHIFT', slot: 'visitor-shift', width: '7rem' },
  {
    field: 'salesUser',
    header: 'SALES USER',
    align: 'right' as const,
    slot: 'visitor-sales-user',
    width: '9rem',
  },
  {
    field: 'salesOutlet',
    header: 'SALES OUTLET',
    align: 'right' as const,
    slot: 'visitor-sales-outlet',
    width: '9rem',
  },
]

const handleSubmit = (event: FormSubmitEvent) => {
  console.log(event.values)
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
  <PageWrapper
    title="Tambah MCL"
    description="Pilih user yang akan diajukan ke dalam Master Call List untuk periode triwulan berjalan"
    max-width="max-w-8xl"
    class="pb-5"
  >
    <AdditionalInformation icon="pi pi-clock">
      <strong>Batas pengajuan: 2 minggu sebelum awal periode triwulan</strong>
    </AdditionalInformation>

    <div
      class="flex flex-col md:flex-row gap-5 md:gap-0 bg-white rounded-2xl p-5 shadow-sm mt-3 items-stretch"
    >
      <!-- Bagian Kiri (Isian 50%) -->
      <div class="flex flex-row gap-4 flex-1">
        <div class="flex flex-col flex-1">
          <label for="year" class="font-semibold text-slate-500 mb-1 text-[11.5px] md:text-[13px]"
            >Periode Tahun</label
          >
          <Select id="year" size="small" :options="years" v-model="selectedYear" class="w-full" />
        </div>

        <div class="flex flex-col flex-1">
          <label
            for="quarter"
            class="font-semibold text-slate-500 mb-1 text-[11.5px] md:text-[13px]"
            >Triwulan</label
          >
          <Select
            id="quarter"
            size="small"
            placeholder="Tidak ada triwulan..."
            :options="quarters"
            option-value="value"
            option-label="label"
            option-disabled="disabled"
            v-model="selectedQuarter"
            class="w-full"
          />
        </div>
      </div>

      <!-- Garis Pembatas (Hanya muncul di Desktop saat sejajar) -->
      <div class="hidden md:block w-[1px] bg-[#E8EDF3] mx-6 self-stretch"></div>

      <!-- Bagian Kanan (Tombol 50%) -->
      <div class="flex flex-col flex-1">
        <span
          class="text-[#475467] text-[11px] sm:text-[13px] uppercase sm:normal-case font-bold sm:font-semibold mb-1"
        >
          Lihat berdasarkan
        </span>
        <div class="flex rounded-lg bg-[#EEF0F4] md:p-1 h-full items-center">
          <button
            v-for="option in options"
            :key="option.value"
            @click="selected = option.value"
            :class="[
              'flex-1 rounded-md py-1.5 font-bold transition text-sm h-full',
              selected === option.value ? 'bg-[#0B1838] text-white shadow-sm' : 'text-[#475467]',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-row w-full gap-3 mt-3">
      <SearchInput
        v-model="search"
        placeholder="Cari nama user / outlet"
        variant="light"
        :h="38"
        rounded="lg"
      />
      <button
        class="flex items-center justify-center bg-[#1E88E5] w-[123px] h-[38px] rounded-xl text-white"
      >
        Search
      </button>
    </div>

    <SummaryCard />

    <Form @submit="handleSubmit" v-if="isMobile">
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
                v-if="item.hijau"
                class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-green-500"
              ></div>

              <span class="text-[15px] font-semibold text-[#0B1F3A]">
                {{ item.user }}
              </span>

              <span
                class="inline-flex items-center self-start rounded-lg bg-blue-50 px-3 py-1 text-[10.5px] font-semibold text-blue-800"
              >
                {{ item.role }}
              </span>
            </div>

            <hr class="my-2 w-full border-[#ECEEF3] my-3" />
            <div class="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4">
              <span class="text-[#64748B] text-sm">Outlet:</span>
              <span class="text-[13px] font-bold text-[#0B1F3A]">{{ item.outlet }}</span>

              <span class="text-[#64748B] text-sm">Tipe:</span>
              <span
                class="w-fit rounded-lg bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-800"
                >{{ item.tipe }}</span
              >
            </div>

            <hr class="my-2 w-full border-[#ECEEF3] my-3" />
            <div v-if="role === 'dm'" class="flex flex-row w-full justify-between">
              <FormField
                :name="`visits[${index}].mr`"
                :initialValue="item.detailVisit.mr"
                v-slot="$field"
                class="flex flex-col items-center gap-1"
              >
                <label :for="`mr-${index}`" class="text-[11px] text-[#64748B]">MR</label>
                <InputNumber
                  :id="`mr-${index}`"
                  v-bind="$field"
                  input-id="integeronly"
                  class="h-7.5 w-12.5"
                  input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>

              <FormField
                :name="`visits[${index}].spv`"
                :initialValue="item.detailVisit.spv"
                v-slot="$field"
                class="flex flex-col items-center gap-1"
              >
                <label :for="`spv-${index}`" class="text-[11px] text-[#64748B]">SPV</label>
                <InputNumber
                  :id="`spv-${index}`"
                  v-bind="$field"
                  input-id="integeronly"
                  class="h-7.5 w-12.5"
                  input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>

              <FormField
                :name="`visits[${index}].dm`"
                :initialValue="item.detailVisit.dm"
                v-slot="$field"
                class="flex flex-col items-center gap-1"
              >
                <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]">DM</label>
                <InputNumber
                  :id="`dm-${index}`"
                  v-bind="$field"
                  input-id="integeronly"
                  class="h-7.5 w-12.5"
                  input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>

              <FormField
                :name="`visits[${index}].shift`"
                :initialValue="item.detailVisit.shift"
                v-slot="$field"
                class="flex flex-col items-center gap-1"
              >
                <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]">SHIFT</label>
                <Select
                  :id="`shift-${index}`"
                  v-bind="$field"
                  :options="shiftOptions"
                  class="w-22.5 h-7.5"
                  :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                  input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>
            </div>

            <div v-if="role === 'sm'" class="flex flex-row w-full gap-3">
              <FormField
                :name="`visits[${index}].dm`"
                :initialValue="item.detailVisit.dm"
                v-slot="$field"
                class="flex flex-col flex-1 items-center gap-1"
              >
                <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]"
                  >TARGET VISIT SM</label
                >
                <InputNumber
                  :id="`dm-${index}`"
                  v-bind="$field"
                  input-id="integeronly"
                  class="h-7.5"
                  input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>

              <FormField
                :name="`visits[${index}].shift`"
                :initialValue="item.detailVisit.shift"
                v-slot="$field"
                class="flex flex-col flex-1 items-center gap-1"
              >
                <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]">SHIFT</label>
                <Select
                  :id="`shift-${index}`"
                  v-bind="$field"
                  :options="shiftOptions"
                  class="h-7.5 w-full"
                  :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                  input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                />
              </FormField>
            </div>

            <hr class="my-2 w-full border-[#ECEEF3] my-3" />
            <div class="flex flex-col gap-1 w-full">
              <div class="flex justify-between">
                <span class="text-[#64748B] font-medium">Sales User (3 Bln):</span>
                <span class="font-bold text-[#0B1F3A] text-[13px]">{{
                  item.salesUser ? formatRupiah(item.salesUser) : '-'
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#64748B] font-medium">Sales Outlet (3 Bln):</span>
                <span class="font-bold text-[#0B1F3A] text-[13px]">{{
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
        rounded=""
        :background="(_, index) => (index % 2 === 1 ? 'bg-[#FDF1E3]' : 'bg-[#EAF1FD]')"
        :padding="0"
      >
        <template #item="{ item, index }">
          <div class="flex flex-col w-full">
            <!-- Container utama slot untuk menata posisi elemen berjejer -->
            <div
              class="relative flex items-center w-full py-2 cursor-pointer"
              @click="toggleExpand(index)"
            >
              <!-- Garis samping kiri (Absolute Position) -->
              <div
                class="absolute left-0 top-0 bottom-0 w-[4px]"
                :class="index % 2 === 1 ? 'bg-[#FF6A00]' : 'bg-[#1A2456]'"
              ></div>

              <!-- Area Angka Index (Kiri) -->
              <div class="w-10 shrink-0 text-center ml-1">
                <span class="text-[#9CA3AF] font-bold text-[13px]">{{ index + 1 }}</span>
              </div>

              <!-- Area Teks Tengah (Mengisi sisa ruang dengan flex-1) -->
              <div class="flex flex-col flex-1 gap-1.5 ml-2">
                <!-- Judul Utama -->
                <span class="text-[#0B1F3F] font-extrabold text-[15px] leading-none tracking-tight">
                  {{ item.name }}
                </span>

                <!-- Area Badge dan Sub-teks -->
                <div class="flex items-center gap-2">
                  <!-- Badge Label ("RS") -->
                  <span
                    class="bg-[#EEF1F5] border border-gray-200 text-[#0B1F3F] font-bold text-sm px-1.5 py-0.5 rounded-md"
                  >
                    {{ item.type }}
                  </span>
                  <!-- Teks Keterangan Tambahan -->
                  <span class="text-[#98A2B3] text-[12px] font-semibold">
                    {{ item.visitor.length }} user terkait
                  </span>
                </div>
              </div>

              <div class="px-4 text-gray-500">
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
            </div>

            <div
              class="flex flex-col w-full bg-[#F8F9FA] pb-4"
              :class="expandedIndexes.includes(index) ? 'block' : 'hidden'"
            >
              <!-- Garis putus-putus pembatas -->
              <div class="border-t border-dashed border-gray-300 w-full mb-3"></div>

              <!-- Label Judul -->
              <div
                class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-4 mb-3"
              >
                User PIC Outlet Ini
              </div>

              <!-- Nested List Container -->
              <div class="px-4">
                <DynamicList :items="item.visitor" layout="column" :gap="4" :show-arrow="false">
                  <template #item="{ item: visitor, index }">
                    <div class="relative w-full">
                      <div class="flex w-full flex-col">
                        <div
                          v-if="visitor.hijau"
                          class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-green-500"
                        ></div>

                        <span class="text-[15px] font-semibold text-[#0B1F3A]">
                          {{ visitor.user }}
                        </span>

                        <span
                          class="inline-flex items-center self-start rounded-lg bg-blue-50 px-3 py-1 text-[10.5px] font-semibold text-blue-800"
                        >
                          {{ visitor.role }}
                        </span>
                      </div>

                      <hr class="my-2 w-full border-[#ECEEF3] my-3" />
                      <div v-if="role === 'dm'" class="flex flex-row w-full justify-between">
                        <FormField
                          :name="`visits[${index}].mr`"
                          :initialValue="visitor.detailVisit.mr"
                          v-slot="$field"
                          class="flex flex-col items-center gap-1"
                        >
                          <label :for="`mr-${index}`" class="text-[11px] text-[#64748B]">MR</label>
                          <InputNumber
                            :id="`mr-${index}`"
                            v-bind="$field"
                            input-id="integeronly"
                            class="h-7.5 w-12.5"
                            input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>

                        <FormField
                          :name="`visits[${index}].spv`"
                          :initialValue="visitor.detailVisit.spv"
                          v-slot="$field"
                          class="flex flex-col items-center gap-1"
                        >
                          <label :for="`spv-${index}`" class="text-[11px] text-[#64748B]"
                            >SPV</label
                          >
                          <InputNumber
                            :id="`spv-${index}`"
                            v-bind="$field"
                            input-id="integeronly"
                            class="h-7.5 w-12.5"
                            input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>

                        <FormField
                          :name="`visits[${index}].dm`"
                          :initialValue="visitor.detailVisit.dm"
                          v-slot="$field"
                          class="flex flex-col items-center gap-1"
                        >
                          <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]">DM</label>
                          <InputNumber
                            :id="`dm-${index}`"
                            v-bind="$field"
                            input-id="integeronly"
                            class="h-7.5 w-12.5"
                            input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>

                        <FormField
                          :name="`visits[${index}].shift`"
                          :initialValue="visitor.detailVisit.shift"
                          v-slot="$field"
                          class="flex flex-col items-center gap-1"
                        >
                          <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]"
                            >SHIFT</label
                          >
                          <Select
                            :id="`shift-${index}`"
                            v-bind="$field"
                            :options="shiftOptions"
                            class="w-22.5 h-7.5"
                            :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                            input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>
                      </div>
                      <div v-if="role === 'sm'" class="flex flex-row w-full gap-3">
                        <FormField
                          :name="`visits[${index}].dm`"
                          :initialValue="visitor.detailVisit.dm"
                          v-slot="$field"
                          class="flex flex-col flex-1 items-center gap-1"
                        >
                          <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]"
                            >TARGET VISIT SM</label
                          >
                          <InputNumber
                            :id="`dm-${index}`"
                            v-bind="$field"
                            input-id="integeronly"
                            class="h-7.5"
                            input-class="w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>

                        <FormField
                          :name="`visits[${index}].shift`"
                          :initialValue="visitor.detailVisit.shift"
                          v-slot="$field"
                          class="flex flex-col flex-1 items-center gap-1"
                        >
                          <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]"
                            >SHIFT</label
                          >
                          <Select
                            :id="`shift-${index}`"
                            v-bind="$field"
                            :options="shiftOptions"
                            class="h-7.5 w-full"
                            :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                            input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </FormField>
                      </div>

                      <hr class="my-2 w-full border-[#ECEEF3] my-3" />
                      <div class="flex flex-col gap-1 w-full">
                        <div class="flex justify-between">
                          <span class="text-[#64748B] font-medium">Sales User (3 Bln):</span>
                          <span class="font-bold text-[#0B1F3A] text-[13px]">{{
                            visitor.salesUser ? formatRupiah(visitor.salesUser) : '-'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-[#64748B] font-medium">Sales Outlet (3 Bln):</span>
                          <span class="font-bold text-[#0B1F3A] text-[13px]">{{
                            formatRupiah(visitor.salesOutlet)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </DynamicList>
              </div>
            </div>
          </div>
        </template>
      </DynamicList>

      <div
        class="fixed bottom-16 left-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-4 flex justify-center items-center gap-2 sm:gap-4 z-40"
      >
        <button
          type="button"
          class="h-[42px] flex-1 max-w-[125px] text-[13px] sm:text-[14px] bg-white border border-gray-300 text-gray-500 font-semibold rounded-lg hover:bg-gray-50 transition-all"
        >
          Batal
        </button>

        <button
          type="submit"
          class="h-[42px] flex-1 max-w-[125px] text-[13px] sm:text-[14px] bg-white border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-all leading-tight px-1"
        >
          Simpan Draft
        </button>

        <button
          type="submit"
          class="h-[42px] flex-1 max-w-[125px] text-[13px] sm:text-[14px] bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-sm"
        >
          Ajukan
        </button>
      </div>
    </Form>
    <!-- 
    <CustomDataTable v-else :data="visitorList" :columns="visitorColumns" :show-actions="false">
      <template #visitor-user="{data}">
        <div class="flex items-center gap-2">
          <span v-if="data.hijau" class=""></span>
        </div>
      </template>
    </CustomDataTable> -->
  </PageWrapper>
</template>
