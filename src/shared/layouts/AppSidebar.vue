<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchInput from '@/components/SearchInput.vue'
import ChevronDownIcon from '@primeicons/vue/chevron-down'
import ChevronRightIcon from '@primeicons/vue/chevron-right'
import { sidebarMenu } from '@/config/sidebarMenu'

const route = useRoute()

const isInAplikasi = computed(() => route.path.startsWith('/aplikasi'))

interface SubMenu {
  label: string
  to: string
}

interface Menu {
  label: string
  icon: unknown
  children: SubMenu[]
}

const filterMenuRecursive = (menus: Menu[], query: string): Menu[] => {
  if (!query) return menus

  return menus.reduce((result: Menu[], menu) => {
    const isMatch = menu.label.toLowerCase().includes(query)

    if (isMatch) {
      result.push(menu)
    } else {
      const filteredChildren = menu.children.filter((child) =>
        child.label.toLowerCase().includes(query),
      )
      if (filteredChildren.length > 0) {
        result.push({ ...menu, children: filteredChildren })
      }
    }

    return result
  }, [])
}

const search = ref('')

const filteredMenu = computed(() => {
  const query = search.value.toLowerCase()
  return filterMenuRecursive(sidebarMenu, query)
})

function isChildActive(child: SubMenu) {
  return route.path === child.to || route.path.startsWith(child.to + '/')
}

function hasActiveChild(item: Menu) {
  return item.children.some(isChildActive)
}

const expandedMenus = ref<Set<string>>(new Set())

sidebarMenu.forEach((item) => {
  if (hasActiveChild(item)) expandedMenus.value.add(item.label)
})

function toggleExpand(label: string) {
  if (expandedMenus.value.has(label)) {
    expandedMenus.value.delete(label)
  } else {
    expandedMenus.value.add(label)
  }
}

function isExpanded(label: string) {
  return expandedMenus.value.has(label)
}
</script>

<template>
  <aside
    v-if="isInAplikasi"
    class="flex flex-col w-64 bg-[#0d2551] p-4 gap-1 overflow-y-auto flex-shrink-0"
    style="scrollbar-gutter: stable"
  >
    <SearchInput v-model="search" placeholder="Cari Menu..." variant="dark" class="mb-4" />
    <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
      Aplikasi Saya
    </p>

    <div v-for="item in filteredMenu" :key="item.label">
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors"
        :class="hasActiveChild(item) ? 'bg-amber-500/20' : 'hover:bg-white/5'"
        @click="toggleExpand(item.label)"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="typeof item.icon === 'string'"
            :src="item.icon"
            alt=""
            width="24"
            height="24"
            class="flex-shrink-0"
          />
          <component
            v-else
            :is="item.icon"
            size="18"
            :color="hasActiveChild(item) ? '#f59e0b' : '#ffffff'"
          />
          <span
            class="text-sm font-medium"
            :class="hasActiveChild(item) ? 'text-amber-500 font-semibold' : 'text-white'"
          >
            {{ item.label }}
          </span>
        </div>
        <ChevronRightIcon
          size="14"
          :color="isExpanded(item.label) ? '#3b82f6' : '#94a3b8'"
          class="flex-shrink-0 transition-transform"
          :class="{ 'rotate-90': isExpanded(item.label) }"
        />
      </button>
      <div v-show="isExpanded(item.label)" class="flex flex-col gap-1 pl-12 pr-2 py-1">
        <router-link
          v-for="child in item.children"
          :key="child.to"
          :to="child.to"
          class="text-sm py-2 px-2 rounded-lg transition-colors"
          :class="
            isChildActive(child) ? 'text-amber-500 font-medium' : 'text-slate-300 hover:text-white'
          "
        >
          {{ child.label }}
        </router-link>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
