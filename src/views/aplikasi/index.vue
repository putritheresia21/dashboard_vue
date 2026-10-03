<route lang="yaml">
meta:
  title: Aplikasi Saya
  requiresAuth: true
</route>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import DynamicList from '@/components/DynamicList.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { sidebarMenu } from '@/config/sidebarMenu'
import PageWrapper from '@/layouts/shared/PageWrapper.vue'
import Colors from '@/utils/colors'
import { formatRupiah, getPercent } from '@/utils/formatter'

const isMobile = useIsMobile()
const router = useRouter()

const targetBulan = 120000000
const gsv = 45000000
const gsvTarget = 60000000
const nsv = 45000000
const nsvTarget = 60000000

interface MenuItem {
  id: string
  label: string
  icon: string
  tag?: string
  route: string
}

const specialTags: Record<string, string> = {
  Visit: 'SERING',
}

const menuItems = computed<MenuItem[]>(() =>
  sidebarMenu.map((menu) => ({
    id: menu.label.toLocaleLowerCase().replace(/\s+/g, '-'),
    label: menu.label,
    icon: menu.icon,
    tag: specialTags[menu.label],
    route: menu.parentRoute,
  })),
)

function goToMenu(item: unknown) {
  const menu = item as MenuItem
  router.push(menu.route)
}
</script>

<template>
  <PageWrapper
    title="Aplikasi Saya"
    description="Akses seluruh perangkat kerja perusahaan anda"
    :show-back="false"
    max-width="none"
  >
    <!-- Mobile -->
    <div
      v-if="isMobile"
      class="rounded-2xl p-5 text-white shadow-sm"
      :style="{
        background: `linear-gradient(to bottom, ${Colors.softBlue[500]} 0%, ${Colors.blue[600]} 100%)`,
      }"
    >
      <div class="mb-5">
        <p class="text-xs text-blue-200 uppercase tracking-wide">Target Bulan Ini</p>
        <p class="text-2xl font-bold whitespace-nowrap">{{ formatRupiah(targetBulan) }}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 flex-1">
          <ProgressBar
            variant="circle"
            :percent="getPercent(gsv, gsvTarget)"
            :color="Colors.orange[400]"
            :track-color="Colors.withOpacity('#FFFFFF', 0.15)"
            :size="44"
            :stroke-width="5"
            label-class="text-[10px] font-bold"
          />
          <div>
            <p class="text-[11px] text-blue-200 flex items-center gap-1">
              <span
                class="w-1.5 h-1.5 rounded-full"
                :style="{ background: Colors.orange[400] }"
              ></span>
              GSV
            </p>
            <p class="text-sm font-semibold whitespace-nowrap">{{ formatRupiah(gsv) }}</p>
            <p class="text-[10px] text-blue-200 whitespace-nowrap">
              dari Rp {{ formatRupiah(gsvTarget) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-1">
          <ProgressBar
            variant="circle"
            :percent="getPercent(nsv, nsvTarget)"
            :color="Colors.softBlue[300]"
            :track-color="Colors.withOpacity('#FFFFFF', 0.15)"
            :size="44"
            :stroke-width="5"
            label-class="text-[10px] font-bold"
          />
          <div>
            <p class="text-[11px] text-blue-200 flex items-center gap-1">
              <span
                class="w-1.5 h-1.5 rounded-full"
                :style="{ background: Colors.softBlue[300] }"
              ></span>
              NSV
            </p>
            <p class="text-sm font-semibold whitespace-nowrap">{{ formatRupiah(nsv) }}</p>
            <p class="text-[10px] text-blue-200 whitespace-nowrap">
              dari Rp {{ formatRupiah(nsvTarget) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop -->
    <div
      v-else
      class="rounded-2xl p-5 text-white shadow-sm"
      :style="{ background: Colors.blue[500] }"
    >
      <div class="flex items-center gap-16">
        <div class="pr-1 mr-8 ml-14 shrink-0">
          <p class="text-xs text-blue-300 uppercase tracking-wide">Target Bulan Ini</p>
          <p class="text-xl font-bold whitespace-nowrap">{{ formatRupiah(targetBulan) }}</p>
        </div>

        <div class="w-px h-14 shrink-0 bg-white/20"></div>

        <div class="flex justify-start gap-10 flex-1">
          <div
            class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex-1 max-w-sm"
          >
            <ProgressBar
              variant="circle"
              :percent="getPercent(gsv, gsvTarget)"
              :color="Colors.orange[400]"
              :track-color="Colors.withOpacity('#FFFFFF', 0.1)"
              :size="48"
              :stroke-width="5"
              label-class="text-[10px] font-bold"
            />
            <div>
              <p class="text-[11px] text-blue-300 flex items-center gap-1">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ background: Colors.orange[400] }"
                ></span>
                GSV
              </p>
              <p class="text-sm font-semibold whitespace-nowrap">{{ formatRupiah(gsv) }}</p>
              <p class="text-[10px] text-blue-300 whitespace-nowrap">
                dari target {{ formatRupiah(gsvTarget) }}
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex-1 max-w-sm"
          >
            <ProgressBar
              variant="circle"
              :percent="getPercent(nsv, nsvTarget)"
              :color="Colors.softBlue[400]"
              :track-color="Colors.withOpacity('#FFFFFF', 0.1)"
              :size="48"
              :stroke-width="5"
              label-class="text-[10px] font-bold"
            />
            <div>
              <p class="text-[11px] text-blue-300 flex items-center gap-1">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ background: Colors.softBlue[400] }"
                ></span>
                NSV
              </p>
              <p class="text-sm font-semibold whitespace-nowrap">{{ formatRupiah(nsv) }}</p>
              <p class="text-[10px] text-blue-300 whitespace-nowrap">
                dari target {{ formatRupiah(nsvTarget) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Menu -->
    <div class="mt-4 max-w-2xl">
      <DynamicList
        :items="menuItems"
        layout="grid"
        :columns="2"
        :padding="6"
        clickable
        :show-arrow="!isMobile"
        @item-click="goToMenu"
      >
        <template #item="{ item }">
          <span
            v-if="(item as MenuItem).tag"
            class="absolute top-1.5 right-1.5 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded z-10"
            >{{ (item as MenuItem).tag }}</span
          >

          <div
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 shadow-md shrink-0"
          >
            <img
              :src="(item as MenuItem).icon"
              :alt="(item as MenuItem).label"
              class="w-6 h-6 object-contain"
            />
          </div>
          <span class="text-sm font-medium text-slate-800 truncate">{{
            (item as MenuItem).label
          }}</span>
        </template>
      </DynamicList>
    </div>
  </PageWrapper>
</template>
