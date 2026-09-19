import type { Component } from 'vue'
import visitIcon from '@/assets/icons/visit.svg'
import transaksiIcon from '@/assets/icons/transaksi.svg'
import approvalIcon from '@/assets/icons/approval.svg'
import pengajuanIcon from '@/assets/icons/pengajuan.svg'
import masterIcon from '@/assets/icons/master.svg'
import laporanIcon from '@/assets/icons/laporan.svg'

export const sidebarMenu = [
  {
    label: 'Visit',
    icon: visitIcon,
    children: [
      { label: 'Check In / Out', to: '/aplikasi/visit/check-in-out' },
      { label: 'Rencana Visit Mingguan', to: '/aplikasi/visit/rencana-mingguan' },
      { label: 'MCL - Master Call List', to: '/aplikasi/visit/mcl' },
      { label: 'Aktivitas Visit', to: '/aplikasi/visit/aktivitas' },
      { label: 'Registrasi Konsumen', to: '/aplikasi/visit/registrasi-konsumen' },
      { label: 'Pengkinian Data Konsumen', to: '/aplikasi/visit/update-konsumen' },
    ],
  },
  {
    label: 'Transaksi',
    icon: transaksiIcon,
    children: [{ label: 'Semua Transaksi', to: '/aplikasi/transaksi' }],
  },
  {
    label: 'Approval',
    icon: approvalIcon,
    children: [{ label: 'List Approval', to: '/aplikasi/approval' }],
  },
  {
    label: 'Master',
    icon: masterIcon,
    children: [{ label: 'Data Master', to: '/aplikasi/master' }],
  },
  {
    label: 'Laporan',
    icon: laporanIcon,
    children: [{ label: 'Semua Laporan', to: '/aplikasi/laporan' }],
  },
]
