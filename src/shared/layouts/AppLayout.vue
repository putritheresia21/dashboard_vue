<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import AppBottomNav from './AppBottomNav.vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'
import { useIsMobile } from '../composables/useIsMobile.ts'

// const isSidebarOpen = ref(false)

const route = useRoute()
const isMobile = useIsMobile()

const home = {
  label: 'Aplikasi Saya',
  route: { name: '/' },
}

// Generate item breadcrumb secara dinamis
const breadcrumbItems = computed(() => {
  const matchedRoutes = route.matched

  return matchedRoutes
    .filter((record) => record.meta.title)
    .map((record) => ({
      label: record.meta.title,
      route: { path: record.path },
    }))
})

const isInAplikasi = computed(() => route.path.startsWith('/aplikasi'))
</script>

<template>
  <div class="flex flex-col h-screen bg-[#f5f5f5] overflow-hidden">
    <AppTopbar />

    <div class="flex flex-1 min-h-0 gap-4 overflow-hidden">
      <AppSidebar v-if="!isMobile" />

      <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
        <main class="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          <Breadcrumb
            v-if="isInAplikasi"
            :home="home"
            :model="breadcrumbItems"
            class="hidden sm:block bg-transparent border-none p-0 mb-4"
          >
            <!-- Gunakan slot #item agar perpindahan halaman menggunakan vue-router (tanpa reload) -->
            <template #item="{ item, props }">
              <!-- 1. Tambahkan isExactActive di dalam v-slot -->
              <router-link
                v-if="item.route"
                v-slot="{ href, navigate, isExactActive }"
                :to="item.route"
                custom
              >
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span
                    v-if="item.icon"
                    :class="[item.icon, isExactActive ? 'text-black' : 'text-blue-500']"
                  />

                  <!-- 2. Gunakan isExactActive untuk mengubah warna class -->
                  <!-- Jika aktif: text-black. Jika tidak aktif: text-blue-500 -->
                  <span :class="['font-semibold', isExactActive ? 'text-black' : 'text-blue-500']">
                    {{ item.label }}
                  </span>
                </a>
              </router-link>

              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span v-if="item.icon" :class="[item.icon, 'text-color']" />
                <span class="text-color font-semibold">{{ item.label }}</span>
              </a>
            </template>
          </Breadcrumb>

          <router-view />
        </main>
      </div>
      <AppBottomNav v-if="isMobile" />
    </div>
    <!-- 
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <AppTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="flex-1 min-h-0 bg-white overflow-y-auto p-4 md:p-8 mt-4 rounded-[20px]">
        <router-view />
      </main>
    </div> -->
  </div>
</template>
