<route lang="yaml">
meta:
  title: Tambah MCL
</route>

<script setup lang="ts">
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import AdditionalInformation from '@/components/AdditionalInformation.vue'
import { Select } from 'primevue'
import { ref, computed, watch, onMounted } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import CellInput from '@/components/cells/CellInput.vue'
import CellSelect from '@/components/cells/CellSelect.vue'
import DynamicList from '@/components/DynamicList.vue'
import { formatRupiah } from '@/utils/formatter'
import { useIsMobile } from '@/composables/useIsMobile'
import { visitorList, outlets } from '@/dummy/customerData'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import * as Filter from '@/components/Filter'

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

const tipeBadgeMap = {
  RS: { bg: '#dbeafe', text: '#1d4ed8' },
  Klinik: { bg: '#dcfce7', text: '#15803d' },
  Apotek: { bg: '#fce7f3', text: '#be185d' },
}

const shiftOptions = ['Siang', 'Malam']

const tipeMap = {
  RS: { bg: '#e3e9fb', text: '#2f4ea8' },
  Klinik: { bg: '#d9f3ea', text: '#0f7a57' },
  Apotek: { bg: '#fde3ea', text: '#c81e4d' },
}

const userColumns = [
  { field: 'user', header: 'User', width: '11rem' },
  {
    field: 'aktif',
    header: '',
    type: 'dot',
    width: '2rem',
    dotColor: (r: any) => (r.aktif ? '#16a34a' : null),
  },
  { field: 'jabatan', header: 'Jabatan', type: 'badge', width: '10rem' },
  { field: 'outlet', header: 'Outlet' },
  { field: 'tipe', header: 'Tipe', type: 'badge', badgeMap: tipeMap, width: '5rem' },
  ...(role.value === 'dm'
    ? [
        {
          field: 'mr',
          header: 'MR',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
        {
          field: 'spv',
          header: 'SPV',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
        {
          field: 'dm',
          header: 'DM',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
      ]
    : [
        {
          field: 'dm',
          header: 'SM',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
      ]),
  {
    field: 'shift',
    header: 'Shift',
    type: 'select',
    boxed: true,
    editable: true,
    options: ['Siang', 'Malam'],
    width: '9rem',
  },
  { field: 'salesUser', header: 'Sales User\n(3 bln)', align: 'right', width: '10rem' },
  { field: 'salesOutlet', header: 'Sales Outlet\n(3 bln)', align: 'right', width: '10rem' },
] as any

const outletColumns = [
  { field: 'outlet', header: 'Outlet' },
  {
    field: 'tipe',
    uniqueField: 'uniqueTipe',
    header: 'Tipe',
    type: 'badge',
    badgeMap: tipeMap,
    width: '5rem',
  },
  { field: 'user', header: 'User', width: '11rem' },
  {
    field: 'aktif',
    header: '',
    type: 'dot',
    width: '2rem',
    dotColor: (r: any) => (r.aktif ? '#16a34a' : null),
  },
  ...(role.value === 'dm'
    ? [
        {
          field: 'mr',
          header: 'MR',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
        {
          field: 'spv',
          header: 'SPV',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
        {
          field: 'dm',
          header: 'DM',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
      ]
    : [
        {
          field: 'dm',
          header: 'SM',
          type: 'number',
          boxed: true,
          editable: true,
          align: 'center',
          width: '4rem',
        },
      ]),
  {
    field: 'shift',
    header: 'Shift',
    type: 'select',
    boxed: true,
    editable: true,
    options: ['Siang', 'Malam'],
    width: '9rem',
  },
  { field: 'jabatan', header: 'Jabatan', type: 'badge', width: '10rem' },
  { field: 'salesUser', header: 'Sales User\n(3 bln)', align: 'right', width: '10rem' },
  { field: 'salesOutlet', header: 'Sales Outlet\n(3 bln)', align: 'right', width: '10rem' },
] as any

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

const handleSubmit = () => {
  console.log(visitorList)
}

const salesData = ref<any[]>([])

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
  <PageWrapper
    title="Tambah MCL"
    description="Pilih user yang akan diajukan ke dalam Master Call List untuk periode triwulan berjalan"
    max-width="max-w-8xl"
    class="pb-5"
  >
    <AdditionalInformation icon="pi pi-clock">
      <strong>Batas pengajuan: 2 minggu sebelum awal periode triwulan</strong>
    </AdditionalInformation>

    <Filter.Bar class="mt-3 !p-5">
      <Filter.Field
        label="Periode Tahun"
        for="year"
        class="basis-[calc(50%-0.5rem)] md:basis-0 md:flex-1"
      >
        <Filter.Select
          id="year"
          v-model="selectedYear"
          :options="years"
          :show-clear="false"
          class="w-full max-w-none"
        />
      </Filter.Field>

      <Filter.Field
        label="Triwulan"
        for="quarter"
        class="basis-[calc(50%-0.5rem)] md:basis-0 md:flex-1"
      >
        <Filter.Select
          id="quarter"
          v-model="selectedQuarter"
          :options="quarters"
          option-label="label"
          option-value="value"
          option-disabled="disabled"
          placeholder="Tidak ada triwulan..."
          :show-clear="false"
          class="w-full max-w-none"
        />
      </Filter.Field>

      <Filter.Divider />

      <Filter.Field label="Lihat berdasarkan" class="basis-full md:basis-0 md:flex-1">
        <Filter.Segmented v-model="selected" :options="options" />
      </Filter.Field>
    </Filter.Bar>

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
                  class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-green-500"
                ></div>

                <span class="text-[15px] font-semibold text-[#0B1F3A]">
                  {{ item.user }}
                </span>

                <span
                  class="inline-flex items-center self-start rounded-lg bg-blue-50 px-3 py-1 text-[10.5px] font-semibold text-blue-800"
                >
                  {{ item.jabatan }}
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
                <div class="flex flex-col items-center gap-1">
                  <label :for="`mr-${index}`" class="text-[11px] text-[#64748B]">MR</label>
                  <CellInput
                    :id="`mr-${index}`"
                    type="number"
                    v-model="item.mr"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-1">
                  <label :for="`spv-${index}`" class="text-[11px] text-[#64748B]">SPV</label>
                  <CellInput
                    :id="`spv-${index}`"
                    type="number"
                    v-model="item.spv"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-1">
                  <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]">DM</label>
                  <CellInput
                    :id="`dm-${index}`"
                    type="number"
                    v-model="item.dm"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col items-center gap-1">
                  <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]">SHIFT</label>
                  <CellSelect :id="`shift-${index}`" v-model="item.shift" :options="shiftOptions" />
                </div>
              </div>

              <div v-if="role === 'sm'" class="flex flex-row w-full gap-3">
                <div class="flex flex-col flex-1 items-center gap-1">
                  <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]"
                    >TARGET VISIT SM</label
                  >
                  <CellInput
                    :id="`sm-${index}`"
                    type="number"
                    v-model="item.dm"
                    width="w-full"
                    input-id="integeronly"
                  />
                </div>

                <div class="flex flex-col flex-1 items-center gap-1">
                  <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]">SHIFT</label>
                  <Select
                    :id="`shift-${index}`"
                    v-model="item.shift"
                    :options="shiftOptions"
                    class="h-7.5 w-full"
                    :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                    input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                  />
                </div>
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
          :is-expanded="true"
          rounded=""
          :background="(_, index) => (index % 2 === 1 ? 'bg-[#FDF1E3]' : 'bg-[#EAF1FD]')"
          :padding="0"
        >
          <template #item="{ item, index }">
            <!-- Container utama slot untuk menata posisi elemen berjejer -->
            <div class="relative flex items-center w-full py-2 cursor-pointer">
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
            </div>
          </template>

          <template #expanded="{ item }">
            <div class="flex flex-col w-full bg-[#F8F9FA] pb-4">
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
                          v-if="visitor.aktif"
                          class="absolute right-2 top-0.5 h-3 w-3 rounded-full bg-green-500"
                        ></div>

                        <span class="text-[15px] font-semibold text-[#0B1F3A]">
                          {{ visitor.user }}
                        </span>

                        <span
                          class="inline-flex items-center self-start rounded-lg bg-blue-50 px-3 py-1 text-[10.5px] font-semibold text-blue-800"
                        >
                          {{ visitor.jabatan }}
                        </span>
                      </div>

                      <hr class="my-2 w-full border-[#ECEEF3] my-3" />
                      <div v-if="role === 'dm'" class="flex flex-row w-full justify-between">
                        <div class="flex flex-col items-center gap-1">
                          <label :for="`mr-${index}`" class="text-[11px] text-[#64748B]">MR</label>
                          <CellInput
                            :id="`mr-${index}`"
                            type="number"
                            v-model="visitor.mr"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-1">
                          <label :for="`spv-${index}`" class="text-[11px] text-[#64748B]"
                            >SPV</label
                          >
                          <CellInput
                            :id="`spv-${index}`"
                            type="number"
                            v-model="visitor.spv"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-1">
                          <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]">DM</label>
                          <CellInput
                            :id="`dm-${index}`"
                            type="number"
                            v-model="visitor.dm"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col items-center gap-1">
                          <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]"
                            >SHIFT</label
                          >
                          <Select
                            :id="`shift-${index}`"
                            v-model="visitor.shift"
                            :options="shiftOptions"
                            class="w-22.5 h-7.5"
                            :pt="{ dropdownIcon: { class: 'w-3 h-3' } }"
                            input-class="flex items-center justify-center w-full h-full py-0 px-1 text-center text-[13px] font-bold text-[#0B1F3A]"
                          />
                        </div>
                      </div>
                      <div v-if="role === 'sm'" class="flex flex-row w-full gap-3">
                        <div class="flex flex-col flex-1 items-center gap-1">
                          <label :for="`dm-${index}`" class="text-[11px] text-[#64748B]"
                            >TARGET VISIT SM</label
                          >
                          <CellInput
                            :id="`sm-${index}`"
                            type="number"
                            v-model="visitor.dm"
                            width="w-full"
                            input-id="integeronly"
                          />
                        </div>

                        <div class="flex flex-col flex-1 items-center gap-1">
                          <label :for="`shift-${index}`" class="text-[11px] text-[#64748B]"
                            >SHIFT</label
                          >
                          <CellSelect
                            :id="`shift-${index}`"
                            v-model="visitor.shift"
                            :options="shiftOptions"
                          />
                        </div>
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
          </template>
        </DynamicList>
      </div>

      <CustomDataTable
        v-else
        :data="selected === 'user' ? visitorList : salesData"
        :groupRowsBy="['outlet', 'uniqueTipe']"
        :columns="selected === 'user' ? userColumns : outletColumns"
        :rows="10"
        :loading="loading"
      />

      <div
        class="fixed lg:static bottom-16 left-0 w-full px-4 py-4 flex items-center gap-2 sm:gap-4 z-40 bg-white/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border-t border-gray-200 lg:border-transparent justify-center lg:justify-end"
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
    </form>
  </PageWrapper>
</template>
