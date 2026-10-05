type VisitStatus = 'visited' | 'pending' | 'empty' | 'planned'

interface Visit {
  date: string
  day: string
  status: VisitStatus
}

interface VisitData {
  name: string
  outlet: string
  shift: 'Siang' | 'Malam'
  role: 'Dokter Umum' | 'Apoteker'
  type: 'RS'
  quota: string
  salesUser: number | null
  salesOutlet: number
  schedules: Visit[]
}

export const mockVisits: VisitData[] = [
  {
    name: 'John',
    outlet: 'RS Mitra Sana',
    shift: 'Siang',
    role: 'Dokter Umum',
    type: 'RS',
    quota: '2/3',
    salesUser: 310000,
    salesOutlet: 485000,
    schedules: [
      { date: '29', day: 'SEN', status: 'visited' },
      { date: '30', day: 'SEL', status: 'pending' },
      { date: '01', day: 'RAB', status: 'visited' },
      { date: '02', day: 'KAM', status: 'visited' },
      { date: '03', day: 'JUM', status: 'empty' },
      { date: '04', day: 'SAB', status: 'visited' },
    ],
  },

  {
    name: 'Budi Fomo',
    outlet: 'RS Ciptaan',
    shift: 'Siang',
    role: 'Apoteker',
    type: 'RS',
    quota: '2/3',
    salesUser: 310000,
    salesOutlet: 485000,
    schedules: [
      { date: '29', day: 'SEN', status: 'empty' },
      { date: '30', day: 'SEL', status: 'visited' },
      { date: '01', day: 'RAB', status: 'empty' },
      { date: '02', day: 'KAM', status: 'visited' },
      { date: '03', day: 'JUM', status: 'empty' },
      { date: '04', day: 'SAB', status: 'empty' },
    ],
  },

  {
    name: 'Andi S',
    outlet: 'RS Griya Griyaan',
    shift: 'Malam',
    role: 'Dokter Umum',
    type: 'RS',
    quota: '2/3',
    salesUser: null,
    salesOutlet: 425000,
    schedules: [
      { date: '29', day: 'SEN', status: 'visited' },
      { date: '30', day: 'SEL', status: 'empty' },
      { date: '01', day: 'RAB', status: 'planned' },
      { date: '02', day: 'KAM', status: 'empty' },
      { date: '03', day: 'JUM', status: 'planned' },
      { date: '04', day: 'SAB', status: 'empty' },
    ],
  },

  {
    name: 'Budi',
    outlet: 'RS Mitra Orang',
    shift: 'Siang',
    role: 'Dokter Umum',
    type: 'RS',
    quota: '2/3',
    salesUser: null,
    salesOutlet: 425000,
    schedules: [
      { date: '29', day: 'SEN', status: 'pending' },
      { date: '30', day: 'SEL', status: 'visited' },
      { date: '01', day: 'RAB', status: 'empty' },
      { date: '02', day: 'KAM', status: 'pending' },
      { date: '03', day: 'JUM', status: 'visited' },
      { date: '04', day: 'SAB', status: 'pending' },
    ],
  },
]
