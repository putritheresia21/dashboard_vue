interface DetailVisit {
  mr: number
  spv: number
  dm: number
  shift: 'Pagi' | 'Siang' | 'Malam'
}

interface Visitor {
  user: string
  role: string
  outlet?: string
  tipe?: string
  detailVisit: DetailVisit
  salesOutlet: number
  salesUser?: number
  hijau?: boolean
}

interface Outlets {
  name: string
  type: string
  visitor: Visitor[]
}

export const visitorList: Visitor[] = [
  {
    user: 'Juljul',
    role: 'Dokter Umum',
    outlet: 'RS Mitra Mitraan',
    tipe: 'RS',
    detailVisit: {
      mr: 3,
      spv: 1,
      dm: 1,
      shift: 'Siang',
    },
    salesUser: 214000000,
    salesOutlet: 540000000,
    hijau: true,
  },
  {
    user: 'Andi',
    role: 'Dokter Spesialis',
    outlet: 'RS Hermina Sejahtera',
    tipe: 'RS',
    detailVisit: {
      mr: 5,
      spv: 2,
      dm: 1,
      shift: 'Pagi',
    },
    salesUser: 185000000,
    salesOutlet: 620000000,
  },
  {
    user: 'Sinta',
    role: 'Apoteker',
    outlet: 'Apotek Sehat Sentosa',
    tipe: 'Apotek',
    detailVisit: {
      mr: 4,
      spv: 1,
      dm: 2,
      shift: 'Siang',
    },
    salesOutlet: 385000000,
    hijau: true,
  },
  {
    user: 'Budi',
    role: 'Dokter Umum',
    outlet: 'Klinik Pratama Medika',
    tipe: 'Klinik',
    detailVisit: {
      mr: 2,
      spv: 1,
      dm: 1,
      shift: 'Siang',
    },
    salesUser: 98000000,
    salesOutlet: 275000000,
  },
  {
    user: 'Rina',
    role: 'Dokter Spesialis',
    outlet: 'RS Bina Kasih',
    tipe: 'RS',
    detailVisit: {
      mr: 6,
      spv: 2,
      dm: 2,
      shift: 'Pagi',
    },
    salesOutlet: 710000000,
    hijau: true,
  },
  {
    user: 'Doni',
    role: 'Apoteker',
    outlet: 'Apotek Karya Medika',
    tipe: 'Apotek',
    detailVisit: {
      mr: 3,
      spv: 1,
      dm: 1,
      shift: 'Siang',
    },
    salesUser: 127000000,
    salesOutlet: 340000000,
  },
  {
    user: 'Maya',
    role: 'Dokter Umum',
    outlet: 'Klinik Sehat Bersama',
    tipe: 'Klinik',
    detailVisit: {
      mr: 4,
      spv: 2,
      dm: 1,
      shift: 'Malam',
    },
    salesUser: 173000000,
    salesOutlet: 425000000,
    hijau: true,
  },
]

export const outlets: Outlets[] = [
  {
    name: 'Rumah Sakit Cipto Mangunkusumo',
    type: 'RS',
    visitor: [
      {
        user: 'Budi Budian',
        role: 'Apoteker',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 425000000,
        salesUser: 425000000,
        hijau: true,
      },
      {
        user: 'Budi Biduan',
        role: 'Kasir',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 425000000,
        salesUser: 425000000,
      },
      {
        user: 'Rifka',
        role: 'Gudang',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 410000000,
        salesUser: 410000000,
      },
    ],
  },

  {
    name: 'Rsi Harapan Sejahtera',
    type: 'RS',
    visitor: [
      {
        user: 'Andi Saputra',
        role: 'Apoteker',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Pagi',
        },
        salesOutlet: 385000000,
        salesUser: 385000000,
        hijau: true,
      },
    ],
  },

  {
    name: 'RS Muhammadiyah Singkil',
    type: 'RS',
    visitor: [
      {
        user: 'Siti Rahma',
        role: 'Apoteker',
        detailVisit: {
          mr: 4,
          spv: 1,
          dm: 2,
          shift: 'Pagi',
        },
        salesOutlet: 350000000,
        salesUser: 350000000,
        hijau: true,
      },
    ],
  },

  {
    name: 'RS Umum Brebes',
    type: 'RS',
    visitor: [
      {
        user: 'Dimas Pratama',
        role: 'Apoteker',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Malam',
        },
        salesOutlet: 315000000,
        salesUser: 315000000,
      },
    ],
  },

  {
    name: 'Apt Benmari Puskesmas Tegal Barat',
    type: 'Apotek',
    visitor: [
      {
        user: 'Fajar Nugroho',
        role: 'Apotek',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Pagi',
        },
        salesOutlet: 275000000,
        salesUser: 275000000,
        hijau: true,
      },
    ],
  },

  {
    name: 'Apt Kapt Ismail',
    type: 'Apotek',
    visitor: [
      {
        user: 'Maya Sari',
        role: 'Apotek',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 240000000,
        salesUser: 240000000,
      },
    ],
  },

  {
    name: 'RS Bhakti Husada',
    type: 'RS',
    visitor: [
      {
        user: 'Rina Wulandari',
        role: 'Apoteker',
        detailVisit: {
          mr: 3,
          spv: 2,
          dm: 1,
          shift: 'Pagi',
        },
        salesOutlet: 395000000,
        salesUser: 395000000,
        hijau: true,
      },
      {
        user: 'Agus Setiawan',
        role: 'Kasir',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 395000000,
      },
    ],
  },

  {
    name: 'RS Kartini Tegal',
    type: 'RS',
    visitor: [
      {
        user: 'Nadia Putri',
        role: 'Apoteker',
        detailVisit: {
          mr: 4,
          spv: 1,
          dm: 2,
          shift: 'Siang',
        },
        salesOutlet: 325000000,
        salesUser: 325000000,
        hijau: true,
      },
      {
        user: 'Yoga Ramadhan',
        role: 'Gudang',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Malam',
        },
        salesOutlet: 320000000,
        salesUser: 320000000,
      },
    ],
  },

  {
    name: 'Apt Sehat Farma',
    type: 'Apotek',
    visitor: [
      {
        user: 'Dewi Anggraini',
        role: 'Apotek',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Pagi',
        },
        salesOutlet: 185000000,
        salesUser: 185000000,
        hijau: true,
      },
      {
        user: 'Bayu Kurniawan',
        role: 'Kasir',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 180000000,
      },
    ],
  },

  {
    name: 'Apt Kimia Sejahtera',
    type: 'Apotek',
    visitor: [
      {
        user: 'Lina Marlina',
        role: 'Apotek',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Pagi',
        },
        salesOutlet: 165000000,
        salesUser: 165000000,
      },
    ],
  },

  {
    name: 'RS Islam Al Ikhlas',
    type: 'RS',
    visitor: [
      {
        user: 'Hendra Wijaya',
        role: 'Apoteker',
        detailVisit: {
          mr: 5,
          spv: 2,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 450000000,
        salesUser: 450000000,
        hijau: true,
      },
    ],
  },

  {
    name: 'RSUD Kabupaten Tegal',
    type: 'RS',
    visitor: [
      {
        user: 'Putri Lestari',
        role: 'Apoteker',
        detailVisit: {
          mr: 4,
          spv: 2,
          dm: 2,
          shift: 'Pagi',
        },
        salesOutlet: 475000000,
        salesUser: 475000000,
        hijau: true,
      },
      {
        user: 'Arif Hidayat',
        role: 'Gudang',
        detailVisit: {
          mr: 3,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 470000000,
      },
      {
        user: 'Salsa Amelia',
        role: 'Kasir',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Malam',
        },
        salesOutlet: 465000000,
      },
    ],
  },

  {
    name: 'Apt Mitra Medika',
    type: 'Apotek',
    visitor: [
      {
        user: 'Rizky Maulana',
        role: 'Apotek',
        detailVisit: {
          mr: 2,
          spv: 1,
          dm: 1,
          shift: 'Siang',
        },
        salesOutlet: 215000000,
        salesUser: 215000000,
        hijau: true,
      },
    ],
  },
]
