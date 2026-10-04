<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MasterCallListTable from '@/features/visits/master-call-list/components/MasterCallListTable.vue'
import StepIndicator from '@/features/visits/master-call-list/components/StepIndicator.vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import * as Filter from '@/shared/forms/Filter'
import { formatRupiah } from '@/shared/utils/formatter'

const route = useRoute()
const router = useRouter()

const basePath = '/app/visits/master-call-list'
const mclId = computed(() => (route.params as { id: string }).id)

const statusMeta = {
  draft: { label: 'Draft', badge: 'bg-bnf-warning/10 text-bnf-warning', path: 'draft' },
  menunggu_approval: {
    label: 'Menunggu Approval',
    badge: 'bg-bnf-warning/10 text-bnf-warning',
    path: 'awaiting-approval',
  },
  disetujui: { label: 'Disetujui', badge: 'bg-bnf-success/10 text-bnf-success', path: 'approved' },
}

type Status = keyof typeof statusMeta

const mcl = ref<{ id: number; triwulan: string; status: Status } | null>(null)
interface MclRow extends Record<string, unknown> {
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

const mockRows = [
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
    rows.value = mockRows.map((r) => ({ ...r }))
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

function onChange({ row, key, value }: { row: unknown; key: string; value: unknown }) {
  if (isReadOnly.value) {
    return
  }
  let nextValue = value
  if (['mr', 'spv', 'dm'].includes(key)) {
    nextValue = Math.max(0, Math.floor(Number(value) || 0))
  }
  const target = rows.value.find((r) => r.id === (row as { id?: number }).id)
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
  <AppHeader
    :title="`Detail MCL #${mclId}`"
    subtitle="Detail pengajuan Master Call List."
    max-width="max-w-8xl"
  >
    <p v-if="!mcl && loading" class="mt-4 text-sm text-bnf-text-muted">Memuat data...</p>

    <div v-else-if="mcl" class="space-y-4">
      <StepIndicator v-if="showApprovalSteps" :steps="approvalSteps" class="py-2" />

      <Filter.Bar class="p-5!">
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

      <MasterCallListTable
        :data="tableRows"
        :selected="selected"
        role="dm"
        :rows="10"
        :loading="loading"
        :readonly="isReadOnly"
        @change="onChange"
      />

      <div v-if="mcl.status === 'draft'" class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="min-w-[160px] rounded-lg border-2 border-bnf-border bg-bnf-surface px-6 py-2.5 text-sm font-semibold text-bnf-text-muted transition hover:bg-bnf-surface-muted"
          @click="router.push(basePath)"
        >
          Batal
        </button>
        <button
          type="button"
          :disabled="saving"
          class="min-w-[160px] rounded-lg border-2 border-bnf-primary bg-bnf-surface px-6 py-2.5 text-sm font-semibold text-bnf-primary transition hover:bg-bnf-primary/5 disabled:opacity-50"
          @click="runAction('save')"
        >
          Simpan Draft
        </button>
        <button
          type="button"
          :disabled="saving"
          class="min-w-[160px] rounded-lg border-2 border-bnf-primary bg-bnf-primary px-6 py-2.5 text-sm font-semibold text-[color:var(--bnf-color-foreground)] transition hover:bg-bnf-primary-hover disabled:opacity-50"
          @click="runAction('submit')"
        >
          Ajukan
        </button>
      </div>
    </div>
  </AppHeader>
</template>
