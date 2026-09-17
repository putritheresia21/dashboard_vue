<route lang="yaml">
meta:
  title: Dashboard
  requiresAuth: true
</route>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Chart from 'primevue/chart'
import Tag from 'primevue/tag'
import ShoppingCartIcon from '@primeicons/vue/shopping-cart'
import UsersIcon from '@primeicons/vue/users'
import RefreshIcon from '@primeicons/vue/refresh'
import DollarIcon from '@primeicons/vue/dollar'
import RadialGauge from '@/components/charts/RadialGauge.vue'

interface StatCard {
  key: string
  label: string
  value: string
  change: string
  last: string
  icon: any
  negative?: boolean
  monthlyData: number[]
  growthPercent: number
}

const stats: StatCard[] = [
  {
    key: 'sales',
    label: 'Total Sales',
    value: '2,500',
    change: '+4.9%',
    last: 'Last month: 2345',
    icon: ShoppingCartIcon,
    monthlyData: [1800, 1500, 1200, 2500, 1900, 2200, 2000, 2300],
    growthPercent: 70.8,
  },
  {
    key: 'customer',
    label: 'New Customer',
    value: '110',
    change: '+7.5%',
    last: 'Last month: 89',
    icon: UsersIcon,
    monthlyData: [70, 85, 60, 110, 95, 100, 90, 105],
    growthPercent: 55.3,
  },
  {
    key: 'return',
    label: 'Return Products',
    value: '72',
    change: '-6.0%',
    last: 'Last month: 60',
    icon: RefreshIcon,
    negative: true,
    monthlyData: [40, 55, 60, 72, 65, 58, 62, 68],
    growthPercent: 32.1,
  },
  {
    key: 'revenue',
    label: 'Total Revenue',
    value: '$8,220.64',
    change: '+12.3%',
    last: 'Last month: $620.00',
    icon: DollarIcon,
    monthlyData: [22000, 15000, 12000, 27000, 18000, 24000, 20000, 26000],
    growthPercent: 84.6,
  },
]

const selectedKey = ref('sales')
const selectedStat = computed(() => stats.find((s) => s.key === selectedKey.value)!)

function selectCard(key: string) {
  selectedKey.value = key
}

// Chart performa
const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const highlightIndex = 3 // Agustus

const performanceChartData = computed(() => ({
  labels: months,
  datasets: [
    {
      data: selectedStat.value.monthlyData,
      backgroundColor: selectedStat.value.monthlyData.map((_, i) =>
        i === highlightIndex ? '#0f172a' : '#e2e8f0',
      ),
      borderRadius: 999,
      categoryPercentage: 0.55,
      barPercentage: 0.5,
    },
  ],
}))

const performanceChartOptions = {
  maintainAspectRatio: false,
  animation: { duration: 500 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#94a3b8', font: { size: 11 } },
      grid: { color: '#f1f5f9' },
      border: { display: false },
    },
  },
}

// Gauge chart

const gaugeChartData = computed(() => ({
  labels: ['Growth', 'Remaining'],
  datasets: [
    {
      data: [selectedStat.value.growthPercent, 100 - selectedStat.value.growthPercent],
      backgroundColor: ['#2dd4bf', '#e2e8f0'],
      borderWidth: 0,
    },
  ],
}))

const gaugeChartOptions = {
  maintainAspectRatio: false,
  rotation: -90,
  circumference: 180,
  cutout: '75%',
  animation: { duration: 500 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

// Recent orders
interface Order {
  id: string
  product: string
  orderId: string
  date: string
  customer: string
  category: string
  status: 'Delivered' | 'Pending' | 'Cancelled'
  items: number
  total: string
}

const orders = ref<Order[]>([
  {
    id: '1',
    product: 'Wireless Headphones',
    orderId: '#ORD-1024',
    date: '12 Aug 2026',
    customer: 'Amy Elsner',
    category: 'Electronics',
    status: 'Delivered',
    items: 2,
    total: '$120.00',
  },
  {
    id: '2',
    product: 'Running Shoes',
    orderId: '#ORD-1025',
    date: '13 Aug 2026',
    customer: 'Anna Fali',
    category: 'Fashion',
    status: 'Pending',
    items: 1,
    total: '$85.00',
  },
  {
    id: '3',
    product: 'Coffee Maker',
    orderId: '#ORD-1026',
    date: '14 Aug 2026',
    customer: 'Bernardo Dominic',
    category: 'Home',
    status: 'Delivered',
    items: 1,
    total: '$59.00',
  },
  {
    id: '4',
    product: 'Backpack',
    orderId: '#ORD-1027',
    date: '15 Aug 2026',
    customer: 'Elwin Sharvill',
    category: 'Fashion',
    status: 'Cancelled',
    items: 1,
    total: '$45.00',
  },
])

const getStatusSeverity = (status: Order['status']) => {
  switch (status) {
    case 'Delivered':
      return 'success'
    case 'Pending':
      return 'warn'
    case 'Cancelled':
      return 'danger'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between" style="margin-bottom: 14px">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Sales Overview</h1>
        <p class="text-sm text-slate-400 mt-1">Your current sales summary and activity</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="margin-bottom: 14px">
      <button
        v-for="stat in stats"
        :key="stat.key"
        type="button"
        class="text-left rounded-2xl p-5 shadow-sm border transition-all"
        :class="
          selectedKey === stat.key
            ? 'bg-emerald-500 border-emerald-600 scale-[1.02]'
            : 'bg-white border-slate-100 hover:border-emerald-200'
        "
        @click="selectCard(stat.key)"
      >
        <div class="flex items-center justify-between mb-4">
          <span
            class="text-sm"
            :class="selectedKey === stat.key ? 'text-emerald-50' : 'text-slate-400'"
          >
            {{ stat.label }}
          </span>
          <div
            class="flex items-center justify-center w-9 h-9 rounded-full"
            :class="selectedKey === stat.key ? 'bg-white' : 'bg-slate-50'"
          >
            <component
              :is="stat.icon"
              size="16"
              :color="selectedKey === stat.key ? '#092328' : '#64748b'"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="text-2xl font-bold"
            :class="selectedKey === stat.key ? 'text-white' : 'text-slate-800'"
          >
            {{ stat.value }}
          </span>
          <span
            class="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            :class="
              stat.negative
                ? 'bg-red-50 text-red-500'
                : selectedKey === stat.key
                  ? 'bg-white/20 text-white'
                  : 'bg-green-50 text-green-600'
            "
          >
            {{ stat.change }}
          </span>
        </div>
        <p
          class="text-xs mt-2"
          :class="selectedKey === stat.key ? 'text-emerald-100' : 'text-slate-400'"
        >
          {{ stat.last }}
        </p>
      </button>
    </div>

    <!-- Chart section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4" style="margin-bottom: 14px">
      <!-- Bar chart -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div class="flex items-center justify-between" style="margin-bottom: 20px">
          <h3 class="text-sm font-semibold text-emerald-700">
            Performance Overview - {{ selectedStat.label }}
          </h3>
        </div>
        <Chart
          type="bar"
          :data="performanceChartData"
          :options="performanceChartOptions"
          :key="selectedKey"
          class="h-64"
        />
      </div>

      <!-- Gauge chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 class="text-sm font-semibold text-green-700" style="margin-bottom: 12px">
          {{ selectedStat.label }} Growth
        </h3>
        <div class="relative flex items-center justify-center w-full">
          <RadialGauge
            :percent="selectedStat.growthPercent"
            :size="200"
            :label="`${selectedStat.label} Growth`"
          />
        </div>

        <div class="grid grid-cols-2 gap-3" style="margin-top: 20px">
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-xs text-slate-400 mb-1">Current Value</p>
            <p class="text-base font-bold text-slate-800">{{ selectedStat.value }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-xs text-slate-400 mb-1">Change</p>
            <p
              class="text-base font-bold"
              :class="selectedStat.negative ? 'text-red-500' : 'text-emerald-600'"
            >
              {{ selectedStat.change }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent orders table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="flex items-center justify-between p-5 border-b border-slate-100">
        <h3 class="text-sm font-semibold text-slate-700">Recent Orders</h3>
      </div>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Product</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Order ID</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Date</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Customer</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Category</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Status</th>
            <th class="text-xs font-semibold text-slate-400 uppercase px-5 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-t border-slate-50 hover:bg-slate-50"
          >
            <td class="px-5 py-3 text-sm font-medium text-slate-700">{{ order.product }}</td>
            <td class="px-5 py-3 text-sm text-slate-500">{{ order.orderId }}</td>
            <td class="px-5 py-3 text-sm text-slate-500">{{ order.date }}</td>
            <td class="px-5 py-3 text-sm text-slate-500">{{ order.customer }}</td>
            <td class="px-5 py-3 text-sm text-slate-500">{{ order.category }}</td>
            <td class="px-5 py-3">
              <Tag :value="order.status" :severity="getStatusSeverity(order.status)" />
            </td>
            <td class="px-5 py-3 text-sm font-semibold text-slate-700">{{ order.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
