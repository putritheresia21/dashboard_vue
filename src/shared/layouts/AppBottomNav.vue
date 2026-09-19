<script setup lang="ts">
import { useRoute } from 'vue-router'
import HomeIcon from '@primeicons/vue/home'
import ThLargeIcon from '@primeicons/vue/th-large'

const route = useRoute()
const tabs = [
  { label: 'Portal', icon: HomeIcon, to: '/' },
  { label: 'Aplikasi', icon: ThLargeIcon, to: '/aplikasi' },
]
</script>

<template>
  <Teleport to="body">
    <nav
      class="fixed bottom-0 left-0 right-0 z-30 bg-[#0a1e42] flex items-center justify-around h-16 px-2"
    >
      <router-link
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex flex-col items-center justify-center gap-1 px-6 py-1.5 rounded-xl transition-colors"
        :class="route.path === tab.to ? 'text-blue-400' : 'text-white/50'"
      >
        <component
          :is="tab.icon"
          size="20"
          :color="route.path === tab.to ? '#60a5fa' : 'rgba(255,255,255,0.5)'"
        />
        <span class="text-xs font-medium">{{ tab.label }}</span>
      </router-link>
    </nav>
  </Teleport>
</template>
