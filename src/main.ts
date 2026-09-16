import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import KeyFilter from 'primevue/keyfilter'

const app = createApp(App)

// Tailwind dan Prime Vue sama sama menghasiljan CSS. browser membaca dari atas ke bawah.
// masalahnya tidak bisa memastikan file CSS mana yg di-load duluan, dan mana yg belakangan karena Tailwind dan Vue di generate secara otomatis
// jadi perlu diatur secara manual urutan CSS nya agar tidak bentrok.

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-theme, tailwind-base, primevue, tailwind-utilities',
      }, // bungkus semua css milik primeVue ke dalam layer bernama primevue
      // tailwind-base -> reset dasar dari Tailwind
      // primevue -> css milik primeVue
      // tailwind-utilities -> css milik Tailwind yang bersifat utilities, ini yang paling kuat
    },
  },
})
app.use(createPinia())
app.use(router)
app.use(DialogService)
app.use(ConfirmationService)
app.use(ToastService)

app.directive('keyfilter', KeyFilter)

app.mount('#app')
