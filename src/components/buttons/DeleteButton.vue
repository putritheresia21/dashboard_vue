<script setup lang="ts">
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import type { Prop } from 'vue'

interface Props {
  itemName: string
  deleteFn: () => Promise<any>
  onSuccess: () => void
  icon?: string
  severity?: string
  size?: 'small' | 'large'
  text?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'pi pi-trash',
  severity: 'danger',
  size: 'small',
  text: true,
  rounded: true,
})

const confirm = useConfirm()

function handleClick() {
  confirm.require({
    message: `Yakin ingin menghapus "${props.itemName}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await props.deleteFn()
        props.onSuccess()
      } catch (error) {
        console.error('Gagal menghapus:', error)
        alert('Gagal menghapus data')
      }
    },
  })
}
</script>

<template>
  <Button
    :icon="icon"
    :severity="severity"
    :text="text"
    :rounded="rounded"
    :size="size"
    aria-label="Delete"
    @click="handleClick"
  />
</template>
