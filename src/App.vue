<script setup lang="ts">
import { ConfirmDialog as BernofarmConfirmDialog, Toast as BernofarmToast } from '@bernofarm/core'
import { AppShell, AuthShell } from '@bernofarm/shell'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { sidebarMenu } from './app/navigation/sidebarMenu'
import { sidebarRail } from './app/navigation/sidebarRail'
import companyLogo from './assets/logo/logo-bernofarm.svg'
import { useAuthStore } from './features/auth/stores/authStore'
import DashboardTopbar from './shared/components/layout/DashboardTopbar.vue'

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isAuthLayout = computed(() => route.meta.layout === false || route.meta.layout === 'none')

const shellBrand = {
  name: 'BERNOFARM',
  logo: companyLogo,
}

const shellUser = computed(() => {
  if (!user.value) {
    return undefined
  }

  return {
    name: user.value.name,
    email: 'Sales Rep',
  }
})

const navigation = computed(() => {
  if (route.path !== '/app' && !route.path.startsWith('/app/')) {
    return []
  }

  return sidebarMenu.map((item) => ({
    label: item.label,
    icon: item.icon,
    items: item.children.map((child) => ({
      label: child.label,
      to: child.to,
      badge: child.tag,
    })),
  }))
})

const railNavigation = computed(() =>
  sidebarRail.map((item) => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
  })),
)

const topbarNavigation = [
  { label: 'Portal Perusahaan', to: '/' },
  { label: 'Aplikasi Saya', to: '/app' },
]
</script>

<template>
  <AuthShell v-if="isAuthLayout" responsive-mode="mobile" :brand="shellBrand">
    <RouterView />
  </AuthShell>

  <AppShell
    v-else
    responsive-mode="mobile"
    topbar-variant="dashboard"
    :show-navigation-toggle="false"
    desktop-layout="topbar-full-width"
    :navigation="navigation"
    :mobile-navigation="railNavigation"
    :topbar-navigation="topbarNavigation"
    class="app-shell-hide-scroll"
    sidebar-title="Aplikasi Saya"
    :brand="shellBrand"
    :user="shellUser"
    :topbar-sticky="true"
    content-max-width="1440px"
  >
    <template #topbar>
      <DashboardTopbar :brand="shellBrand" :navigation="topbarNavigation" :user="shellUser" />
    </template>
    <RouterView />
  </AppShell>

  <BernofarmToast />
  <BernofarmConfirmDialog />
</template>

<style>
.app-shell-hide-scroll aside,
.app-shell-hide-scroll aside *,
.app-shell-hide-scroll nav,
.app-shell-hide-scroll nav *,
.app-shell-hide-scroll [class*='sidebar'],
.app-shell-hide-scroll [class*='sidebar'] * {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-shell-hide-scroll aside::-webkit-scrollbar,
.app-shell-hide-scroll aside *::-webkit-scrollbar,
.app-shell-hide-scroll nav::-webkit-scrollbar,
.app-shell-hide-scroll nav *::-webkit-scrollbar,
.app-shell-hide-scroll [class*='sidebar']::-webkit-scrollbar,
.app-shell-hide-scroll [class*='sidebar'] *::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>
