<route lang="yaml">
meta:
  title: Detail MCL
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'
import { formatRupiah } from '@/utils/formatter'
import { number } from 'zod'

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

function handleBack() {
  router.back()
}

const isReadOnly = ref(false)

const rows = ref([
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
])

const tableRows = computed(() =>
  rows.value.map((r) => ({
    ...r,
    salesUser: formatRupiah(r.salesUser),
    salesOutlet: formatRupiah(r.salesOutlet),
  })),
)

//edit dicatat
function onChange({ row, key, value }: { row: any; key: string; value: any }) {
  const target = rows.value.find((r) => r.id === row.id)
  if (target) (target as any)[key] = value
  //api nti disini
}

const tipeMap = {
  RS: { bg: '#e3e9fb', text: '#2f4ea8' },
  Klinik: { bg: '#d9f3ea', text: '#0f7a57' },
  Apotek: { bg: '#fde3ea', text: '#c81e4d' },
}

const columns = [
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
] as any[]
</script>

<template>
  <PageWrapper :title="`Detail MCL #${mclId}`" max-width="max-w-8xl">
    <CustomDataTable
      :data="tableRows"
      :columns="columns"
      :rows="15"
      :readonly="isReadOnly"
      :show-actions="false"
      @change="onChange"
    />
  </PageWrapper>
</template>
