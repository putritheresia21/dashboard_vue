import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
// import { useToast } from 'primevue'
import router from '@/router'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// menambahkan logika penghapusan sesi jika server menjawab unauthorized
// Tambahkan interceptor untuk menangkap response error secara global
api.interceptors.response.use(
  (response) => {
    // Jika request berhasil (status 2xx), lanjutkan saja responsenya
    return response
  },
  (error) => {
    // Pastikan error.response ada (menghindari error aplikasi crash jika server mati / network error)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()

      // 2. Redirect ke halaman login
      router.push('/login')

      // toast.add({
      //   severity: 'error',
      //   summary: 'Peringatan',
      //   detail: 'Sesi anda telah berakhir, harap login kembali',
      //   life: 3000,
      // })
    }

    // Kembalikan error agar tetap bisa ditangkap oleh blok .catch() di tempat lain jika diperlukan
    return Promise.reject(error)
  },
)
