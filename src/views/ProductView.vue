<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import PlusIcon from '@primeicons/vue/plus'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import CustomDataTable, { type ColumnDef, type FilterDef } from '@/components/CustomDataTable.vue'
import ChartCard from '@/components/ChartCard.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import { getProducts, createProduct } from '@/services/product-service'
import { getCategories } from '@/services/category-service'
import type { Product, ApiProduct, CreateProductPayload } from '@/types/product'
import type { Category } from '@/types/category'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const errorMessage = ref('')

async function fetchProducts() {
  loading.value = true
  errorMessage.value = ''
  try {
    products.value = await getProducts()
  } catch (err) {
    errorMessage.value = 'Gagal memuat produk'
    console.error(err)
  } finally {
    loading.value
  }
}

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const categoryOptions = computed(() => [...new Set(products.value.map((p) => p.category))])

const filters = computed<FilterDef[]>(() => [
  { key: 'category', placeholder: 'All Category', options: categoryOptions.value },
])

//summary cards
const totalProducts = computed(() => products.value.length)
const totalStockValue = computed(() =>
  products.value.reduce((sum, p) => sum + p.quantity * p.price, 0),
)
const lowStockCount = computed(
  () => products.value.filter((p) => p.inventoryStatus === 'LOWSTOCK').length,
)
const outOfStockCount = computed(
  () => products.value.filter((p) => p.inventoryStatus === 'OUTOFSTOCK').length,
)

const summaryCards = computed(() => [
  { label: 'Total Products', value: String(totalProducts.value), change: '+12.3%' },
  { label: 'Stock Value', value: `$${totalStockValue.value.toLocaleString()}`, change: '+8.1%' },
  { label: 'Low Stock', value: String(lowStockCount.value), change: '' },
  { label: 'Out of Stock', value: String(outOfStockCount.value), change: '' },
])

const getSeverity = (status: Product['inventoryStatus']) => {
  switch (status) {
    case 'INSTOCK':
      return 'success'
    case 'LOWSTOCK':
      return 'warn'
    case 'OUTOFSTOCK':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getSeverityLabel = (status: Product['inventoryStatus']) => {
  switch (status) {
    case 'INSTOCK':
      return 'In Stock'
    case 'LOWSTOCK':
      return 'Low Stock'
    case 'OUTOFSTOCK':
      return 'Out of Stock'
    default:
      return status
  }
}

const editProduct = (product: Product) => {
  console.log('Edit:', product)
}

const deleteProduct = (product: Product) => {
  const confirmed = window.confirm(`Yakin ingin menghapus ${product.name}?`)
  if (confirmed) {
    products.value = products.value.filter((p) => p.id !== product.id)
  }
}

//fungsi2 buat chart
const categoryColors = ['#0d9488', '#2dd4bf', '#5eead4', '#99f6e4']

const categoryChartData = computed(() => {
  const counts: Record<string, number> = {}
  products.value.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1
  })

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: Object.keys(counts).map(
          (_, i) => categoryColors[i % categoryColors.length],
        ),
        borderRadius: 999,
        categoryPercentage: 0.55,
        barPercentage: 0.5,
      },
    ],
  }
})

const categoryChartOptions = {
  maintainAspectRatio: false,
  animation: { duration: 600 },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8, displayColors: false },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 2, color: '#cbd5e1', font: { size: 11 } },
      grid: { color: '#f8fafc', drawTicks: false },
      border: { display: false },
    },
  },
}

//buat hitung jumlah produk
const stockCounts = computed(() => {
  const counts = { INSTOCK: 0, LOWSTOCK: 0, OUTOFSTOCK: 0 }
  products.value.forEach((p) => {
    if (p.inventoryStatus in counts) {
      counts[p.inventoryStatus]++
    }
  })
  return counts
})

const showAddDialog = ref(false)
const saving = ref(false)

const newProduct = ref({
  name: '',
  categoryID: null as number | null,
  quantity: 0,
  price: 0,
  image: '',
})

function openAddDialog() {
  newProduct.value = { name: '', categoryID: null, quantity: 0, price: 0, image: '' }
  showAddDialog.value = true
}

function generateProductCode(): string {
  const nextNumber = products.value.length + 1
  return `PRD-${String(nextNumber).padStart(4, '0')}`
}

async function saveNewProduct() {
  if (!newProduct.value.name || !newProduct.value.categoryID) {
    alert('Nama produk dan kategori wajib diisi')
    return
  }

  const payload: CreateProductPayload = {
    code: generateProductCode(),
    name: newProduct.value.name,
    categoryId: newProduct.value.categoryID,
    quantity: newProduct.value.quantity,
    price: newProduct.value.price,
    image: `https://placehold.co/100x100/0d9488/white?text=${newProduct.value.name.charAt(0)}`,
  }

  saving.value = true

  try {
    const created = await createProduct(payload)
    products.value.push(created)
    showAddDialog.value = false
  } catch (err) {
    alert('Gagal menyimpan produk')
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <!--Header-->
    <div class="flex items-center justify-between" style="margin-bottom: 22px">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Products</h1>
        <p class="text-sm text-slate-400 mt-1">{{ totalProducts }} total products</p>
      </div>
      <button
        class="flex items-center gap-2 bg-emerald-600 hover: bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-color"
        @click="openAddDialog"
      >
        <PlusIcon size="16" color="#ffffff" />
        Add Product
      </button>
    </div>

    <!--Summary cards-->
    <!-- <SummaryCard :cards="summaryCards" /> -->

    <!--Charts-->
    <!-- <div
      class="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide -mx px-4 lg:mx-0 lg:px-0"
      style="margin-bottom: 22px"
    >
      <ChartCard
        title="Products per Category"
        type="bar"
        :data="categoryChartData"
        :options="categoryChartOptions"
        :span="2"
      />

      <ChartCard
        title="Stock Status"
        mode="donut-status"
        :segments="[
          { label: 'In Stock', value: stockCounts.INSTOCK, status: 'success' },
          { label: 'Low Stock', value: stockCounts.LOWSTOCK, status: 'warning' },
          { label: 'Out of Stock', value: stockCounts.OUTOFSTOCK, status: 'danger' },
        ]"
        center-label="Total Items"
        :span="1"
      />
    </div> -->

    <!--Table-->
    <CustomDataTable
      title="All Products"
      :data="products"
      :columns="[
        { field: 'name', header: 'Product', width: '28%', slot: 'product' },
        { field: 'category', header: 'Category', sortable: true, align: 'center' },
        { field: 'quantity', header: 'Qty', sortable: true, align: 'center' },
        { field: 'price', header: 'Price', sortable: true, align: 'center' },
      ]"
      :filters="filters"
      :search-fields="['name']"
      search-placeholder="Search product...."
      :rows="6"
      :rows-per-page-options="[5, 10, 20]"
    >
      <template #product="{ data }">
        <div class="flex items-center gap-3">
          <img
            :src="data.image"
            :alt="data.name"
            class="w-10 h-10 object -cover rounded-md shadow"
          />
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">{{ data.name }}</span>
            <span class="text-sm text-slate-500">{{ data.category }}</span>
          </div>
        </div>
      </template>

      <template #category="{ data }">
        <Tag :value="data.category" severity="secondary" />
      </template>

      <template #price="{ data }">
        <span class="font-semibold text-slate-700">${{ data.price }}</span>
      </template>

      <template #actions="{ data }">
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          text
          rounded
          size="small"
          aria-label="Edit"
          @click="editProduct(data)"
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          size="small"
          aria-label="Delete"
          @click="deleteProduct(data)"
        />
      </template>
    </CustomDataTable>

    <Dialog
      v-model:visible="showAddDialog"
      header="Add New Product"
      modal
      :style="{ width: '28rem' }"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-sm font-medium text-slate-700 mb-1 block">Product Name</label>
          <InputText v-model="newProduct.name" class="w-full" placeholder="e.g Bamboo Watch" />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-700 mb-1 block">Category</label>
          <Select
            v-model="newProduct.categoryID"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Pilih Kategori"
            class="w-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-slate-700 mb-1 block">Quantity</label>
            <InputNumber v-model="newProduct.quantity" class="w-full" :min="0" />
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700 mb-1 block">Price ($)</label>
            <InputNumber
              v-model="newProduct.price"
              class="w-full"
              :min="0"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background: #fafbfc;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 14px 20px;
}

:deep(.p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 20px;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
}

:deep(.p-datatable-tbody > tr) {
  transition: background-color 0.15s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.p-datatable-column-header-content) {
  gap: 6px;
}

:deep(.text-center) {
  text-align: center;
}

:deep(.text-center .p-datatable-column-header-content) {
  justify-content: center;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
