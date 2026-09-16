export interface User {
  nik: string
  name: string
  password: string
}

const users: User[] = [
  {
    nik: '1000001',
    name: 'Ahmad Fauzi',
    password: 'password123',
  },
  {
    nik: '1000002',
    name: 'Siti Rahmawati',
    password: 'password456',
  },
  {
    nik: '1000003',
    name: 'Budi Santoso',
    password: 'password123',
  },
  {
    nik: '1000004',
    name: 'Dewi Lestari',
    password: 'password123',
  },
  {
    nik: '1000005',
    name: 'Eko Prasetyo',
    password: 'password123',
  },
]

// Tipe baru hanya berisi 'nik' dan 'password'
export type AuthRequest = Pick<User, 'nik' | 'password'>

export type AuthResponse = Omit<User, 'password'> & {
  expired: string
}

export function getAuthenticate(userInput: AuthRequest): AuthResponse | null {
  const user = users.find((user) => user.nik === userInput.nik)
  if (user?.password !== userInput.password) {
    return null
  }

  // 3. Kalkulasi tanggal (1 hari dari sekarang) yang lebih mudah dibaca
  const expiredDate = new Date()
  expiredDate.setDate(expiredDate.getDate() + 1)

  return {
    nik: user.nik,
    name: user.name,
    expired: expiredDate.toISOString(),
  }
}
