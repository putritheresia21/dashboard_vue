<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTopbar from '../shared/AppTopbar.vue'
import AppSidebar from './AppSidebar.vue'
import AppBreadcrumb from '../shared/AppBreadcrumb.vue'

const route = useRoute()
const isInAplikasi = computed(() => route.path.startsWith('/aplikasi'))
</script>

<template>
  <div class="flex flex-col h-screen bg-[#EEF1F5] overflow-hidden">
    <AppTopbar />
    <div class="flex min-h-0 flex-1 gap-4 overflow-hidden">
      <AppSidebar v-if="isInAplikasi" />
      <main class="min-w-0 flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
