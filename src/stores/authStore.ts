import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthRequest, User } from '@/dummy/userData'
import { getAuthenticate } from '@/dummy/userData'

type GeneralIdentity = Omit<User, 'password'>

const roles = ['dm', 'sm', 'mr'] as const
type Role = (typeof roles)[number]

const roleLabels: Record<Role, string> = {
  dm: 'dm',
  sm: 'sm',
  mr: 'mr',
}

export const useAuthStore = defineStore('auth', () => {
  // Mengambil data dari localStorage saat aplikasi pertama kali dimuat
  const temp = localStorage.getItem('user')
  const user = ref<GeneralIdentity | null>(temp ? JSON.parse(temp) : null)
  const expiresAt = ref(localStorage.getItem('expiresAt') || null)

  const savedRole = localStorage.getItem('role') as Role | null
  const role = ref<Role>(savedRole && roles.includes(savedRole) ? savedRole : 'dm')

  // Cek apakah user valid: Data user ada DAN waktu saat ini belum melewati expiresAt
  const isAuthenticated = computed(() => !!user.value)

  const switchRole = (newRole: Role) => {
    role.value = newRole
    localStorage.setItem('role', newRole)
  }

  const login = async (credentials: AuthRequest) => {
    // Pastikan axios dikonfigurasi untuk menerima cookie
    // axios.defaults.withCredentials = true;

    //   const response = await axios.post('/api/login', credentials) //logika untuk login

    const authResponse = getAuthenticate(credentials)

    if (!authResponse) {
      throw new Error('Username atau password salah!')
    }

    // 1. Simpan ke State Pinia
    user.value = {
      nik: authResponse.nik,
      name: authResponse.name,
    }
    expiresAt.value = authResponse.expired

    // 2. Simpan ke Local Storage untuk persistensi saat refresh
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('expiresAt', expiresAt.value)

    return true
  }

  const logout = async () => {
    try {
      // Opsional: Beritahu backend untuk menghapus HttpOnly cookie di sisi server
    } catch (error) {
      console.log('Logout API gagal, tapi tetap hapus sesi di frontend')
    } finally {
      // 1. Bersihkan State Pinia
      user.value = null
      expiresAt.value = null

      // 2. Bersihkan Local Storage
      localStorage.removeItem('user')
      localStorage.removeItem('expiresAt')
    }
  }

  // Fungsi utilitas untuk mengecek dan membersihkan sesi jika sudah expired
  const checkSession = () => {
    if (expiresAt.value) {
      const now = new Date().getTime()
      const expiryTime = new Date(expiresAt.value).getTime()

      if (now > expiryTime) {
        // Waktu habis, paksa logout lokal
        user.value = null
        expiresAt.value = null
        localStorage.removeItem('user')
        localStorage.removeItem('expiresAt')
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkSession,
    role,
    roles,
    roleLabels,
    switchRole,
  }
})
