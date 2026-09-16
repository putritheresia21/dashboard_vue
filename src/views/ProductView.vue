<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import PlusIcon from '@primeicons/vue/plus'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import CustomDataTable from '@/components/CustomDataTable.vue'
import { ArrowUpIcon } from '@primevue/icons'
import { productsData, categoryOptionsDummy, type Product } from '@/dummy/productsData'
import { useConfirmDelete } from '@/composables/useConfirmDelete'
import { getPercent } from '@/utils/formatter'
// TODO: kalau backend sudah siap, ganti productsData dengan hasil getProducts()/getCategories()
// import { getProducts, createProduct } from '@/services/product-service'
// import { getCategories } from '@/services/category-service'

const products = ref<Product[]>(productsData)
const categories = ref(categoryOptionsDummy)

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

const columns = computed(() => [
  {
    field: 'name',
    header: 'Product',
    sortable: true,
    type: 'icon-text' as const,
    iconField: 'image',
    titleField: 'name',
    subtitleField: 'code',
  },
  { field: 'category', header: 'Category', sortable: true, align: 'center' as const },
  { field: 'quantity', header: 'Qty', sortable: true, align: 'center' as const },
  {
    field: 'price',
    header: 'Price',
    sortable: true,
    align: 'center' as const,
    format: (v: number) => `$${v}`,
  },
  {
    field: 'inventoryStatus',
    header: 'Status',
    sortable: true,
    align: 'center' as const,
    slot: 'status',
  },
])

const exportColumns = columns.value.map(({ field, header }) => ({ key: field, header }))

const filters = [
  { type: 'select' as const, key: 'category', placeholder: 'Filter Category' },
  { type: 'select' as const, key: 'inventoryStatus', placeholder: 'Filter Status' },
  {
    type: 'range' as const,
    key: 'price',
    label: 'Harga',
    min: 0,
    max: 150,
    unit: '$',
    compute: (row: Product) => row.price,
  },
  {
    type: 'range' as const,
    key: 'quantity',
    label: 'Stok',
    min: 0,
    max: 100,
    unit: 'pcs',
    compute: (row: Product) => row.quantity,
  },
]
// --- Summary cards (toggle) ---
const showSummaryCards = ref(false)

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
  { label: 'Total Products', value: String(totalProducts.value), change: '' },
  { label: 'Stock Value', value: `$${totalStockValue.value.toLocaleString()}`, change: '' },
  { label: 'Low Stock', value: String(lowStockCount.value), change: '' },
  { label: 'Out of Stock', value: String(outOfStockCount.value), change: '' },
])

// --- Actions ---
const editProduct = (product: Product) => {
  console.log('Edit:', product)
}

const deleteProduct = (product: Product) => {
  const confirmed = window.confirm(`Yakin ingin menghapus ${product.name}?`)
  if (confirmed) {
    products.value = products.value.filter((p) => p.id !== product.id)
  }
}

// --- Add product dialog ---
const showAddDialog = ref(false)
const saving = ref(false)

const newProduct = ref({
  name: '',
  categoryID: null as number | null,
  quantity: 0,
  price: 0,
})

function openAddDialog() {
  newProduct.value = { name: '', categoryID: null, quantity: 0, price: 0 }
  showAddDialog.value = true
}

function generateProductCode(): string {
  return `PRD-${String(products.value.length + 1).padStart(4, '0')}`
}

function saveNewProduct() {
  if (!newProduct.value.name || !newProduct.value.categoryID) {
    alert('Nama produk dan kategori wajib diisi')
    return
  }
  const cat = categories.value.find((c) => c.id === newProduct.value.categoryID)!
  const qty = newProduct.value.quantity

  products.value.push({
    id: products.value.length + 1,
    code: generateProductCode(),
    name: newProduct.value.name,
    category: cat.name,
    categoryId: cat.id,
    quantity: qty,
    price: newProduct.value.price,
    image: `https://placehold.co/100x100/0d9488/white?text=${newProduct.value.name.charAt(0)}`,
    inventoryStatus: qty === 0 ? 'OUTOFSTOCK' : qty <= 10 ? 'LOWSTOCK' : 'INSTOCK',
    rating: 4,
    description: '',
    stockHistory: [],
  })

  showAddDialog.value = false
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
      <div class="flex items-center gap-2">
        <Button
          :label="showSummaryCards ? 'Sembunyikan Ringkasan' : 'Tampilkan Ringkasan'"
          :icon="showSummaryCards ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          icon-pos="right"
          severity="secondary"
          outlined
          size="small"
          @click="showSummaryCards = !showSummaryCards"
        />
        <button
          class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          @click="openAddDialog"
        >
          <PlusIcon size="16" color="#ffffff" />
          Add Product
        </button>
      </div>
    </div>

    <!--Summary cards-->
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

    <!--Table-->
    <CustomDataTable
      title="All Products"
      subtitle="Klik header kolom untuk sorting"
      :data="products"
      :columns="columns"
      :filters="filters"
      :search-fields="['name', 'code']"
      search-placeholder="Search product...."
      :rows="8"
      :rows-per-page-options="[5, 10, 20]"
      show-edit
      show-delete
      show-export
      export-file-name="Daftar Produk"
      @edit="editProduct"
      @delete="deleteProduct"
    >
      <template #status="{ data }">
        <Tag
          :value="getSeverityLabel(data.inventoryStatus)"
          :severity="getSeverity(data.inventoryStatus)"
        />
      </template>
    </CustomDataTable>

    <!--Add product dialog-->
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
        <Button label="Save" :loading="saving" @click="saveNewProduct" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
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
