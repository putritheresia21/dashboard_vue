<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-[#f5f5f5] p-4 gap-4 overflow-hidden">
    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <AppTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main
        class="flex-1 min-h-0 bg-[#ffffff] overflow-y-auto p-8"
        style="margin-top: 16px; border-radius: 20px"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
