<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { Select } from 'primevue'
import Button from 'primevue/button'

type FieldType = 'text' | 'number' | 'currency' | 'select'
type DialogMode = 'add' | 'edit' | 'delete' | null

type FieldOption = {
  label: string
  value: string | number
}

type FieldDef = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: FieldOption[]
  placeholder?: string
}

const props = defineProps<{
  mode: DialogMode
  fields?: FieldDef[]
  initialData?: Record<string, any>
  itemLabel?: string //buat pesan delete
  entityName?: string //buat judul otomatis berdasarkan halaman yg dibuka
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: Record<string, any>]
  confirmDelete: []
}>()

const form = ref<Record<string, any>>({})
const errorMessage = ref('')

watch(
  () => props.mode,
  (newMode) => {
    if (newMode === 'add' || newMode === 'edit') {
      const initial = props.initialData ?? {}
      form.value = Object.fromEntries(
        (props.fields ?? []).map((f) => [
          f.key,
          initial[f.key] ?? (f.type === 'number' || f.type === 'currency' ? 0 : ''),
        ]),
      )
      errorMessage.value = ''
    }
  },
)

const dialogConfig = computed(() => {
  switch (props.mode) {
    case 'add':
      return {
        visible: true,
        header: `Add New ${props.entityName ?? 'Item'}`,
        showForm: true,
        showConfirm: false,
        confirmLabel: 'Save',
      }
    case 'edit':
      return {
        visible: true,
        header: `Edit ${props.entityName ?? 'Item'}`,
        showForm: true,
        showConfirm: true,
        confirmLabel: 'Save Changes',
      }
    case 'delete':
      return {
        visible: true,
        header: 'Konfirmasi Hapus',
        showForm: false,
        showConfirm: true,
        confirmLabel: 'Hapus',
      }
    default:
      return {
        visible: false,
        header: '',
        showForm: false,
        showConfirm: false,
        confirmLabel: '',
      }
  }
})

function validate(): boolean {
  for (const field of props.fields ?? []) {
    const value = form.value[field.key]
    if (field.required && !value && value !== 0) {
      errorMessage.value = `${field.label} wajib diisi`
      return false
    }
  }
  errorMessage.value = ''
  return true
}

function handleConfirm() {
  switch (props.mode) {
    case 'add':
    case 'edit':
      if (!validate()) return
      emit('submit', { ...form.value, id: props.initialData?.id })
      break
    case 'delete':
      emit('confirmDelete')
      break
  }
}

function close() {
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="dialogConfig.visible"
    @update:visible="close"
    :header="dialogConfig.header"
    modal
    :style="{ width: mode === 'delete' ? '24rem' : '28rem' }"
  >
    <!--add/edit form dialog-->
    <div v-if="dialogConfig.showForm" class="flex flex-col gap-4">
      <div v-for="field in fields" :key="field.key">
        <label class="text-sm fonnt-medium text-slate-700 mb-1 block">{{ field.label }}</label>

        <InputText v-if="field.type === 'text'" v-model="form[field.key]" class="w-full" :min="0" />
        <InputNumber
          v-else-if="field.type === 'number'"
          v-model="form[field.key]"
          class="w-full"
          :min="0"
        />
        <InputNumber
          v-else-if="field.type === 'currency'"
          v-model="form[field.key]"
          class="w-full"
          :min="0"
          mode="currency"
          currency="IDR"
          locale="id-ID"
        />
        <Select
          v-else-if="field.type === 'select'"
          v-model="form[field.key]"
          :options="field.options"
          optionLabel="label"
          optionValue="value"
          :placeholder="field.placeholder"
          class="w-full"
        />
      </div>
      <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
    </div>

    <!--confirm delete-->
    <div v-else-if="dialogConfig.showConfirm" class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-red-500 text-xl" />
      <span class="text-sm text-slate-700">
        Yakin ingin menghapus <strong>{{ itemLabel }}</strong
        >? Tindakan ini tidak bisa dibatalkan.
      </span>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="close" />
      <Button
        :label="dialogConfig.confirmLabel"
        :severity="mode === 'delete' ? 'danger' : 'primary'"
        :loading="loading"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>
