<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import PageHeader from './PageHeader.vue'
import PageContent from './PageContent.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    showBack?: boolean
    backTo?: RouteLocationRaw
    maxWidth?: string
  }>(),
  { showBack: true, maxWidth: 'max-w-2xl' },
)
</script>

<template>
  <div>
    <div
      class="sticky z-20 -mt-px pt-[calc(1rem+1px)] lg:pt-[calc(1.5rem+1px)]"
      style="background-color: #eef1f5; top: -1px"
    >
      <AppBreadcrumb class="hidden px-4 pb-3 lg:block lg:px-6" />
      <PageHeader
        :title="title"
        :description="description"
        :show-back="showBack"
        :back-to="backTo"
      />
    </div>

    <PageContent :max-width="maxWidth">
      <slot></slot>
    </PageContent>
  </div>
</template>
