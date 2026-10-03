<route lang="yaml">
meta:
  title: Approval
</route>

<script setup lang="ts">
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import { computed, ref } from 'vue'
import CustomDataTable from '@/components/CustomDataTable.vue'
import DynamicList from '@/components/DynamicList.vue'
import { Button } from 'primevue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useRouter } from 'vue-router'
import SearchInput from '@/components/SearchInput.vue'
import * as Filter from '@/components/Filter'

const isMobile = useIsMobile()

const router = useRouter()

const approvals = ref([
  {
    noApproval: 'JUL-2026-0011',
    noTransaksi: 'TRX-2026-4563',
    jenisApproval: 'Relokasi',
    pengaju: 'Alvita Rahma',
    tanggalPengajuan: '17 Jul 2026',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'JUN-2026-0011',
    noTransaksi: 'TRX-2026-8841',
    jenisApproval: 'Perpindahan Outlet',
    pengaju: 'Andi Saputra',
    tanggalPengajuan: '26 Jun 2026',
    keterangan: 'Perpindahan outlet Apotek Sehat Jaya ke Rayon Jakarta Selatan',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'MEI-2026-0011-DM',
    noTransaksi: 'TRX-2026-8564',
    jenisApproval: 'MCL',
    pengaju: 'Lucky Chandra',
    tanggalPengajuan: '16 Mei 2026',
    keterangan: 'MCL Triwulan IV (Oktober - Desember 2026) - DM Lucky Chandra',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'APR-2026-0011',
    noTransaksi: 'TRX-2026-1465',
    jenisApproval: 'ED Khusus',
    pengaju: 'Futukhal Arifin',
    tanggalPengajuan: '21 Apr 2026',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'FEB-2026-0012',
    noTransaksi: 'TRX-2026-1234',
    jenisApproval: 'Rencana Visit Mingguan',
    pengaju: 'Lamsyah',
    tanggalPengajuan: '15 Feb 2026',
    keterangan: 'Visit Mingguan Periode 10-15 Agustus 2026 - MR Lamsyah',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'FEB-2026-0011',
    noTransaksi: 'TRX-2026-9174',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Nur Aziz',
    tanggalPengajuan: '3 Feb 2026',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'JAN-2026-0011',
    noTransaksi: 'TRX-2026-2424',
    jenisApproval: 'Relokasi',
    pengaju: 'Christian',
    tanggalPengajuan: '30 Jan 2026',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'NOV-2026-0011',
    noTransaksi: 'TRX-2026-4527',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Yeremiah',
    tanggalPengajuan: '27 Nov 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'OKT-2026-0011',
    noTransaksi: 'TRX-2025-2845',
    jenisApproval: 'Perpindahan Outlet',
    pengaju: 'Mando Gunawan',
    tanggalPengajuan: '10 Okt 2025',
    keterangan: 'Perpindahan Apotek Abadi ke Rayon Jakarta Pusat',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'SEP-2025-0011',
    noTransaksi: 'TRX-2025-4241',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Ridow Kantana',
    tanggalPengajuan: '18 Sep 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'AGU-2025-0014',
    noTransaksi: 'TRX-2025-3312',
    jenisApproval: 'MCL',
    pengaju: 'Dewi Anggraini',
    tanggalPengajuan: '9 Agu 2025',
    keterangan: 'MCL Triwulan III (Juli - September 2025) - DM Dewi Anggraini',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'AGU-2025-0009',
    noTransaksi: 'TRX-2025-2987',
    jenisApproval: 'ED Khusus',
    pengaju: 'Rizal Fahmi',
    tanggalPengajuan: '2 Agu 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'JUL-2025-0022',
    noTransaksi: 'TRX-2025-2765',
    jenisApproval: 'Rencana Visit Mingguan',
    pengaju: 'Siti Rahayu',
    tanggalPengajuan: '28 Jul 2025',
    keterangan: 'Visit Mingguan Periode 21-26 Juli 2025 - MR Siti Rahayu',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'JUL-2025-0015',
    noTransaksi: 'TRX-2025-2410',
    jenisApproval: 'Relokasi',
    pengaju: 'Bambang Setiawan',
    tanggalPengajuan: '14 Jul 2025',
    keterangan: 'Perpindahan outlet Apotek Sentosa ke Rayon Bekasi',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'JUN-2025-0031',
    noTransaksi: 'TRX-2025-2098',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Hendra Wijaya',
    tanggalPengajuan: '25 Jun 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'JUN-2025-0018',
    noTransaksi: 'TRX-2025-1876',
    jenisApproval: 'Perpindahan Outlet',
    pengaju: 'Melati Putri',
    tanggalPengajuan: '11 Jun 2025',
    keterangan: 'Perpindahan outlet Apotek Sejahtera ke Rayon Tangerang',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'MEI-2025-0027',
    noTransaksi: 'TRX-2025-1654',
    jenisApproval: 'MCL',
    pengaju: 'Agus Salim',
    tanggalPengajuan: '30 Mei 2025',
    keterangan: 'MCL Triwulan II (April - Juni 2025) - DM Agus Salim',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'MEI-2025-0012',
    noTransaksi: 'TRX-2025-1432',
    jenisApproval: 'ED Khusus',
    pengaju: 'Nadia Kusuma',
    tanggalPengajuan: '16 Mei 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'APR-2025-0029',
    noTransaksi: 'TRX-2025-1287',
    jenisApproval: 'Rencana Visit Mingguan',
    pengaju: 'Fajar Ramadhan',
    tanggalPengajuan: '22 Apr 2025',
    keterangan: 'Visit Mingguan Periode 15-20 April 2025 - MR Fajar Ramadhan',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'APR-2025-0016',
    noTransaksi: 'TRX-2025-1103',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Wulan Sari',
    tanggalPengajuan: '8 Apr 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'MAR-2025-0024',
    noTransaksi: 'TRX-2025-0982',
    jenisApproval: 'Relokasi',
    pengaju: 'Dimas Prasetyo',
    tanggalPengajuan: '26 Mar 2025',
    keterangan: 'Perpindahan outlet Apotek Harapan ke Rayon Depok',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'MAR-2025-0011',
    noTransaksi: 'TRX-2025-0765',
    jenisApproval: 'Perpindahan Outlet',
    pengaju: 'Ayu Lestari',
    tanggalPengajuan: '12 Mar 2025',
    keterangan: 'Perpindahan outlet Apotek Mulia ke Rayon Bogor',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'FEB-2025-0033',
    noTransaksi: 'TRX-2025-0621',
    jenisApproval: 'MCL',
    pengaju: 'Reza Pratama',
    tanggalPengajuan: '24 Feb 2025',
    keterangan: 'MCL Triwulan I (Januari - Maret 2025) - DM Reza Pratama',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'FEB-2025-0019',
    noTransaksi: 'TRX-2025-0487',
    jenisApproval: 'ED Khusus',
    pengaju: 'Indah Permata',
    tanggalPengajuan: '10 Feb 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'JAN-2025-0026',
    noTransaksi: 'TRX-2025-0342',
    jenisApproval: 'Rencana Visit Mingguan',
    pengaju: 'Taufik Hidayat',
    tanggalPengajuan: '27 Jan 2025',
    keterangan: 'Visit Mingguan Periode 20-25 Januari 2025 - MR Taufik Hidayat',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'JAN-2025-0013',
    noTransaksi: 'TRX-2025-0198',
    jenisApproval: 'Rotasi Personel',
    pengaju: 'Sri Wahyuni',
    tanggalPengajuan: '13 Jan 2025',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'MENUNGGU',
  },
  {
    noApproval: 'DES-2024-0038',
    noTransaksi: 'TRX-2024-9876',
    jenisApproval: 'Relokasi',
    pengaju: 'Rudi Hartono',
    tanggalPengajuan: '29 Des 2024',
    keterangan: 'Perpindahan outlet Apotek Bahagia ke Rayon Bandung',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'DES-2024-0021',
    noTransaksi: 'TRX-2024-9654',
    jenisApproval: 'Perpindahan Outlet',
    pengaju: 'Fitriani',
    tanggalPengajuan: '15 Des 2024',
    keterangan: 'Perpindahan outlet Apotek Sentral ke Rayon Cimahi',
    statusApproval: 'DITOLAK',
  },
  {
    noApproval: 'NOV-2024-0035',
    noTransaksi: 'TRX-2024-9432',
    jenisApproval: 'MCL',
    pengaju: 'Gilang Ramadhan',
    tanggalPengajuan: '28 Nov 2024',
    keterangan: 'MCL Triwulan IV (Oktober - Desember 2024) - DM Gilang Ramadhan',
    statusApproval: 'DISETUJUI',
  },
  {
    noApproval: 'NOV-2024-0020',
    noTransaksi: 'TRX-2024-9187',
    jenisApproval: 'ED Khusus',
    pengaju: 'Putri Ayu',
    tanggalPengajuan: '14 Nov 2024',
    keterangan:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    statusApproval: 'MENUNGGU',
  },
])

const statusBadgeMap: Record<string, { bg: string; text: string }> = {
  DISETUJUI: { bg: '#d1fae5', text: '#059669' },
  MENUNGGU: { bg: '#fef3c7', text: '#d97706' },
  DITOLAK: { bg: '#fee2e2', text: '#dc2626' },
}

const columns = [
  { field: 'no', header: 'NO', type: 'index' as const, width: '3rem' },
  { field: 'noApproval', header: 'NO APPROVAL', width: '9rem' },
  { field: 'noTransaksi', header: 'NO TRANSAKSI', width: '9rem' },
  {
    field: 'jenisApproval',
    header: 'JENIS APPROVAL',
    type: 'badge' as const,
    width: '9rem',
    headerAlign: 'center' as const,
  },
  { field: 'pengaju', header: 'PENGAJU', width: '9rem' },
  { field: 'tanggalPengajuan', header: 'TANGGAL PENGAJUAN', width: '9rem' },
  {
    field: 'keterangan',
    header: 'KETERANGAN',
    headerAlign: 'center' as const,
  },
  {
    field: 'statusApproval',
    header: 'STATUS APPROVAL',
    type: 'badge' as const,
    width: '8rem',
    badgeMap: statusBadgeMap,
  },
]

function handleView(row: any) {
  router.push(`/aplikasi/approval/${row.noApproval}`)
}

const statusTabDefs = [
  { label: 'semua', value: null },
  { label: 'Menunggu', value: 'MENUNGGU', color: '#f59e0b' },
  { label: 'Disetujui', value: 'DISETUJUI', color: '#10b981' },
  { label: 'Ditolak', value: 'DITOLAK', color: '#ef4444' },
]

const jenisApprovalOptions = [
  'Relokasi',
  'Perpindahan Outlet',
  'MCL',
  'ED Khusus',
  'Rencana Visit Mingguan',
  'Rotasi Personel',
]

const activeTab = ref<string | null>(null)
const searchQuery = ref('')
const groupFilter = ref<string | null>(null)

const filteredData = computed(() => {
  return approvals.value.filter((item) => {
    const matchesTab = activeTab.value === null || item.statusApproval === activeTab.value
    const matchesSearch =
      !searchQuery.value ||
      item.noApproval.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase()) ||
      item.pengaju.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGroup = !groupFilter.value || item.jenisApproval === groupFilter.value
    return matchesTab && matchesSearch && matchesGroup
  })
})
</script>

<template>
  <PageWrapper
    title="Approval"
    description="Kelola dan tinjau semua pengajuan persetujuan"
    max-width="max-w-8xl"
  >
    <div class="flex flex-col gap-4">
      <Filter.Bar class="lg:items-center lg:justify-between">
        <Filter.Tabs
          v-model="activeTab"
          :tabs="statusTabDefs"
          :data="approvals"
          status-field="statusApproval"
          title="STATUS APPROVAL"
        />

        <div class="flex items-center gap-3 flex-nowrap">
          <div class="w-px self-stretch bg-slate-200 hidden lg:block shrink-0" />

          <div class="w-full sm:w-64 shrink-0">
            <SearchInput v-model="searchQuery" placeholder="Cari Approval" />
          </div>

          <Filter.InlineSelect
            v-model="groupFilter"
            label="FILTER"
            icon="pi pi-filter"
            :options="jenisApprovalOptions"
            placeholder="Jenis Approval"
          />
        </div>
      </Filter.Bar>

      <CustomDataTable
        v-if="!isMobile"
        :data="filteredData"
        :columns="columns"
        show-actions
        show-view
        action-label="Review"
        action-icon="pi pi-eye"
        @view="handleView"
      />
      <DynamicList v-else :items="filteredData" layout="column" :gap="4" :show-arrow="false">
        <template #item="{ item }">
          <div class="flex flex-col w-full gap-3">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap w-fit"
              :style="{
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
              }"
            >
              {{ item.jenisApproval }}
            </span>
            <div class="flex w-full justify-between items-center">
              <div class="flex flex-col gap-2">
                <span class="text-[#0B1F3D] text-[14px] font-bold">{{ item.noApproval }}</span>
                <div class="flex items-center gap-2 text-[#4B5563] text-[12.5px]">
                  <span
                    >Pengaju: <span class="text-[#111827]">{{ item.pengaju }}</span></span
                  >
                  <span>&bull;</span>
                  <span>{{ item.tanggalPengajuan }}</span>
                </div>
              </div>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                :style="{
                  backgroundColor: statusBadgeMap[item.statusApproval]?.bg || '#dbeafe',
                  color: statusBadgeMap[item.statusApproval]?.text || '#1d4ed8',
                }"
              >
                {{ item.statusApproval }}
              </span>
            </div>

            <div class="text-[#4B5563] text-[13px] bg-[#F4F6FA] rounded-md p-2">
              {{ item.keterangan }}
            </div>

            <div class="flex w-full justify-between items-center">
              <span class="text-[11.5px] text-[#9CA3AF]">{{ item.noTransaksi }}</span>
              <Button
                as="router-link"
                :to="`/aplikasi/approval/${item.noApproval}`"
                label="Review"
                icon="pi pi-eye"
                severity="info"
                rounded
                size="small"
                class="bg-slate-800 border-slate-800 text-xs py-1 px-3"
              />
            </div>
          </div>
        </template>
      </DynamicList>
    </div>
  </PageWrapper>
</template>
