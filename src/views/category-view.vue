<route lang="yaml">
meta:
  title: Category Product
  requiresAuth: true
</route>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import PlusIcon from '@primeicons/vue/plus'
import Dialog from 'primevue/dialog'
import { InputText } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { getCategories, createCategory, deleteCategory } from '@/services/category-service'
import type { Category } from '@/types/category'
import SearchInput from '@/components/SearchInput.vue'
import DeleteButton from '@/components/buttons/DeleteButton.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'

const categories = ref<Category[]>([])

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

onMounted(() => {
  fetchCategories()
})

const showAddDialog = ref(false)
const newCategoryName = ref('')

// const deleteCategory = async (category: Category) => {
//   confirm.require({
//     message: `Yakin ingin menghapus kategori "${category.name}"?`,
//     header: 'Konfirmasi Hapus',
//     icon: 'pi pi-exclamation-triangle',
//     acceptLabel: 'Hapus',
//     rejectLabel: 'Batal',
//     acceptClass: 'p-button-danger',
//     accept: async () => {
//       try {
//         await deleteCategoryApi(category.id)
//         await fetchCategories()
//       } catch (error) {
//         console.error('Gagal menghapus kategori:', error)
//         alert('Gagal menghapus kategori')
//       }
//     },
//   })
// }

//dialog

function openAddDialog() {
  newCategoryName.value = ''
  showAddDialog.value = true
}

async function saveCategory() {
  if (!newCategoryName.value.trim()) {
    return
  }

  try {
    await createCategory({ name: newCategoryName.value })
    showAddDialog.value = false
    fetchCategories()
  } catch (error) {
    console.error('gagal menyimpan kategori:', error)
    alert('Gagal menyimpan kategori')
  }
}
</script>

<template>
  <div>
    <!--header-->
    <div class="flex items-center justify-between mb-6" style="margin-bottom: 22px">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Categories</h1>
        <p class="text-sm text-slate-400 mt-1">{{ categories.length }}</p>
      </div>
      <button
        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        @click="openAddDialog"
      >
        <PlusIcon size="16" color="#ffffff" />
        Add
      </button>
    </div>

    <!--table-->
    <CustomDataTable
      title="All Category Product"
      :data="categories"
      :columns="[
        { field: 'id', header: 'ID', width: '15%', align: 'center' },
        { field: 'name', header: 'Category Name' },
      ]"
      :search-fields="['name']"
      search-placeholder="Search category..."
      :rows="5"
      :rows-per-page-options="[5, 10, 20]"
    >
      <template #name="{ data }">
        <span class="text-sm text-slate-700">{{ data.name }}</span>
      </template>
      <template #actions="{ data }">
        <DeleteButton
          :item-name="data.name"
          :delete-fn="() => deleteCategory(data.id)"
          :on-success="fetchCategories"
        />
      </template>
    </CustomDataTable>

    <!--dialog-->
    <Dialog
      v-model:visible="showAddDialog"
      header="Tambah Kategori Baru"
      modal
      :style="{ width: '24rem' }"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-sm font-medium text-slate-700 block" style="margin-bottom: 6px"
            >Nama Kategori</label
          >
          <InputText v-model="newCategoryName" class="w-full" placeholder="e.g. Electronics" />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="showAddDialog = false" />
          <Button label="Save Category" @click="saveCategory" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped></style>
