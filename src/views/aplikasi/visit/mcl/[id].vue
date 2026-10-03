<route lang="yaml">
meta:
  title: Detail MCL
</route>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { ColumnDef, DataRow } from '@/components/custom-data-table.types'
import CustomDataTable from '@/components/CustomDataTable.vue'
import * as Filter from '@/components/Filter'
import StepIndicator from '@/components/StepIndicator.vue'
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import { formatRupiah } from '@/utils/formatter'

const route = useRoute()
const router = useRouter()

const basePath = '/aplikasi/visit/mcl'
const mclId = computed(() => (route.params as { id: string }).id)

const statusMeta = {
  draft: { label: 'Draft', badge: 'bg-amber-100 text-amber-700', path: 'draft' },
  menunggu_approval: {
    label: 'Menunggu Approval',
    badge: 'bg-orange-100 text-orange-700',
    path: 'awaiting-approval',
  },
  disetujui: { label: 'Disetujui', badge: 'bg-emerald-100 text-emerald-700', path: 'approved' },
}

type Status = keyof typeof statusMeta

const mcl = ref<{ id: number; triwulan: string; status: Status } | null>(null)
interface MclRow extends DataRow {
  id: number
  user: string
  aktif: boolean
  jabatan: string
  outlet: string
  tipe: string
  mr: number
  spv: number
  dm: number
  shift: string
  salesUser: number | null
  salesOutlet: number | null
}

const rows = ref<MclRow[]>([])
const loading = ref(false)

const dummyRows = [
  {
    id: 1,
    user: 'John',
    aktif: true,
    jabatan: 'Dokter Umum',
    outlet: 'RS Mitra Keluarga',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Malam',
    salesUser: 310000000,
    salesOutlet: 485000000,
  },
  {
    id: 2,
    user: 'Budiyono Dwijono',
    aktif: false,
    jabatan: 'Apoteker',
    outlet: 'Rumah Sakit Cipto Mangunkusumo',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 425000000,
  },
  {
    id: 3,
    user: 'Andi S',
    aktif: true,
    jabatan: 'Dokter Spesialis',
    outlet: 'Rumah Sakit Griya Sehat',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Malam',
    salesUser: 425000000,
    salesOutlet: 425000000,
  },
  {
    id: 4,
    user: 'Budi',
    aktif: false,
    jabatan: 'Kasir',
    outlet: 'Rumah Sakit Cipto Mangunkusumo',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 425000000,
  },
  {
    id: 5,
    user: 'Rifka',
    aktif: false,
    jabatan: 'Gudang',
    outlet: 'Rumah Sakit Cipto Mangunkusumo',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 425000000,
  },
  {
    id: 6,
    user: 'Edrick',
    aktif: true,
    jabatan: 'Dokter Umum',
    outlet: 'Klinik Mediros',
    tipe: 'Klinik',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Malam',
    salesUser: 20000000,
    salesOutlet: 32000000,
  },
  {
    id: 7,
    user: 'Mustofa',
    aktif: true,
    jabatan: 'Dokter Umum',
    outlet: 'Klinik Mediros',
    tipe: 'Klinik',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Malam',
    salesUser: 12000000,
    salesOutlet: 32000000,
  },
  {
    id: 8,
    user: 'Edrick',
    aktif: true,
    jabatan: 'Dokter Umum',
    outlet: 'RS Siloam',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Malam',
    salesUser: 150000000,
    salesOutlet: 410000000,
  },
  {
    id: 9,
    user: 'Johny P',
    aktif: false,
    jabatan: 'Apoteker',
    outlet: 'RS Siloam',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 410000000,
  },
  {
    id: 10,
    user: 'Meydi',
    aktif: false,
    jabatan: 'Gudang',
    outlet: 'RS Siloam',
    tipe: 'RS',
    mr: 3,
    spv: 1,
    dm: 1,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 410000000,
  },
  {
    id: 11,
    user: 'Roni',
    aktif: true,
    jabatan: 'Farmasi',
    outlet: 'Apotek Krisha',
    tipe: 'Apotek',
    mr: 0,
    spv: 0,
    dm: 0,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 45000000,
  },
  {
    id: 12,
    user: 'Budiman',
    aktif: false,
    jabatan: 'Farmasi',
    outlet: 'Apotek Bima',
    tipe: 'Apotek',
    mr: 0,
    spv: 0,
    dm: 0,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 38000000,
  },
  {
    id: 13,
    user: 'Vero',
    aktif: true,
    jabatan: 'Farmasi',
    outlet: 'Apotek K24',
    tipe: 'Apotek',
    mr: 0,
    spv: 0,
    dm: 0,
    shift: 'Siang',
    salesUser: null,
    salesOutlet: 52000000,
  },
]

// data indikator approval
const approvalSteps = computed(() => {
  const approved = mcl.value?.status === 'disetujui'

  const steps = [
    {
      title: 'Diajukan DM (Lucky Chandra)',
      subtitle: '12 Mar 2026, 14.20 WIB',
      done: true,
    },
    {
      title: 'Menunggu Disetujui SM (Alvita Rahma)',
      done: approved,
    },
  ]

  if (approved) {
    steps.push({
      title: 'Disetujui SM (Alvita Rahma)',
      subtitle: '15 Mar 2026, 09.05 WIB',
      done: true,
    })
  }
  return steps
})

async function reload() {
  loading.value = true
  try {
    const q = String(route.query.status ?? '')
    const status = (q in statusMeta ? q : 'draft') as Status
    mcl.value = {
      id: Number(mclId.value),
      triwulan: String(route.query.triwulan ?? ''),
      status,
    }
    rows.value = dummyRows.map((r) => ({ ...r }))
  } finally {
    loading.value = false
  }
}
onMounted(reload)

const isReadOnly = computed(() => mcl.value?.status !== 'draft')

/* ---------------------------- Filter---------------------------- */

const selected = ref('user')

const viewOptions = [
  { label: 'User', value: 'user' },
  { label: 'Outlet', value: 'outlet' },
]

const quarterOptions = [
  { label: 'Triwulan I (Jan-Mar)', value: 1 },
  { label: 'Triwulan II (Apr-Jun)', value: 2 },
  { label: 'Triwulan III (Jul-Sep)', value: 3 },
  { label: 'Triwulan IV (Okt-Des)', value: 4 },
]
// Sesuaikan dengan data asli dari API. Sementara dibaca dari query: ?tahun=2026&triwulan=1
const yearOptions = computed(() => [Number(route.query.tahun) || new Date().getFullYear()])
const selectedYear = computed(() => yearOptions.value[0])
const selectedQuarter = computed(() => Number(route.query.triwulan) || 1)

/* -------------------------------- tabel ----------------------------------- */

const tipeMap = {
  RS: { bg: '#e3e9fb', text: '#2f4ea8' },
  Klinik: { bg: '#d9f3ea', text: '#0f7a57' },
  Apotek: { bg: '#fde3ea', text: '#c81e4d' },
}

const columns: ColumnDef[] = [
  { field: 'user', header: 'User', width: '11rem' },
  {
    field: 'aktif',
    header: '',
    type: 'dot',
    width: '2rem',
    dotColor: (r) => (r.aktif === true ? '#16a34a' : null),
  },
  { field: 'jabatan', header: 'Jabatan', type: 'badge', width: '10rem' },
  { field: 'outlet', header: 'Outlet' },
  { field: 'tipe', header: 'Tipe', type: 'badge', badgeMap: tipeMap, width: '5rem' },
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
]

const col = (field: string): ColumnDef => columns.find((c) => c.field === field)!

const outletColumns: ColumnDef[] = [
  col('outlet'),
  { ...col('tipe'), uniqueField: 'uniqueTipe' },
  col('user'),
  col('aktif'),
  col('mr'),
  col('spv'),
  col('dm'),
  col('shift'),
  col('jabatan'),
  col('salesUser'),
  col('salesOutlet'),
]

const tableRows = computed(() =>
  [...rows.value]
    .sort((a, b) =>
      selected.value === 'user'
        ? a.user.localeCompare(b.user)
        : a.outlet.localeCompare(b.outlet) || a.user.localeCompare(b.user),
    )
    .map((r) => ({
      ...r,
      uniqueTipe: r.tipe + r.outlet,
      salesUser: formatRupiah(r.salesUser),
      salesOutlet: formatRupiah(r.salesOutlet),
    })),
)

function onChange({ row, key, value }: { row: DataRow; key: string; value: unknown }) {
  if (isReadOnly.value) {
    return
  }
  let nextValue = value
  if (['mr', 'spv', 'dm'].includes(key)) {
    nextValue = Math.max(0, Math.floor(Number(value) || 0))
  }
  const target = rows.value.find((r) => r.id === row.id)
  if (target) {
    target[key] = nextValue
  }
}

const saving = ref(false)
async function runAction(key: 'save' | 'submit') {
  if (!mcl.value || isReadOnly.value) {
    return
  }
  saving.value = true
  try {
    if (key === 'submit') {
      mcl.value.status = 'menunggu_approval'
    }
  } finally {
    saving.value = false
  }
}

const showApprovalSteps = computed(
  () => mcl.value?.status === 'menunggu_approval' || mcl.value?.status === 'disetujui',
)
</script>

<template>
  <PageWrapper :title="`Detail MCL #${mclId}`" max-width="max-w-8xl">
    <p v-if="!mcl && loading" class="mt-4 text-sm text-slate-400">Memuat data...</p>

    <div v-else-if="mcl" class="space-y-4">
      <StepIndicator v-if="showApprovalSteps" :steps="approvalSteps" class="py-2" />

      <Filter.Bar class="!p-5">
        <Filter.Field
          label="Periode Tahun"
          for="year"
          class="basis-[calc(50%-0.5rem)] md:basis-0 md:flex-1"
        >
          <Filter.Select
            id="year"
            :model-value="selectedYear"
            :options="yearOptions"
            :show-clear="false"
            disabled
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
            :model-value="selectedQuarter"
            :options="quarterOptions"
            option-label="label"
            option-value="value"
            :show-clear="false"
            disabled
            class="w-full max-w-none"
          />
        </Filter.Field>

        <Filter.Divider />

        <Filter.Field label="Lihat berdasarkan" class="basis-full md:basis-0 md:flex-[2]">
          <Filter.Segmented v-model="selected" :options="viewOptions" />
        </Filter.Field>
      </Filter.Bar>

      <CustomDataTable
        :data="tableRows"
        :columns="selected === 'user' ? columns : outletColumns"
        :group-rows-by="selected === 'outlet' ? ['outlet', 'uniqueTipe'] : undefined"
        :rows="10"
        :loading="loading"
        :readonly="isReadOnly"
        @change="onChange"
      />

      <div v-if="mcl.status === 'draft'" class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="min-w-[160px] rounded-lg border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
          @click="router.push(basePath)"
        >
          Batal
        </button>
        <button
          type="button"
          :disabled="saving"
          class="min-w-[160px] rounded-lg border-2 border-blue-600 bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
          @click="runAction('save')"
        >
          Simpan Draft
        </button>
        <button
          type="button"
          :disabled="saving"
          class="min-w-[160px] rounded-lg border-2 border-blue-600 bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          @click="runAction('submit')"
        >
          Ajukan
        </button>
      </div>
    </div>
  </PageWrapper>
</template>
