<script setup lang="ts">
import { ref, computed } from 'vue'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Slider from 'primevue/slider'
import CustomDataTable, { type ColumnDef, type FilterDef } from '@/components/CustomDataTable.vue'
import { salesTeamData, type SalesPerson } from '@/dummy/salesData'
import { ArrowUpIcon } from '@primevue/icons'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

const salesTeam = ref<SalesPerson[]>(salesTeamData)

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const getAchievementPercent = (person: SalesPerson) =>
  Math.min(Math.round((person.achieved / person.target) * 100), 100)

const getStatusSeverity = (status: SalesPerson['status']) => {
  switch (status) {
    case 'Top Performer':
      return 'success'
    case 'On Track':
      return 'warn'
    case 'Below Target':
      return 'danger'
    default:
      return 'secondary'
  }
}

const achievementRange = ref<[number, number]>([0, 100])

const preFilteredData = computed(() =>
  salesTeam.value.filter((s) => {
    const pct = getAchievementPercent(s)
    return pct >= achievementRange.value[0] && pct <= achievementRange.value[1]
  }),
)

//reset (buat filter)
const tableKey = ref(0)
const resetFilters = () => {
  achievementRange.value = [0, 100]
  tableKey.value++
}

const columns: ColumnDef[] = [
  { field: 'name', header: 'Sales Person', sortable: true, slot: 'name' },
  { field: 'department', header: 'Departemen', sortable: true, align: 'center' },
  { field: 'city', header: 'Kota', sortable: true, align: 'center' },
  { field: 'achieved', header: 'Target vs Tercapai', width: '20%', slot: 'progress' },
  { field: 'commission', header: 'Komisi', sortable: true, align: 'center', slot: 'commission' },
  { field: 'status', header: 'Status', sortable: true, align: 'center', slot: 'status' },
]

const statusOptions = ['Top Performer', 'On Track', 'Below Target']
const departmentOptions = computed(() =>
  [...new Set(salesTeam.value.map((s) => s.department))].sort(),
)

const cityOptions = computed(() => [...new Set(salesTeam.value.map((s) => s.city))].sort())

const filters = computed<FilterDef[]>(() => [
  { key: 'status', placeholder: 'Filter Status', options: statusOptions },
  { key: 'department', placeholder: 'Filter Departemen', options: departmentOptions.value },
  { key: 'city', placeholder: 'Filter Kota', options: cityOptions.value },
])

//detail pop up
const detailVisible = ref(false)
const selectedPerson = ref<SalesPerson | null>(null)

const openDetail = (person: SalesPerson) => {
  selectedPerson.value = person
  detailVisible.value = true
}

const deleteSales = (person: SalesPerson) => {
  const confirmed = window.confirm(`Yakin ingin menghapus ${person.name} dari tim sales?`)
  if (confirmed) {
    salesTeam.value = salesTeam.value.filter((s) => s.id !== person.id)
  }
}

//toggle summary cards
const showSummaryCards = ref(false)

const totalCommission = computed(() => salesTeam.value.reduce((sum, s) => sum + s.commission, 0))
const totalAchieved = computed(() => salesTeam.value.reduce((sum, s) => sum + s.achieved, 0))
const totalTarget = computed(() => salesTeam.value.reduce((sum, s) => sum + s.target, 0))
const achievementRate = computed(() =>
  totalTarget.value ? ((totalAchieved.value / totalTarget.value) * 100).toFixed(1) : '0',
)
const topPerformerCount = computed(
  () => salesTeam.value.filter((s) => s.status === 'Top Performer').length,
)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const getAge = (birthDate: string) => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const getTenure = (joinDate: string) => {
  const join = new Date(joinDate)
  const today = new Date()
  let years = today.getFullYear() - join.getFullYear()
  let months = today.getMonth() - join.getMonth()

  if (months < 0) {
    years--
    months += 12
  }
  if (years === 0) return `${months} bulan`
  return months === 0 ? `${years} tahun` : `${years} tahun ${months} bulan`
}

const summaryCards = computed(() => [
  {
    label: 'Total Achieved',
    value: formatRupiah(totalAchieved.value),
    change: `${achievementRate.value}% of target`,
  },
  { label: 'Total Target', value: `$${totalTarget.value.toLocaleString()}`, change: '' },
  { label: 'Total Commission', value: `$${totalCommission.value.toLocaleString()}`, change: '' },
  { label: 'Top Performers', value: String(topPerformerCount.value), change: '' },
])
</script>

<template>
  <div>
    <!--Header-->
    <div class="flex items-center justify-between" style="margin-bottom: 22px">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Sales Team</h1>
        <p class="text-sm text-slate-400 mt-1">Track sales performance, targets, and commission</p>
      </div>
      <Button
        :label="showSummaryCards ? 'Sembunyikan Ringkasan' : 'Tampilkan Ringkasan'"
        :icon="showSummaryCards ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        icon-pos="right"
        severity="secondary"
        outlined
        size="small"
        @click="showSummaryCards = !showSummaryCards"
      />
    </div>

    <!--summary cards-->
    <transition name="fade-slide">
      <div
        v-if="showSummaryCards"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        style="margin-bottom: 22px"
      >
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
        >
          <p class="text-sm text-slate-400 mb-2">{{ card.label }}</p>
          <div class="flex flex-col gap-1.5">
            <span class="text-2xl font-bold text-slate-800 leading-tight break-words">
              {{ card.value }}
            </span>
            <span
              v-if="card.change"
              class="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 w-fit"
            >
              <ArrowUpIcon size="10" />
              {{ card.change }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Filter pencapaian -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
      style="margin-bottom: 22px"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Pencapaian
          </span>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-600">
            {{ achievementRange[0] }}% – {{ achievementRange[1] }}%
          </span>
        </div>
        <Button
          label="Reset Semua Filter"
          severity="secondary"
          text
          size="small"
          @click="resetFilters"
        />
      </div>
      <div class="flex items-center gap-3 mt-3 max-w-md">
        <span class="text-xs text-slate-400 w-8 text-right">0%</span>
        <Slider
          v-model="achievementRange"
          range
          :min="0"
          :max="100"
          class="achievement-slider flex-1"
        />
        <span class="text-xs text-slate-400 w-10">100%</span>
      </div>
    </div>

    <!--Table-->
    <CustomDataTable
      :key="tableKey"
      title="Sales Team Performance"
      subtitle="Klik header kolom untuk sorting"
      :data="preFilteredData"
      :columns="columns"
      :search-fields="['name', 'email']"
      search-placeholder="Cari sales...."
      :filters="filters"
      :rows="8"
    >
      <template #name="{ data }">
        <div class="flex items-center gap-3">
          <Avatar :image="data.avatar" shape="circle" />
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">{{ data.name }}</span>
            <span class="text-xs text-slate-400">{{ data.email }}</span>
          </div>
        </div>
      </template>
      <template #progress="{ data }">
        <div>
          <div class="flex items-center justify-between mb-1 text-xs">
            <span class="text-slate-500">{{ formatRupiah(data.achieved) }}</span>
            <span class="text-slate-400">dari {{ formatRupiah(data.target) }}</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="getAchievementPercent(data) >= 100 ? 'bg-emerald-500' : 'bg-yellow-500'"
              :style="{ width: getAchievementPercent(data) + '%' }"
            ></div>
          </div>
        </div>
      </template>

      <template #commission="{ data }">
        <span class="font-semibold text-slate-700">{{ formatRupiah(data.commission) }}</span>
      </template>

      <template #status="{ data }">
        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
      </template>

      <template #actions="{ data }">
        <Button
          icon="pi pi-eye"
          severity="info"
          text
          rounded
          size="small"
          aria-label="Detail"
          @click="openDetail(data)"
        />
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          text
          rounded
          size="small"
          aria-label="Edit"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          aria-label="Delete"
          @click="deleteSales(data)"
        />
      </template>
    </CustomDataTable>

    <!--Pop up detail-->
    <Dialog
      v-model:visible="detailVisible"
      modal
      header="Detail Sales Person"
      :style="{ width: '32rem' }"
    >
      <div v-if="selectedPerson" class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <Avatar :image="selectedPerson.avatar" shape="circle" size="xlarge" />
          <div>
            <p class="font-semibold text-slate-800 text-lg">{{ selectedPerson.name }}</p>
            <p class="text-sm text-slate-400">{{ selectedPerson.email }}</p>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ selectedPerson.department }} . {{ selectedPerson.city }}
            </p>
          </div>
        </div>

        <Tabs value="0">
          <TabList>
            <Tab value="0">Biodata</Tab>
            <Tab value="1">Ringkasan</Tab>
            <Tab value="2">Riwayat Target</Tab>
            <Tab value="3">Produk Terjual</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="pt-2">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Biodata
                </p>
                <div class="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div class="bg-slate-50 rounded-lg p-3">
                    <p class="text-slate-400 mb-1">No. Hp</p>
                    <p class="font-medium text-slate-800">{{ selectedPerson.phone }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3">
                    <p class="text-slate-400 mb-1">Tanggal Lahir</p>
                    <p class="font-medium text-slate-800">
                      {{ formatDate(selectedPerson.birthDate) }}
                    </p>
                    <p class="text-xs text-slate-400">
                      {{ getAge(selectedPerson.birthDate) }} tahun
                    </p>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3">
                    <p class="text-slate-400 mb-1">Bergabung Sejak</p>
                    <p class="font-medium text-slate-800">
                      {{ formatDate(selectedPerson.joinDate) }}
                    </p>
                    <p class="text-xs text-slate-400">{{ getTenure(selectedPerson.joinDate) }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3 col-span-2">
                    <p class="text-slate-400 mb-1">Alamat</p>
                    <p class="font-medium text-slate-800">{{ selectedPerson.address }}</p>
                  </div>
                </div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Performa
                </p>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <!-- grid Target/Tercapai/Komisi/Status yang sudah ada, taruh di sini -->
                </div>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div class="grid grid-cols gap-3 text-sm pt-2">
                <div class="bg-slate-50 rounded-lg p-3">
                  <p class="text-slate-400 mb-1">Target</p>
                  <p class="font-semibold text-slate-800">
                    {{ formatRupiah(selectedPerson.target) }}
                  </p>
                </div>
                <div class="bg-slate-50 rounded-lg p-3">
                  <p class="text-slate-400 mb-1">Tercapai</p>
                  <p class="font-semibold text-slate-800">
                    {{ formatRupiah(selectedPerson.achieved) }}
                  </p>
                </div>
                <div class="bg-slate-50 rounded-lg p-3">
                  <p class="text-slate-400 mb-1">Komisi</p>
                  <p class="font-semibold text-slate-800">
                    {{ formatRupiah(selectedPerson.commission) }}
                  </p>
                </div>
                <div class="bg-slate-50 rounded-lg p-3">
                  <p class="text-slate-400 mb-1">Status</p>
                  <Tag
                    :value="selectedPerson.status"
                    :severity="getStatusSeverity(selectedPerson.status)"
                  />
                </div>
              </div>
              <div class="mt-3">
                <p class="text-xs text-slate-400 mb-1">
                  Pencapaian: {{ getAchievementPercent(selectedPerson) }}%
                </p>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="
                      getAchievementPercent(selectedPerson) >= 100
                        ? 'bg-emerald-500'
                        : 'bg-yellow-500'
                    "
                    :style="{ width: getAchievementPercent(selectedPerson) + '%' }"
                  ></div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="2">
              <div class="flex flex-col gap-3 pt-2">
                <div v-for="h in selectedPerson.targetHistory" :key="h.month" class="text-xs">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-slate-600">{{ h.month }}</span>
                    <span class="text-slate-400"
                      >{{ formatRupiah(h.achieved) }} / {{ formatRupiah(h.target) }}</span
                    >
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :class="h.achieved >= h.target ? 'bg-emerald-500' : 'bg-yellow-500'"
                      :style="{
                        width: Math.min(Math.round((h.achieved / h.target) * 100), 100) + '%',
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div class="flex flex-col gap-2 pt-2">
                <div
                  v-for="prod in selectedPerson.products"
                  :key="prod.name"
                  class="flex items-center justify-between bg-slate-50 rounded-lg p-3 text-sm"
                >
                  <div>
                    <p class="font-medium text-slate-800">{{ prod.name }}</p>
                    <p class="text-xs text-slate-400">{{ prod.category }}</p>
                  </div>
                  <p class="font-semibold text-slate-700">{{ formatRupiah(prod.revenue) }}</p>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.text-center) {
  text-align: center;
}

:deep(.text-center .p-datatable-column-header-content) {
  justify-content: center;
}
</style>
