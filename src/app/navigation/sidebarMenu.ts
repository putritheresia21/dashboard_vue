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
    parentRoute: '/app/visits',
    children: [
      {
        label: 'Check In / Out',
        to: '/app/visits/check-in-out',
        icon: locationIcon,
        tag: 'SERING',
      },
      {
        label: 'Rencana Visit Mingguan',
        to: '/app/visits/weekly-plan',
        icon: calendarIcon,
      },
      {
        label: 'MCL - Master Call List',
        to: '/app/visits/master-call-list',
        icon: personIcon,
      },
      {
        label: 'Aktivitas Visit',
        to: '/app/visits/aktivitas',
        icon: checklistIcon,
      },
      {
        label: 'Registrasi Konsumen',
        to: '/app/visits/registrasi-konsumen',
        icon: docklightIcon,
      },
      {
        label: 'Pengkinian Data Konsumen',
        to: '/app/visits/update-konsumen',
        icon: refreshIcon,
      },
    ],
  },
  {
    label: 'Transaksi',
    icon: transaksiIcon,
    parentRoute: '/app/transaksi',
    children: [{ label: 'Semua Transaksi', to: '/app/transaksi' }],
  },
  {
    label: 'Approval',
    icon: approvalIcon,
    parentRoute: '/app/approval',
    children: [{ label: 'List Approval', to: '/app/approval' }],
  },
  {
    label: 'Laporan',
    icon: laporanIcon,
    parentRoute: '/app/laporan',
    children: [{ label: 'Semua Laporan', to: '/app/laporan' }],
  },
  {
    label: 'Master',
    icon: masterIcon,
    parentRoute: '/app/master',
    children: [{ label: 'Data Master', to: '/app/master' }],
  },
  {
    label: 'Pengajuan',
    icon: pengajuanIcon,
    parentRoute: '/app/pengajuan',
    children: [{ label: 'Pengajuan', to: '/app/pengajuan' }],
  },
]
