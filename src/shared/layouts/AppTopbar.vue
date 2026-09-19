<script setup lang="ts">
import { useRoute } from 'vue-router'
import Avatar from 'primevue/avatar'
import BellIcon from '@primeicons/vue/bell'
import ChevronDownIcon from '@primeicons/vue/chevron-down'
import Bars3Icon from '@primeicons/vue/bars'
import SearchIcon from '@primeicons/vue/search'
import Button from 'primevue/button'
import { Popover } from 'primevue'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import SearchInput from '@/components/SearchInput.vue'
import companyLogo from '@/assets/logo/logo-bernofarm.svg'

const route = useRoute()
const { user } = useAuthStore()

const tabs = [
  { label: 'Portal Perusahaan', to: '/' },
  { label: 'Aplikasi Saya', to: '/aplikasi' },
]

const search = ref('')

// mengatur notifikasi
// const opNotification = ref()
// const notifications = ref([
//   {
//     id: 1,
//     title: 'Upwork',
//     avatar: '/images/upwork.png',
//     message: 'Successfully purchased a Business Plan for ',
//     time: '1m',
//     unread: true,
//   },
//   {
//     id: 2,
//     title: 'Brandon Stanton',
//     avatar: '/images/brandon.jpg',
//     message: 'You have received money ',
//     time: '11m',
//     unread: true,
//   },
//   {
//     id: 3,
//     title: 'Gustavo Schleifer',
//     avatar: '/images/gustavo.jpg',
//     message: 'You have received money ',
//     amount: '+$5,129.00',
//     time: '12m',
//     unread: false,
//   },
// ])
</script>

<template>
  <header class="sticky top-0 z-10 bg-white h-15">
    <div
      class="flex items-center justify-between h-full pl-3 pr-2 lg:pl-6 lg:pr-12 gap-1.5 lg:gap-4"
    >
      <!--logo + nav (kiri)-->
      <div class="flex items-center gap-2 lg:gap-4 flex-shrink">
        <img :src="companyLogo" alt="" class="flex-shrink-0 h-10 lg:h-14 w-auto" />
        <nav class="hidden lg:flex items-center gap-6" style="margin-left: 14px">
          <router-link
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors"
            :class="
              route.path === tab.to
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent'
            "
          >
            {{ tab.label }}
          </router-link>
        </nav>
      </div>

      <!--serach + bell + avatar (kanan)-->
      <div class="flex items-center gap-2 lg:gap-4">
        <div class="w-40 sm:w-60 lg:w-64">
          <SearchInput v-model="search" placeholder="Cari..." variant="light" rounded="2xl" />
        </div>
        <div class="flex items-center gap-1 lg:gap-3 flex-shrink-0 ml-auto lg:ml-auto">
          <button
            class="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0"
          >
            <BellIcon size="18" color="#64748b" />
            <span class="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <div class="hidden sm:block text-right leading-tight">
            <p class="text-sm font-medium text-slate-800">{{ user?.name }}</p>
            <p class="text-xs text-slate-400">Sales Rep</p>
          </div>
          <Avatar
            :image="`https://ui-avatars.com/api/?name=${user?.name}&background=1d4ed8&color=fff`"
            shape="circle"
            class="w-8 h-8"
          />
        </div>
      </div>

      <!--Right-->
      <!-- <div class="flex items-center gap-3">
        <button
          @click="opNotification.toggle"
          class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <BellIcon size="18" color="#64748b" />
          <span
            class="absolute top-2 right-2.5 w-2 h-2 bg-teal-500 rounded-full ring2 ring-white animate-pulse"
          >
          </span>
        </button>

        <Popover ref="opNotification">
          <div class="w-87.5 sm:w-100 p-1">
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-bold text-gray-800">Notification</span>
              <Button label="Mark as read" text class="p-0 text-sm font-semibold text-blue-500" />
            </div>

            <div class="flex flex-col gap-5">
              <Button
                text
                v-for="notif in notifications"
                :key="notif.id"
                class="flex items-start gap-3 relative p-2 w-full text-left hover:bg-gray-50 border-none rounded-md transition-colors"
                @click="notif.unread = false"
              >
                <div class="relative shrink-0">
                  <Avatar :image="notif.avatar" shape="circle" class="w-11 h-11" />
                </div>

                <div class="flex-1 pr-6">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-900 text-sm">{{ notif.title }}</span>
                    <span class="text-xs text-gray-400 absolute right-0 top-0">{{
                      notif.time
                    }}</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-0.5 leading-tight">
                    {{ notif.message }}
                  </p>
                </div>

                <div v-if="notif.unread" class="absolute right-0 top-6">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
              </Button>
            </div>
          </div>
        </Popover>

        <div class="w-px h-9 bg-slate-100"></div>

        <button
          class="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl pl-1 pr-2.5 py-1.5 transition-colors"
        >
          <Avatar
            :image="`https://ui-avatars.com/api/?name=${user?.name}&background=0d9488&color=fff`"
            shape="circle"
            class="w-9 h-9"
          />
          <div class="hidden sm:flex flex-col items-start">
            <p class="text-sm font-semibold text-slate-800 leading-tight">{{ user?.name }}</p>
            <p class="text-xs text-slate-400">Admin Officer</p>
          </div>
          <ChevronDownIcon size="14" color="#94a3b8" class="hidden sm:block" />
        </button>
      </div> -->
    </div>
  </header>
</template>
