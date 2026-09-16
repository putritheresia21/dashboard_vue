<script setup lang="ts">
import { useRoute } from 'vue-router'
import Avatar from 'primevue/avatar'
import BellIcon from '@primeicons/vue/bell'
import ChevronDownIcon from '@primeicons/vue/chevron-down'
import Bars3Icon from '@primeicons/vue/bars'

const route = useRoute()

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const emit = defineEmits<{ toggleSidebar: [] }>()
</script>

<template>
  <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="flex items-center justify-between px-4 md:px-6 py-4">
      <!--left: item hamburger buat drawer-->
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          @click="$emit('toggleSidebar')"
        >
          <Bars3Icon size="20" color="#64748b" />
        </button>

        <div>
          <h2 class="text-2xl text-slate-800 tracking-tight">
            {{ route.meta.title }}
          </h2>
        </div>
      </div>

      <!--Right-->
      <div class="flex items-center gap-3">
        <button
          class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <BellIcon size="18" color="#64748b" />
          <span
            class="absolute top-2 right-2.5 w-2 h-2 bg-teal-500 rounded-full ring2 ring-white animate-pulse"
          >
          </span>
        </button>

        <div class="w-px h-9 bg-slate-100"></div>

        <button
          class="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl pl-1 pr-2.5 py-1.5 transition-colors"
        >
          <Avatar
            image="https://ui-avatars.com/api/?name=John+Doe&background=0d9488&color=fff"
            shape="circle"
            class="w-9 h-9"
          />
          <div class="hidden sm: flex flex-col items-start">
            <p class="text-sm font-semibold text-slate-800 leading-tight">John Doe</p>
            <p class="text-xs text-slate-400">Admin Officer</p>
          </div>
          <ChevronDownIcon size="14" color="#94a3b8" class="hidden sm:block" />
        </button>
      </div>
    </div>
  </header>
</template>
