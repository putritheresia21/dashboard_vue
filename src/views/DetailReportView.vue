<template>
    <Button @click="handleExport" placeholder="Download" />
</template>

<script setup lang="ts">
import { useHtmlRenderer } from '@/composables/useHtmlRenderer'
import CobaTemplate from '@/components/export/templates/CobaTemplate.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { salesTeamData } from '@/dummy/salesData'
import { Button } from 'primevue'

// mengatur data yang diambil
const route = useRoute()
const employeeId = computed(() => Number(route.params.id))
const employee = computed(() => salesTeamData.find((person) => person.id === employeeId.value))

const { renderTemplate, sendToPDF } = useHtmlRenderer()

async function handleExport() {
    const data = {
        employee: employee.value
    }

    // Opsi 1: Dapat HTML string
    const html = await renderTemplate(CobaTemplate, data)
    console.log(html)

    // Opsi 2: Langsung ke PDF via Gotenberg
    const pdfBlob = await sendToPDF(CobaTemplate, data)

    // 2. Buat URL lokal untuk blob tersebut
    const blobUrl = URL.createObjectURL(pdfBlob)

    // 2. Buka URL tersebut di tab/window baru
    window.open(blobUrl, '_blank')

    // 3. Bersihkan memori URL objek dengan delay
    // (Delay diperlukan agar browser punya waktu untuk memuat PDF di tab baru sebelum URL-nya dihancurkan)
    // setTimeout(() => {
    //     URL.revokeObjectURL(blobUrl)
    // }, 5000) // 5 detik biasanya sudah lebih dari cukup
}
</script>
