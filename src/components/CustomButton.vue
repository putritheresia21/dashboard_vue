<script setup lang="ts">
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'

const props = withDefaults(
  defineProps<{
    type?: 'custom' | 'delete'
    itemName?: string //diisi kalau mau pakai button delete
  }>(),
  { type: 'custom' },
)

const emit = defineEmits<{ confirm: [] }>()
const confirm = useConfirm()

function handleDeleteClick() {
  confirm.require({
    message: `Yakin ingin menghapus "${props.itemName}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger',
    accept: () => emit('confirm'),
  })
}
</script>

<template>
  <!--button delete-->
  <Button
    v-if="type === 'delete'"
    icon="pi pi-trash"
    severity="danger"
    text
    rounded
    size="small"
    aria-label="Delete"
    @click="handleDeleteClick"
  />

  <!--button custom-->
  <button v-else class="flex items-center gap-2 rounded-xl font-medium transition-colors">
    <slot></slot>
  </button>
</template>
