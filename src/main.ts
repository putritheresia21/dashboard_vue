import './assets/main.css'
import '@bernofarm/core/style.css'
import '@bernofarm/shell/style.css'
import 'primeicons/primeicons.css'

import {
  configureBernofarm,
  ConfirmationService as BernofarmConfirmationService,
  KeyFilter as BernofarmKeyFilter,
  ToastService as BernofarmToastService,
} from '@bernofarm/core'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import { createApp, type Directive, type Plugin } from 'vue'

import App from './App.vue'
import bernofarmTheme from './app/config/theme'
import router from './app/router'

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
app.use(BernofarmToastService as unknown as Plugin)
app.use(BernofarmConfirmationService as unknown as Plugin)

configureBernofarm(bernofarmTheme)

app.directive('keyfilter', BernofarmKeyFilter as unknown as Directive)

app.mount('#app')
