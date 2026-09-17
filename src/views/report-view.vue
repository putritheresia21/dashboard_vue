<route lang="yaml">
meta:
  title: Report
  requiresAuth: true
</route>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import CalendarIcon from '@primeicons/vue/calendar'
import DownloadIcon from '@primeicons/vue/download'
import ArrowUpIcon from '@primeicons/vue/arrow-up'
import ArrowDownIcon from '@primeicons/vue/arrow-down'
import ChartCard from '@/components/ChartCard.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'

interface TopProduct {
  name: string
  category: string
  sold: number
  revenue: string
  trend: number
}

const topProducts: TopProduct[] = [
  { name: 'Bamboo Watch', category: 'Accessories', sold: 320, revenue: '$20,800', trend: 12.4 },
  { name: 'Gaming Set', category: 'Electronics', sold: 210, revenue: '$62,790', trend: 24.1 },
  { name: 'Headphones', category: 'Electronics', sold: 285, revenue: '$49,875', trend: 8.7 },
  { name: 'Mini Speakers', category: 'Electronics', sold: 176, revenue: '$14,960', trend: -3.2 },
  { name: 'Green T-Shirt', category: 'Clothing', sold: 198, revenue: '$4,950', trend: 5.9 },
  { name: 'Chakra Bracelet', category: 'Accessories', sold: 142, revenue: '$4,544', trend: -1.5 },
]

const selectedPeriod = ref('This Year')

//buat summary cards
const summaryCards = [
  { label: 'Total Revenue', value: '$284,320', change: '+18.2%', positive: true },
  { label: 'Total Orders', value: '4,821', change: '+9.4%', positive: true },
  { label: 'Avg Order Value', value: '$59.00', change: '+3.1%', positive: true },
  { label: 'Product Returns', value: '3.2%', change: '-0.8%', positive: true },
]

// Revenue trend — 12 bulan
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenueTrend = [
  18000, 21000, 19500, 24000, 22500, 26000, 25000, 28500, 27000, 30500, 29000, 32000,
]

const trendChartData = computed(() => ({
  labels: months,
  datasets: [
    {
      label: 'Revenue',
      data: revenueTrend,
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: '#0d9488',
      borderWidth: 2.5,
    },
  ],
}))

const trendChartOptions = {
  maintainAspectRatio: false,
  animation: { duration: 700 },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: { label: (ctx: any) => `$${ctx.parsed.y.toLocaleString()}` },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 }, callback: (v: number) => `$${v / 1000}k` },
    },
  },
}

const categoryData = [
  { name: 'Electronics', revenue: 98400 },
  { name: 'Accessories', revenue: 64200 },
  { name: 'Clothing', revenue: 41100 },
  { name: 'Fitness', revenue: 28900 },
]

const categoryChartData = computed(() => ({
  labels: categoryData.map((c) => c.name),
  datasets: [
    {
      data: categoryData.map((c) => c.revenue),
      backgroundColor: '#0d9488',
      borderRadius: 999,
      categoryPercentage: 0.55,
      barPercentage: 0.5,
    },
  ],
}))

const categoryChartOptions = {
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  animation: { duration: 600 },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: { label: (ctx: any) => `$${ctx.parsed.x.toLocaleString()}` },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 }, callback: (v: number) => `$${v / 1000}k` },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
  },
}

const stockStatus = { inStock: 132, lowStock: 24, outOfStock: 11 }

const stockSegments = [
  { label: 'In Stock', value: stockStatus.inStock, status: 'success' as const },
  { label: 'Low Stock', value: stockStatus.lowStock, status: 'warning' as const },
  { label: 'Out of Stock', value: stockStatus.outOfStock, status: 'danger' as const },
]
</script>

<template>
  <div>
    <!-- header -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div style="margin-bottom: 22px">
        <h1 class="text-2xl font-bold text-slate-800">Sales & Product Reports</h1>
        <p class="text-sm text-slate-400 mt-1">Track your sales performance and product trends</p>
      </div>
      <div class="flex items-center gap-6">
        <button
          class="flex items-center gap-2 bg-white border-slate-200 rounded-xl px4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <CalendarIcon size="16" color="#64748b" />
          {{ selectedPeriod }}
        </button>
        <button
          class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        >
          <DownloadIcon size="16" color="#ffffff" />
          Export
        </button>
      </div>
    </div>

    <!--Summary cards-->
    <!-- <SummaryCard :cards="summaryCards" /> -->

    <!--Revenue trend-->
    <!-- <div style="margin-bottom: 22px">
      <ChartCard
        title="Revenue Trend - 12 Months"
        type="line"
        :data="trendChartData"
        :options="trendChartOptions"
        height="h-72"
      />
    </div> -->

    <!--category breakdown dan stock status-->
    <!-- <div
      class="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg: px-0"
      style="margin-bottom: 22px"
    >
      <ChartCard
        title="Revenue by Category"
        mode="chart"
        type="bar"
        :data="categoryChartData"
        :options="categoryChartOptions"
        height="h-72"
        :span="2"
      />

      <ChartCard title="Stock Status" mode="donut-status" :segments="stockSegments" :span="1" />
    </div> -->

    <!--Top selling product table-->
    <CustomDataTable
      title="Top Selling Products"
      :data="topProducts"
      :columns="[
        { field: 'name', header: 'Product' },
        { field: 'category', header: 'Category' },
        { field: 'sold', header: 'Units Sold', align: 'center' },
        { field: 'revenue', header: 'Revenue', align: 'center' },
        { field: 'trend', header: 'Trend', align: 'center' },
      ]"
      :rows="6"
      :showActions="false"
    >
      <template #category="{ data }">
        <Tag :value="data.category" severity="secondary" />
      </template>

      <template #trend="{ data }">
        <span
          class="inline-flex items-center gap-1 text-xs font-semibold"
          :class="data.trend >= 0 ? 'text-emerald-600' : 'text-red-500'"
        >
          <component :is="data.trend >= 0 ? ArrowUpIcon : ArrowDownIcon" size="10" />
          {{ Math.abs(data.trend) }}%
        </span>
      </template>
    </CustomDataTable>
  </div>
</template>
