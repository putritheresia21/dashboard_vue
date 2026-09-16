<script setup lang="ts">
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import axios from 'axios'

const toast = useToast()
const isExporting = ref(false)

const props = withDefaults(
  defineProps<{
    buildHtml: () => string
    disabled?: boolean
    label?: string
    buttonClass?: string
  }>(),
  {
    disabled: false,
    label: 'Export PDF',
    buttonClass: 'w-auto',
  },
)

async function handleExport() {
  isExporting.value = true
  try {
    const html = props.buildHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const formData = new FormData()
    formData.append('filed', blob, 'index.html')

    const response = await axios.post('/gotenberg/forms/chromium/convert/html', formData, {
      responseType: 'blob',
    })

    // Di Axios, data blob ada di response.data
    const blobUrl = URL.createObjectURL(response.data)
    window.open(blobUrl, '_blank')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'gagal',
      detail: 'Terjadi kesalahan saat membuat PDF.',
      life: 4000,
    })
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <Button
    icon="pi pi-file-pdf"
    :label="label"
    severity="secondary"
    outlined
    :loading="isExporting"
    :disabled="disabled"
    :class="buttonClass"
    @click="handleExport"
  />
</template>
