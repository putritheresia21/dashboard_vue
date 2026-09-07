export interface TargetHistoryEntry {
  month: string
  target: number
  achieved: number
}

export interface ProductSold {
  name: string
  category: string
  qty: number
  revenue: number
}

export interface SalesPerson {
  id: number
  name: string
  email: string
  avatar: string
  target: number
  achieved: number
  commission: number
  status: 'Top Performer' | 'On Track' | 'Below Target'
  department: string
  city: string
  phone: string
  birthDate: string
  joinDate: string
  address: string
  targetHistory: TargetHistoryEntry[]
  products: ProductSold[]
}

const avatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff`

//generator riwayat target
function generateTargetHistory(
  seed: number,
  target: number,
  acvieved: number,
): TargetHistoryEntry[] {
  const months = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep']
  return months.map((m, i) => {
    const variance = 0.75 + ((seed * (i + 3)) % 10) / 20
    const isLast = i === months.length - 1
    return {
      month: `${m} 2026`,
      target: Math.round((target * (0.85 + i * 0.03)) / 1000) * 1000,
      achieved: isLast
        ? acvieved
        : Math.round((acvieved * variance * (0.8 + i * 0.04)) / 1000) * 1000,
    }
  })
}

const productCatalog = [
  { name: 'Smart Watch Pro', category: 'Elektronik' },
  { name: 'Wireless Earbuds X2', category: 'Elektronik' },
  { name: 'Office Chair Ergonomic', category: 'Furnitur' },
  { name: 'Standing Desk Adjustable', category: 'Furnitur' },
  { name: 'Laptop Sleeve 14"', category: 'Aksesoris' },
  { name: 'Bluetooth Speaker Mini', category: 'Elektronik' },
  { name: 'Ergonomic Keyboard', category: 'Aksesoris' },
  { name: 'LED Desk Lamp', category: 'Furnitur' },
]

function pickProduct(index: number): {
  name: string
  category: string
} {
  const wrapped = ((index % productCatalog.length) + productCatalog.length) % productCatalog.length
  return productCatalog[wrapped]!
}

function generateProducts(seed: number, totalRevenue: number): ProductSold[] {
  const count = 3 + (seed % 2)
  const picked: { name: string; category: string }[] = Array.from({ length: count }, (_, i) =>
    pickProduct(seed + i * 2),
  )
  const weights: number[] = picked.map((_, i) => 1 + ((seed + i) % 3))
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  return picked.map((p, i) => {
    const weight = weights[i] ?? 1
    const revenue = Math.round((totalRevenue * weight) / totalWeight / 1000) * 1000
    const avgPrice = 250000 + ((seed + i * 7) % 6) * 150000
    return {
      name: p?.name,
      category: p?.category,
      qty: Math.max(1, Math.round(revenue / avgPrice)),
      revenue,
    }
  })
}

interface RawPerson {
  id: number
  name: string
  email: string
  target: number
  achieved: number
  commission: number
  status: SalesPerson['status']
  department: string
  city: string
  phone: string
  birthDate: string
  joinDate: string
  address: string
}

const rawData: RawPerson[] = [
  {
    id: 1,
    name: 'Elwin Sharvill',
    email: 'elwin.s@email.com',
    target: 20000000,
    achieved: 24500000,
    commission: 1225000,
    status: 'Top Performer',
    department: 'Corporate Sales',
    city: 'Jakarta',
    phone: '0812-3456-7890',
    birthDate: '1994-03-12',
    joinDate: '2021-06-01',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
  },
  {
    id: 2,
    name: 'Amy Elsner',
    email: 'amy.elsner@gmail.com',
    target: 18000000,
    achieved: 19200000,
    commission: 960000,
    status: 'On Track',
    department: 'Retail Sales',
    city: 'Surabaya',
    phone: '0813-2211-4455',
    birthDate: '1996-07-24',
    joinDate: '2022-01-10',
    address: 'Jl. Diponegoro No. 12, Surabaya',
  },
  {
    id: 3,
    name: 'Bernardo Dominic',
    email: 'bernardo.d@email.com',
    target: 15000000,
    achieved: 10800000,
    commission: 540000,
    status: 'Below Target',
    department: 'Retail Sales',
    city: 'Bandung',
    phone: '0821-6677-8899',
    birthDate: '1990-11-02',
    joinDate: '2019-09-15',
    address: 'Jl. Asia Afrika No. 8, Bandung',
  },
  {
    id: 4,
    name: 'Anna Fali',
    email: 'anna.dali@gmail.com',
    target: 16000000,
    achieved: 17650000,
    commission: 882500,
    status: 'On Track',
    department: 'Online Sales',
    city: 'Jakarta',
    phone: '0857-1122-3344',
    birthDate: '1997-02-18',
    joinDate: '2023-03-20',
    address: 'Jl. Gatot Subroto No. 21, Jakarta',
  },
  {
    id: 5,
    name: 'Asiya Javayant',
    email: 'asiya.j@email.com',
    target: 14000000,
    achieved: 9200000,
    commission: 460000,
    status: 'Below Target',
    department: 'Online Sales',
    city: 'Semarang',
    phone: '0878-9900-1122',
    birthDate: '1998-05-30',
    joinDate: '2023-08-05',
    address: 'Jl. Pandanaran No. 5, Semarang',
  },
  {
    id: 6,
    name: 'Rizky Pratama',
    email: 'rizky.p@email.com',
    target: 22000000,
    achieved: 26400000,
    commission: 1320000,
    status: 'Top Performer',
    department: 'Corporate Sales',
    city: 'Jakarta',
    phone: '0812-0099-8877',
    birthDate: '1993-09-09',
    joinDate: '2020-02-14',
    address: 'Jl. Rasuna Said No. 33, Jakarta',
  },
  {
    id: 7,
    name: 'Dewi Anggraini',
    email: 'dewi.a@email.com',
    target: 17000000,
    achieved: 17850000,
    commission: 892500,
    status: 'On Track',
    department: 'Field Sales',
    city: 'Yogyakarta',
    phone: '0815-4433-2211',
    birthDate: '1995-12-01',
    joinDate: '2021-11-11',
    address: 'Jl. Malioboro No. 60, Yogyakarta',
  },
  {
    id: 8,
    name: 'Fahri Ramadhan',
    email: 'fahri.r@email.com',
    target: 19000000,
    achieved: 13300000,
    commission: 665000,
    status: 'Below Target',
    department: 'Field Sales',
    city: 'Medan',
    phone: '0822-5566-7788',
    birthDate: '1992-04-27',
    joinDate: '2018-05-01',
    address: 'Jl. Gatot Subroto No. 90, Medan',
  },
  {
    id: 9,
    name: 'Siti Nurhaliza',
    email: 'siti.n@email.com',
    target: 21000000,
    achieved: 25900000,
    commission: 1295000,
    status: 'Top Performer',
    department: 'Corporate Sales',
    city: 'Surabaya',
    phone: '0838-1234-5678',
    birthDate: '1994-08-15',
    joinDate: '2020-10-19',
    address: 'Jl. Basuki Rahmat No. 3, Surabaya',
  },
  {
    id: 10,
    name: 'Budi Santoso',
    email: 'budi.s@email.com',
    target: 16500000,
    achieved: 12100000,
    commission: 605000,
    status: 'Below Target',
    department: 'Retail Sales',
    city: 'Bandung',
    phone: '0819-8877-6655',
    birthDate: '1991-01-22',
    joinDate: '2019-04-08',
    address: 'Jl. Dago No. 77, Bandung',
  },
  {
    id: 11,
    name: 'Maria Christina',
    email: 'maria.c@email.com',
    target: 18500000,
    achieved: 19000000,
    commission: 950000,
    status: 'On Track',
    department: 'Online Sales',
    city: 'Jakarta',
    phone: '0856-3322-1100',
    birthDate: '1996-06-06',
    joinDate: '2022-07-25',
    address: 'Jl. Kemang Raya No. 14, Jakarta',
  },
  {
    id: 12,
    name: 'Yusuf Hakim',
    email: 'yusuf.h@email.com',
    target: 23000000,
    achieved: 28100000,
    commission: 1405000,
    status: 'Top Performer',
    department: 'Corporate Sales',
    city: 'Semarang',
    phone: '0811-2233-4400',
    birthDate: '1990-10-10',
    joinDate: '2017-12-01',
    address: 'Jl. Pahlawan No. 25, Semarang',
  },
  {
    id: 13,
    name: 'Putri Wulandari',
    email: 'putri.w@email.com',
    target: 15500000,
    achieved: 10200000,
    commission: 510000,
    status: 'Below Target',
    department: 'Field Sales',
    city: 'Yogyakarta',
    phone: '0877-6655-4433',
    birthDate: '1999-03-03',
    joinDate: '2024-01-15',
    address: 'Jl. Kaliurang No. 9, Yogyakarta',
  },
  {
    id: 14,
    name: 'Agus Setiawan',
    email: 'agus.s@email.com',
    target: 17500000,
    achieved: 18300000,
    commission: 915000,
    status: 'On Track',
    department: 'Retail Sales',
    city: 'Medan',
    phone: '0812-9988-7766',
    birthDate: '1993-07-19',
    joinDate: '2020-05-30',
    address: 'Jl. Sisingamangaraja No. 41, Medan',
  },
  {
    id: 15,
    name: 'Indah Permata',
    email: 'indah.p@email.com',
    target: 20500000,
    achieved: 24000000,
    commission: 1200000,
    status: 'Top Performer',
    department: 'Corporate Sales',
    city: 'Jakarta',
    phone: '0821-1100-2233',
    birthDate: '1995-11-28',
    joinDate: '2019-02-11',
    address: 'Jl. Thamrin No. 17, Jakarta',
  },
]

export const salesTeamData: SalesPerson[] = rawData.map((p) => ({
  ...p,
  avatar: avatarUrl(p.name),
  targetHistory: generateTargetHistory(p.id, p.target, p.achieved),
  products: generateProducts(p.id, p.achieved),
}))
