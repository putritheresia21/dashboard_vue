<route lang="yaml">
meta:
  title: Employee
  requiresAuth: true
</route>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import CustomDataTable from '@/components/CustomDataTable.vue'
import DetailDialog from '@/components/dialogs/DetailDialog.vue'
import { salesTeamData, type SalesPerson } from '@/dummy/salesData'
import { ArrowUpIcon } from '@primevue/icons'
import PdfExport from '@/components/export/PdfExport.vue'
import { buildSalesReportHtml } from '@/reports/SalesReport'
import { formatRupiah, formatDate, getAge, getTenure, getPercent } from '@/utils/formatter'

const salesTeam = ref<SalesPerson[]>(salesTeamData)

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

const columns = computed(() => [
  {
    field: 'name',
    header: 'Sales Person',
    sortable: true,
    type: 'icon-text' as const,
    iconField: 'avatar',
    titleField: 'name',
    subtitleField: 'email',
  },
  { field: 'department', header: 'Departemen', sortable: true, align: 'center' as const },
  { field: 'city', header: 'Kota', sortable: true, align: 'center' as const },
  { field: 'achieved', header: 'Target vs Tercapai', width: '160px', slot: 'progress' },
  {
    field: 'commission',
    header: 'Komisi',
    sortable: true,
    align: 'center' as const,
    format: formatRupiah,
  },
  { field: 'status', header: 'Status', sortable: true, align: 'center' as const, slot: 'status' },
])

// filter select + filter
const filters = [
  { type: 'select' as const, key: 'status', placeholder: 'Filter Status' },
  { type: 'select' as const, key: 'department', placeholder: 'Filter Departemen' },
  { type: 'select' as const, key: 'city', placeholder: 'Filter Kota' },
  {
    type: 'range' as const,
    key: 'achievement',
    label: 'Pencapaian',
    min: 0,
    max: 100,
    unit: '%',
    compute: (row: any) => getPercent(row.achieved, row.target),
  },
]

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

const summaryCards = computed(() => [
  {
    label: 'Total Achieved',
    value: formatRupiah(totalAchieved.value),
    change: `${achievementRate.value}% dari target`,
  },
  { label: 'Total Target', value: formatRupiah(totalTarget.value), change: '' },
  { label: 'Total Komisi', value: formatRupiah(totalCommission.value), change: '' },
  { label: 'Top Performers', value: String(topPerformerCount.value), change: '' },
])

const detailTabs = computed(() => {
  const p = selectedPerson.value
  if (!p) return []
  return [
    {
      value: 'biodata',
      label: 'Biodata',
      items: [
        { label: 'No. Hp', value: p.phone },
        {
          label: 'Tanggal Lahir',
          value: formatDate(p.birthDate),
          hint: `${getAge(p.birthDate)} tahun`,
        },
        { label: 'Bergabung Sejak', value: formatDate(p.joinDate), hint: getTenure(p.joinDate) },
        { label: 'Alamat', value: p.address, span2: true },
      ],
    },
    {
      value: 'ringkasan',
      label: 'Ringkasan',
      items: [
        { label: 'Target', value: formatRupiah(p.target) },
        { label: 'Tercapai', value: formatRupiah(p.achieved) },
        { label: 'Komisi', value: formatRupiah(p.commission) },
        { label: 'Status', value: p.status },
      ],
    },
    { value: 'riwayat', label: 'Riwayat Target' },
    { value: 'produk', label: 'Produk Terjual' },
  ]
})
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
    <!--Table (search, filter select, filter pencapaian, actions — semua bawaan CustomDataTable) -->
    <CustomDataTable
      title="Sales Team Performance"
      subtitle="Klik header kolom untuk sorting"
      :data="salesTeam"
      :columns="columns"
      :search-fields="['name', 'email']"
      search-placeholder="Cari sales...."
      :filters="filters"
      :rows="8"
      show-view
      show-edit
      show-delete
      show-export
      export-file-name="Daftar Karyawan"
      @view="openDetail"
      @edit="openDetail"
      @delete="deleteSales"
    >
      <template #progress="{ data }">
        <div>
          <div class="flex flex-col text-xs gap-0.5 mb-1">
            <span class="text-slate-500">{{ formatRupiah(data.achieved) }}</span>
            <span class="text-slate-400">dari {{ formatRupiah(data.target) }}</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="
                getPercent(data.achieved, data.target) >= 100 ? 'bg-emerald-500' : 'bg-yellow-500'
              "
              :style="{ width: getPercent(data.achieved, data.target) + '%' }"
            ></div>
          </div>
        </div>
      </template>

      <template #status="{ data }">
        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
      </template>
    </CustomDataTable>

    <!--Pop up detail-->
    <DetailDialog
      :visible="detailVisible"
      @update:visible="detailVisible = $event"
      title="Detail Sales Person"
      :tabs="detailTabs"
    >
      <template #header>
        <Avatar :image="selectedPerson?.avatar" shape="circle" size="xlarge" />
        <div>
          <p class="font-semibold text-slate-800 text-lg">{{ selectedPerson?.name }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ selectedPerson?.department }}</p>
        </div>
        <PdfExport
          class="ml-auto"
          :build-html="() => buildSalesReportHtml(selectedPerson!)"
          :disabled="!selectedPerson"
        />
      </template>

      <template #tab-biodata>
        <div v-if="selectedPerson" class="grid grid-cols-2 gap-3 text-sm pt-2">
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-slate-400 mb-1">No. Hp</p>
            <p class="font-medium text-slate-800">{{ selectedPerson.phone }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-slate-400 mb-1">Tanggal Lahir</p>
            <p class="font-medium text-slate-800">{{ formatDate(selectedPerson.birthDate) }}</p>
            <p class="text-xs text-slate-400">{{ getAge(selectedPerson.birthDate) }} tahun</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <p class="text-slate-400 mb-1">Bergabung Sejak</p>
            <p class="font-medium text-slate-800">{{ formatDate(selectedPerson.joinDate) }}</p>
            <p class="text-xs text-slate-400">{{ getTenure(selectedPerson.joinDate) }}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-3 col-span-2">
            <p class="text-slate-400 mb-1">Alamat</p>
            <p class="font-medium text-slate-800">{{ selectedPerson.address }}</p>
          </div>
        </div>
      </template>

      <template #tab-ringkasan>
        <div v-if="selectedPerson">
          <div class="grid grid-cols-2 gap-3 text-sm pt-2">
            <div class="bg-slate-50 rounded-lg p-3">
              <p class="text-slate-400 mb-1">Target</p>
              <p class="font-medium text-slate-800">{{ formatRupiah(selectedPerson.target) }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <p class="text-slate-400 mb-1">Tercapai</p>
              <p class="font-medium text-slate-800">{{ formatRupiah(selectedPerson.achieved) }}</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <p class="text-slate-400 mb-1">Komisi</p>
              <p class="font-medium text-slate-800">
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

          <p class="text-xs text-slate-400 mb-1 mt-3">
            Pencapaian: {{ getPercent(selectedPerson.achieved, selectedPerson.target) }}%
          </p>

          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="
                getPercent(selectedPerson.achieved, selectedPerson.target) >= 100
                  ? 'bg-emerald-500'
                  : 'bg-yellow-500'
              "
              :style="{
                width: getPercent(selectedPerson.achieved, selectedPerson.target) + '%',
              }"
            ></div>
          </div>
        </div>
      </template>

      <template #tab-riwayat>
        <div v-if="selectedPerson" class="flex flex-col gap-3 pt-2">
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
                :style="{ width: getPercent(h.achieved, h.target) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </template>

      <template #tab-produk>
        <div v-if="selectedPerson" class="flex flex-col gap-2 pt-2">
          <div
            v-for="prod in selectedPerson.products"
            :key="prod.name"
            class="flex items-center justify-between bg-slate-50 rounded-lg p-3 text-sm"
          >
            <div>
              <p class="font-medium text-slate-800">{{ prod.name }}</p>
              <p class="text-xs text-slate-400">{{ prod.category }} · {{ prod.qty }} unit</p>
            </div>
            <p class="font-semibold text-slate-700">{{ formatRupiah(prod.revenue) }}</p>
          </div>
        </div>
      </template>
    </DetailDialog>
  </div>
</template>

<style scoped>
:deep(.text-center) {
  text-align: center;
}

:deep(.text-center .p-datatable-column-header-content) {
  justify-content: center;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
