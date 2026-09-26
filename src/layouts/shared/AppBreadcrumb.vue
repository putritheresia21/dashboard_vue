<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'

const route = useRoute()
const router = useRouter()

const showBreadcrumb = computed(() => route.path.startsWith('/aplikasi/'))

const items = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const result: { label: string; route: RouteLocationRaw }[] = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    const resolved = router.resolve(currentPath)
    if (resolved.matched.length && resolved.meta?.title) {
      result.push({ label: resolved.meta.title, route: { path: currentPath } })
    }
  }
  return result
})
</script>

<template>
  <Breadcrumb
    v-if="showBreadcrumb"
    :model="items"
    class="border-none p-0"
    style="background-color: #eef1f5"
  >
    <template #item="{ item, props }">
      <router-link v-slot="{ href, navigate, isExactActive }" :to="item.route" custom>
        <a
          :href="href"
          v-bind="props.action"
          @click="isExactActive ? $event.preventDefault() : navigate($event)"
        >
          <span :class="['font-semibold', isExactActive ? 'text-black' : 'text-blue-500']">
            {{ item.label }}
          </span>
        </a>
      </router-link>
    </template>
  </Breadcrumb>
</template>
