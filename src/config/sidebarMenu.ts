import approvalIcon from '@/assets/icons/approval.svg'
import calendarIcon from '@/assets/icons/calendar.svg'
import checklistIcon from '@/assets/icons/checklist.svg'
import docklightIcon from '@/assets/icons/docklight.svg'
import laporanIcon from '@/assets/icons/laporan.svg'
import locationIcon from '@/assets/icons/location.svg'
import masterIcon from '@/assets/icons/master.svg'
import pengajuanIcon from '@/assets/icons/pengajuan.svg'
import personIcon from '@/assets/icons/person.svg'
import refreshIcon from '@/assets/icons/refresh.svg'
import transaksiIcon from '@/assets/icons/transaksi.svg'
import visitIcon from '@/assets/icons/visit.svg'

export interface SidebarChild {
  label: string
  to: string
  icon?: string
  iconBg?: string
  tag?: string
}

export interface SidebarMenuItem {
  label: string
  icon: string
  parentRoute: string
  children: SidebarChild[]
}

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: 'Visit',
    icon: visitIcon,
    parentRoute: '/aplikasi/visit',
    children: [
      {
        label: 'Check In / Out',
        to: '/aplikasi/visit/check-in-out',
        icon: locationIcon,
        iconBg: 'bg-blue-100',
        tag: 'SERING',
      },
      {
        label: 'Rencana Visit Mingguan',
        to: '/aplikasi/visit/rencana-mingguan',
        icon: calendarIcon,
        iconBg: 'bg-blue-100',
      },
      {
        label: 'MCL - Master Call List',
        to: '/aplikasi/visit/mcl',
        icon: personIcon,
        iconBg: 'bg-blue-100',
      },
      {
        label: 'Aktivitas Visit',
        to: '/aplikasi/visit/aktivitas',
        icon: checklistIcon,
        iconBg: 'bg-blue-100',
      },
      {
        label: 'Registrasi Konsumen',
        to: '/aplikasi/visit/registrasi-konsumen',
        icon: docklightIcon,
        iconBg: 'bg-blue-100',
      },
      {
        label: 'Pengkinian Data Konsumen',
        to: '/aplikasi/visit/update-konsumen',
        icon: refreshIcon,
        iconBg: 'bg-blue-100',
      },
    ],
  },
  {
    label: 'Transaksi',
    icon: transaksiIcon,
    parentRoute: '/aplikasi/transaksi',
    children: [{ label: 'Semua Transaksi', to: '/aplikasi/transaksi' }],
  },
  {
    label: 'Approval',
    icon: approvalIcon,
    parentRoute: '/aplikasi/approval',
    children: [{ label: 'List Approval', to: '/aplikasi/approval' }],
  },
  {
    label: 'Laporan',
    icon: laporanIcon,
    parentRoute: '/aplikasi/laporan',
    children: [{ label: 'Semua Laporan', to: '/aplikasi/laporan' }],
  },
  {
    label: 'Master',
    icon: masterIcon,
    parentRoute: '/aplikasi/master',
    children: [{ label: 'Data Master', to: '/aplikasi/master' }],
  },
  {
    label: 'Pengajuan',
    icon: pengajuanIcon,
    parentRoute: '/aplikasi/pengajuan',
    children: [{ label: 'Pengajuan', to: '/aplikasi/pengajuan' }],
  },
]
