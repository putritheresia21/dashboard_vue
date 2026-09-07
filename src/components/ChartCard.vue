<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'

const STATUS_COLORS = {
  success: { chart: '#22c55e', text: '#16a34a', bg: '#f0fdf4' },
  warning: { chart: '#f59e0b', text: '#d97706', bg: '#fffbeb' },
  danger: { chart: '#ef4444', text: '#dc2626', bg: '#fef2f2' },
  neutral: { chart: '#94a3b8', text: '#64748b', bg: '#f8fafc' },
}

const props = withDefaults(
  defineProps<{
    title: string
    // chart = bar line/, donus-status = donut + total tengah + legend
    mode?: 'chart' | 'donut-status'
    height?: string

    //dipakai kalau mode === 'chart' ----
    type?: 'bar' | 'line' | 'doughnut' | 'pie'
    data?: any
    options?: any

    //--dipakai kalau mode === 'donut-status'
    segments?: {
      label: string
      value: number
      status: 'success' | 'warning' | 'danger' | 'neutral'
    }[]
    centerLabel?: string
    span?: 1 | 2 | 3
  }>(),
  { mode: 'chart', height: 'h-64', centerLabel: 'Total Items' },
)

const donutTotal = computed(() => props.segments?.reduce((sum, s) => sum + s.value, 0) ?? 0)

const donutChartData = computed(() => ({
  labels: props.segments?.map((s) => s.label) ?? [],
  datasets: [
    {
      data: props.segments?.map((s) => s.value) ?? [],
      backgroundColor: props.segments?.map((s) => STATUS_COLORS[s.status].chart) ?? [],
      borderWidth: 3,
      borderColor: '#ffffff',
    },
  ],
}))

const donutChartOptions = computed(() => ({
  maintainAspectRatio: false,
  animation: {
    duration: 600,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  cutout: '72%',
}))
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
    :class="
      span
        ? [
            'snap-center shrink-0 w-[85%] sm:w-[70%] lg:w-auto',
            span === 2 ? 'lg:col-span-2' : span === 3 ? 'lg:col-span-3' : '',
          ]
        : ''
    "
  >
    <h3 class="text-sm font-semibold text-slate-700" style="margin-bottom: 10px">{{ title }}</h3>

    <template v-if="mode === 'donut-status'">
      <div class="relative flex items-center justify-center" style="height: 180px">
        <Chart type="doughnut" :data="donutChartData" :options="donutChartOptions" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-2xl font-bold text-slate-800">{{ donutTotal }}</span>
          <span class="text-xs text-slate-400">{{ centerLabel }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <div
          v-for="item in segments"
          :key="item.label"
          class="flex items-center justify-between text-xs px-2.5"
          :style="{ background: STATUS_COLORS[item.status].bg }"
        >
          <span
            class="flex items-center gap-2 font-medium whitespace-nowrap"
            :style="{ color: STATUS_COLORS[item.status].text }"
          >
            {{ item.label }}
          </span>
          <span class="font-semibold text-slate-700 whitespace-nowrap">{{ item.value }}</span>
        </div>
      </div>
    </template>

    <Chart v-else :type="type" :data="data" :options="options" :class="height" />
  </div>
</template>
