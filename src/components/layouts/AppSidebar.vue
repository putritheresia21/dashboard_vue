<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import HomeIcon from '@primeicons/vue/home'
import ChartBarIcon from '@primeicons/vue/chart-bar'
import ShoppingBagIcon from '@primeicons/vue/shopping-bag'
import UsersIcon from '@primeicons/vue/users'
import SendIcon from '@primeicons/vue/send'
import FileIcon from '@primeicons/vue/file'
import CogIcon from '@primeicons/vue/cog'
import CommentIcon from '@primeicons/vue/comment'
import QuestionCircleIcon from '@primeicons/vue/question-circle'
import { ChevronDownIcon } from '@primevue/icons'

interface MenuItem {
  label: string
  icon: Component
  to?: string
  children?: MenuItem[]
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Menu',
    items: [
      { label: 'Dashboard', icon: HomeIcon, to: '/' },
      { label: 'Report', icon: ChartBarIcon, to: '/report-view' },
      {
        label: 'Products',
        icon: ShoppingBagIcon,
        children: [
          { label: 'All Products', icon: ShoppingBagIcon, to: '/product-view' },
          { label: 'Category Product', icon: ChartBarIcon, to: '/category-view' },
        ],
      },
      { label: 'Sales', icon: UsersIcon, to: '/employee-view' },
      { label: 'Login', icon: UsersIcon, to: '/login' },
    ],
  },
  // {
  //   title: 'Financial',
  //   items: [
  //     { label: 'Transaction', icon: SendIcon, to: '/transaction' },
  //     { label: 'Invoices', icon: FileIcon, to: '/invoices' },
  //   ],
  // },
  // {
  //   title: 'Tools',
  //   items: [
  //     { label: 'Settings', icon: CogIcon, to: '/settings' },
  //     { label: 'Feedback', icon: CommentIcon, to: '/feedback' },
  //     { label: 'Help', icon: QuestionCircleIcon, to: '/help' },
  //   ],
  // },
]

const route = useRoute()

const expandedMenus = ref<Set<string>>(new Set())

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

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

//cek salah satu parentnya pakah sudah aktif
function hasActiveChild(item: MenuItem): boolean {
  if (!item.children) return false
  return item.children.some((child) => child.to === route.path)
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="emit('close')"
    ></div>
  </Transition>

  <aside
    class="fixed md:relative inset-y-0 left-0 z-50 md:z-auto flex flex-col h-full w-64 bg-white rounded-3xl py-5 overflow-hidden transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0"
    :class="{ 'translate-x-0': props.isOpen }"
  >
    <!-- Header / Brand Info -->
    <div class="flex items-center gap-2.5 py-2 px-4 mb-8">
      <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 flex-shrink-0">
        <span class="text-white font-bold text-md">A</span>
      </div>
      <span class="text-base font-bold text-slate-800 whitespace-nowrap"> Admin Panel </span>
    </div>

    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-4">
      <div v-for="group in menuGroups" :key="group.title">
        <p
          class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 py-3 mb-2 whitespace-nowrap"
        >
          {{ group.title }}
        </p>

        <div class="flex flex-col gap-1">
          <template v-for="item in group.items" :key="item.label">
            <router-link
              v-if="!item.children"
              :to="item.to!"
              :title="item.label"
              @click="emit('close')"
            >
              <div
                class="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors"
                :class="route.path === item.to ? 'bg-emerald-600' : 'hover:bg-slate-100'"
              >
                <component
                  :is="item.icon"
                  size="18"
                  class="flex-shrink-0"
                  :color="route.path === item.to ? '#ffffff' : '#94a3b8'"
                />
                <span
                  class="text-sm font-medium whitespace-nowrap"
                  :class="route.path === item.to ? 'text-white' : 'text-slate-500'"
                >
                  {{ item.label }}
                </span>
              </div>
            </router-link>

            <!--item dengan children bisa expand/collapse-->
            <div v-else>
              <button
                type="button"
                class="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors"
                :class="hasActiveChild(item) ? 'bg-emerald-50' : 'hover:bg-slate-100'"
                @click="toggleExpand(item.label)"
              >
                <div class="flex items-center gap-4">
                  <component
                    :is="item.icon"
                    size="18"
                    class="flex-shrink-0"
                    :color="hasActiveChild(item) ? '#0d9488' : '#94a3b8'"
                  />
                  <span
                    class="text-sm font-medium whitespace-nowrap"
                    :class="hasActiveChild(item) ? 'text-emerald-700' : 'text-slate-500'"
                  >
                    {{ item.label }}
                  </span>
                </div>
                <chevron-down-icon
                  size="14"
                  color="#94a3b8"
                  class="flex-shrink-0 transition-transform"
                  :class="{ 'rotate-180': isExpanded(item.label) }"
                />
              </button>

              <!--submenu-->
              <div
                v-show="isExpanded(item.label)"
                class="flex flex-col gap-3 ml-4 pl-3"
                style="margin-top: 8px"
              >
                <router-link
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to!"
                  @click="emit('close')"
                >
                  <div
                    class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
                    :class="
                      route.path === child.to
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'hover:bg-slate-50 text-slate-500'
                    "
                  >
                    <span class="text-sm whitespace-nowrap">{{ child.label }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>
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
