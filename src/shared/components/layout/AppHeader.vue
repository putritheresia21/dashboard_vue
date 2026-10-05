<script setup lang="ts">
import { type PageBreadcrumbItem, PageWrapper } from '@bernofarm/shell'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    showBack?: boolean
    backTo?: RouteLocationRaw
    maxWidth?: string
    breadcrumbItems?: PageBreadcrumbItem[]
    autoBreadcrumb?: boolean
    showBreadcrumb?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    showBack: true,
    backTo: '/',
    maxWidth: 'max-w-8xl',
    breadcrumbItems: () => [],
    autoBreadcrumb: true,
    showBreadcrumb: true,
  },
)
</script>

<template>
  <PageWrapper
    :title="title"
    :description="subtitle"
    :show-back="showBack"
    :back-to="backTo"
    :max-width="maxWidth"
    :breadcrumb-items="breadcrumbItems"
    :auto-breadcrumb="autoBreadcrumb"
    :show-breadcrumb="showBreadcrumb"
  >
    <slot />
  </PageWrapper>
</template>
