<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/shared/components/layout/AppHeader.vue'

import ApprovalFilter from '../components/ApprovalFilter.vue'
import ApprovalList from '../components/ApprovalList.vue'

const router = useRouter()

const approvals = ref<
  {
    approvalNo: string
    transactionNo: string
    approvalType: string
    requester: string
    submittedDate: string
    description: string
    approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  }[]
>([
  {
    approvalNo: 'JUL-2026-0011',
    transactionNo: 'TRX-2026-4563',
    approvalType: 'Relokasi',
    requester: 'Alvita Rahma',
    submittedDate: '17 Jul 2026',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'JUN-2026-0011',
    transactionNo: 'TRX-2026-8841',
    approvalType: 'Perpindahan Outlet',
    requester: 'Andi Saputra',
    submittedDate: '26 Jun 2026',
    description: 'Perpindahan outlet Apotek Sehat Jaya ke Rayon Jakarta Selatan',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'MEI-2026-0011-DM',
    transactionNo: 'TRX-2026-8564',
    approvalType: 'MCL',
    requester: 'Lucky Chandra',
    submittedDate: '16 Mei 2026',
    description: 'MCL Triwulan IV (Oktober - Desember 2026) - DM Lucky Chandra',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'APR-2026-0011',
    transactionNo: 'TRX-2026-1465',
    approvalType: 'ED Khusus',
    requester: 'Futukhal Arifin',
    submittedDate: '21 Apr 2026',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'FEB-2026-0012',
    transactionNo: 'TRX-2026-1234',
    approvalType: 'Rencana Visit Mingguan',
    requester: 'Lamsyah',
    submittedDate: '15 Feb 2026',
    description: 'Visit Mingguan Periode 10-15 Agustus 2026 - MR Lamsyah',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'FEB-2026-0011',
    transactionNo: 'TRX-2026-9174',
    approvalType: 'Rotasi Personel',
    requester: 'Nur Aziz',
    submittedDate: '3 Feb 2026',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'JAN-2026-0011',
    transactionNo: 'TRX-2026-2424',
    approvalType: 'Relokasi',
    requester: 'Christian',
    submittedDate: '30 Jan 2026',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'NOV-2026-0011',
    transactionNo: 'TRX-2026-4527',
    approvalType: 'Rotasi Personel',
    requester: 'Yeremiah',
    submittedDate: '27 Nov 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'OKT-2026-0011',
    transactionNo: 'TRX-2025-2845',
    approvalType: 'Perpindahan Outlet',
    requester: 'Mando Gunawan',
    submittedDate: '10 Okt 2025',
    description: 'Perpindahan Apotek Abadi ke Rayon Jakarta Pusat',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'SEP-2025-0011',
    transactionNo: 'TRX-2025-4241',
    approvalType: 'Rotasi Personel',
    requester: 'Ridow Kantana',
    submittedDate: '18 Sep 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'AGU-2025-0014',
    transactionNo: 'TRX-2025-3312',
    approvalType: 'MCL',
    requester: 'Dewi Anggraini',
    submittedDate: '9 Agu 2025',
    description: 'MCL Triwulan III (Juli - September 2025) - DM Dewi Anggraini',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'AGU-2025-0009',
    transactionNo: 'TRX-2025-2987',
    approvalType: 'ED Khusus',
    requester: 'Rizal Fahmi',
    submittedDate: '2 Agu 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'JUL-2025-0022',
    transactionNo: 'TRX-2025-2765',
    approvalType: 'Rencana Visit Mingguan',
    requester: 'Siti Rahayu',
    submittedDate: '28 Jul 2025',
    description: 'Visit Mingguan Periode 21-26 Juli 2025 - MR Siti Rahayu',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'JUL-2025-0015',
    transactionNo: 'TRX-2025-2410',
    approvalType: 'Relokasi',
    requester: 'Bambang Setiawan',
    submittedDate: '14 Jul 2025',
    description: 'Perpindahan outlet Apotek Sentosa ke Rayon Bekasi',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'JUN-2025-0031',
    transactionNo: 'TRX-2025-2098',
    approvalType: 'Rotasi Personel',
    requester: 'Hendra Wijaya',
    submittedDate: '25 Jun 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'JUN-2025-0018',
    transactionNo: 'TRX-2025-1876',
    approvalType: 'Perpindahan Outlet',
    requester: 'Melati Putri',
    submittedDate: '11 Jun 2025',
    description: 'Perpindahan outlet Apotek Sejahtera ke Rayon Tangerang',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'MEI-2025-0027',
    transactionNo: 'TRX-2025-1654',
    approvalType: 'MCL',
    requester: 'Agus Salim',
    submittedDate: '30 Mei 2025',
    description: 'MCL Triwulan II (April - Juni 2025) - DM Agus Salim',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'MEI-2025-0012',
    transactionNo: 'TRX-2025-1432',
    approvalType: 'ED Khusus',
    requester: 'Nadia Kusuma',
    submittedDate: '16 Mei 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'APR-2025-0029',
    transactionNo: 'TRX-2025-1287',
    approvalType: 'Rencana Visit Mingguan',
    requester: 'Fajar Ramadhan',
    submittedDate: '22 Apr 2025',
    description: 'Visit Mingguan Periode 15-20 April 2025 - MR Fajar Ramadhan',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'APR-2025-0016',
    transactionNo: 'TRX-2025-1103',
    approvalType: 'Rotasi Personel',
    requester: 'Wulan Sari',
    submittedDate: '8 Apr 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'MAR-2025-0024',
    transactionNo: 'TRX-2025-0982',
    approvalType: 'Relokasi',
    requester: 'Dimas Prasetyo',
    submittedDate: '26 Mar 2025',
    description: 'Perpindahan outlet Apotek Harapan ke Rayon Depok',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'MAR-2025-0011',
    transactionNo: 'TRX-2025-0765',
    approvalType: 'Perpindahan Outlet',
    requester: 'Ayu Lestari',
    submittedDate: '12 Mar 2025',
    description: 'Perpindahan outlet Apotek Mulia ke Rayon Bogor',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'FEB-2025-0033',
    transactionNo: 'TRX-2025-0621',
    approvalType: 'MCL',
    requester: 'Reza Pratama',
    submittedDate: '24 Feb 2025',
    description: 'MCL Triwulan I (Januari - Maret 2025) - DM Reza Pratama',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'FEB-2025-0019',
    transactionNo: 'TRX-2025-0487',
    approvalType: 'ED Khusus',
    requester: 'Indah Permata',
    submittedDate: '10 Feb 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'JAN-2025-0026',
    transactionNo: 'TRX-2025-0342',
    approvalType: 'Rencana Visit Mingguan',
    requester: 'Taufik Hidayat',
    submittedDate: '27 Jan 2025',
    description: 'Visit Mingguan Periode 20-25 Januari 2025 - MR Taufik Hidayat',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'JAN-2025-0013',
    transactionNo: 'TRX-2025-0198',
    approvalType: 'Rotasi Personel',
    requester: 'Sri Wahyuni',
    submittedDate: '13 Jan 2025',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'PENDING',
  },
  {
    approvalNo: 'DES-2024-0038',
    transactionNo: 'TRX-2024-9876',
    approvalType: 'Relokasi',
    requester: 'Rudi Hartono',
    submittedDate: '29 Des 2024',
    description: 'Perpindahan outlet Apotek Bahagia ke Rayon Bandung',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'DES-2024-0021',
    transactionNo: 'TRX-2024-9654',
    approvalType: 'Perpindahan Outlet',
    requester: 'Fitriani',
    submittedDate: '15 Des 2024',
    description: 'Perpindahan outlet Apotek Sentral ke Rayon Cimahi',
    approvalStatus: 'REJECTED',
  },
  {
    approvalNo: 'NOV-2024-0035',
    transactionNo: 'TRX-2024-9432',
    approvalType: 'MCL',
    requester: 'Gilang Ramadhan',
    submittedDate: '28 Nov 2024',
    description: 'MCL Triwulan IV (Oktober - Desember 2024) - DM Gilang Ramadhan',
    approvalStatus: 'APPROVED',
  },
  {
    approvalNo: 'NOV-2024-0020',
    transactionNo: 'TRX-2024-9187',
    approvalType: 'ED Khusus',
    requester: 'Putri Ayu',
    submittedDate: '14 Nov 2024',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus non eros ut porta.',
    approvalStatus: 'PENDING',
  },
])

function handleView(row: { approvalNo: string }) {
  router.push(`/app/approvals/${row.approvalNo}`)
}

const statusFilter = ref<string | null>(null)
const searchQuery = ref('')
const typeFilter = ref<string | null>(null)

const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return approvals.value.filter((item) => {
    const matchesStatus = statusFilter.value === null || item.approvalStatus === statusFilter.value
    const matchesSearch =
      !query ||
      item.approvalNo.toLowerCase().includes(query) ||
      item.requester.toLowerCase().includes(query)

    const matchesType = !typeFilter.value || item.approvalType === typeFilter.value
    return matchesStatus && matchesSearch && matchesType
  })
})
</script>

<template>
  <AppHeader
    title="Approval"
    subtitle="Kelola dan tinjau semua pengajuan persetujuan"
    max-width="max-w-8xl"
  >
    <div class="flex flex-col gap-4">
      <ApprovalFilter
        v-model:status="statusFilter"
        v-model:search="searchQuery"
        v-model:type="typeFilter"
        :data="approvals"
      />

      <ApprovalList :data="filteredData" @view="handleView" />
    </div>
  </AppHeader>
</template>
