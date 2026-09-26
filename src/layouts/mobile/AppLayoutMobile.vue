<script setup lang="ts">
import AppTopbar from '../shared/AppTopbar.vue'
import AppBottomNav from './AppBottomNav.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-[#EEF1F5] overflow-hidden">
    <AppTopbar />
    <main class="flex-1 overflow-y-auto pb-26">
      <router-view />
    </main>
    <AppBottomNav />
  </div>
</template>
