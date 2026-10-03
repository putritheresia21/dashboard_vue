<script setup lang="ts">
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    title?: string // default: route.meta.title
    description?: string
    showBack?: boolean // default true
    backTo?: RouteLocationRaw // cadangan jika tidak ada history
  }>(),
  {
    title: undefined,
    description: undefined,
    showBack: true,
    backTo: undefined,
  },
)

const route = useRoute()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) {
    return router.back()
  }
  router.push(props.backTo ?? '/aplikasi')
}
</script>

<template>
  <header
    class="w-full px-5 py-3 flex items-center gap-6 lg:px-6"
    style="background-color: #eef1f5"
  >
    <button
      v-if="showBack"
      type="button"
      aria-label="Kembali"
      class="grid shrink-0 size-8 place-items-center rounded-lg bg-white shadow-sm transition hover:shadow-md active:scale-95 sm:size-12"
      :class="description ? 'row-span-2' : ''"
      @click="goBack"
    >
      <i class="pi pi-arrow-left text-base text-gray-900" />
    </button>

    <div class="min-w-0">
      <h1
        class="min-w-0 truncate mb-2 text-xl font-bold text-black-900 sm:text-xl"
        :class="showBack ? 'col-start-2' : 'col-span-2'"
      >
        {{ title ?? route.meta.title }}
      </h1>

      <p
        v-if="description"
        class="text-sm text-gray-500"
        :class="showBack ? 'col-start-2' : 'col-span-2'"
      >
        {{ description }}
      </p>
    </div>
  </header>
</template>
