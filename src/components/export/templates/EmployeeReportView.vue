<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import pageReport from '@/assets/pages/pageReport.css?raw'
import { salesTeamData } from '@/dummy/salesData'
import { formatRupiah } from '@/utils/formatter'

// mengatur data yang diambil
const route = useRoute()
const employeeId = computed(() => Number(route.params.id))
const employee = computed(() => salesTeamData.find((person) => person.id === employeeId.value))
// conversi menjadi halaman
let pagedInstance: any = null

onMounted(async () => {
  await nextTick() // Tunggu Vue selesai render DOM

  // Import Previewer (bukan polyfill)
  const { Previewer } = await import('pagedjs')

  const content = document.querySelector('#book-content') as HTMLElement
  const target = document.querySelector('#paged-output') as HTMLElement

  if (!content || !target) return

  pagedInstance = new Previewer()

  // Buat Blob URL dari string CSS
  const blob = new Blob([pageReport], { type: 'text/css' })
  const cssUrl = URL.createObjectURL(blob)

  try {
    await pagedInstance.preview(
      content.innerHTML, // konten HTML mentah
      [cssUrl], // stylesheets tambahan (kosong = pakai CSS di halaman)
      target, // container output
    )
  } catch (e) {
    console.error('Paged.js error:', e)
  }
})
onUnmounted(() => {
  // Bersihkan DOM yang dihasilkan Paged.js
  const target = document.querySelector('#paged-output')
  if (target) target.innerHTML = ''
})
</script>

<template>
  <div id="book-content" style="display: none">
    <!-- HEADER / KOP SURAT -->
    <header class="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold tracking-tight uppercase text-gray-900">
          Nusantara Sales Corp
        </h1>
        <p class="text-sm text-gray-500 mt-1">Divisi Sumber Daya Manusia & Kinerja</p>
      </div>
      <div class="text-right text-sm">
        <p><strong>Dokumen:</strong> PR-2026-Q3-001</p>
        <p><strong>Tanggal:</strong> 10 September 2026</p>
      </div>
    </header>

    <h2 class="text-xl font-bold text-center mb-6 uppercase tracking-wider">
      Laporan Evaluasi Kinerja Individu
    </h2>

    <!-- PROFIL KARYAWAN -->
    <section class="mb-8 p-4 border border-gray-300 rounded-lg flex items-start gap-6 bg-gray-50">
      <!-- Avatar Dummy -->
      <img
        src="https://ui-avatars.com/api/?name=Elwin+Sharvill&size=120&background=0D8ABC&color=fff&bold=true"
        alt="Avatar"
        class="w-24 h-24 rounded-full shadow-sm"
      />

      <div class="flex-1 grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
        <div>
          <span class="text-gray-500 block text-xs uppercase">Nama Lengkap</span>
          <span class="font-semibold text-lg">{{ employee?.name }}</span>
        </div>
        <div>
          <span class="text-gray-500 block text-xs uppercase">ID Karyawan</span>
          <span class="font-medium">{{ employee?.id }}</span>
        </div>

        <div>
          <span class="text-gray-500 block text-xs uppercase">Departemen</span>
          <span class="font-medium">{{ employee?.department }}</span>
        </div>
        <div>
          <span class="text-gray-500 block text-xs uppercase">Area/Kota</span>
          <span class="font-medium">{{ employee?.city }}</span>
        </div>

        <div>
          <span class="text-gray-500 block text-xs uppercase">Email</span>
          <span class="font-medium">{{ employee?.email }}</span>
        </div>
        <div>
          <span class="text-gray-500 block text-xs uppercase">No. Telepon</span>
          <span class="font-medium">{{ employee?.phone }}</span>
        </div>
      </div>
    </section>

    <!-- KPI SUMMARY (Sorotan Kinerja) -->
    <section class="mb-8 grid grid-cols-4 gap-4">
      <div class="p-4 border border-gray-200 rounded-lg text-center">
        <p class="text-xs text-gray-500 uppercase mb-1">Target Penjualan</p>
        <p class="text-lg font-bold">{{ employee?.target ? formatRupiah(employee.target) : '' }}</p>
      </div>
      <div class="p-4 border border-blue-200 bg-blue-50 rounded-lg text-center">
        <p class="text-xs text-blue-600 uppercase mb-1">Total Pencapaian</p>
        <p class="text-lg font-bold text-blue-800">
          {{ employee?.achieved ? formatRupiah(employee.achieved) : '' }}
        </p>
      </div>
      <div class="p-4 border border-green-200 bg-green-50 rounded-lg text-center">
        <p class="text-xs text-green-600 uppercase mb-1">Total Komisi</p>
        <p class="text-lg font-bold text-green-800">
          {{ employee?.commission ? formatRupiah(employee.commission) : '' }}
        </p>
      </div>
      <div
        class="p-4 border border-gray-200 rounded-lg text-center flex flex-col justify-center items-center"
      >
        <p class="text-xs text-gray-500 uppercase mb-1">Status Kinerja</p>
        <!-- Badge Status -->
        <span
          class="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full border border-green-300"
        >
          {{ employee?.status }}
        </span>
      </div>
    </section>

    <!-- RIWAYAT KINERJA BULANAN (targetHistory) -->
    <section class="mb-8">
      <h3 class="text-md font-bold mb-3 border-l-4 border-blue-600 pl-2">
        Riwayat Pencapaian Bulanan (Q3)
      </h3>
      <table class="w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="border border-gray-300 p-2">Bulan</th>
            <th class="border border-gray-300 p-2 text-right">Target (Rp)</th>
            <th class="border border-gray-300 p-2 text-right">Pencapaian (Rp)</th>
            <th class="border border-gray-300 p-2 text-center">Persentase</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in employee?.targetHistory">
            <td class="border border-gray-300 p-2">{{ history.month }}</td>
            <td class="border border-gray-300 p-2 text-right">{{ history.target }}</td>
            <td class="border border-gray-300 p-2 text-right">{{ history.achieved }}</td>
            <td class="border border-gray-300 p-2 text-center text-green-600 font-bold">
              {{ (history.achieved / history.target) * 100 }}%
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- RINCIAN PRODUK TERJUAL (products) -->
    <section class="mb-8">
      <h3 class="text-md font-bold mb-3 border-l-4 border-blue-600 pl-2">
        Rincian Penjualan Produk
      </h3>
      <table class="w-full text-sm border-collapse border border-gray-300">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="border border-gray-300 p-2">Nama Produk</th>
            <th class="border border-gray-300 p-2">Kategori</th>
            <th class="border border-gray-300 p-2 text-center">Qty</th>
            <th class="border border-gray-300 p-2 text-right">Pendapatan (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in employee?.products">
            <td class="border border-gray-300 p-2 font-medium">{{ product.name }}</td>
            <td class="border border-gray-300 p-2">{{ product.category }}</td>
            <td class="border border-gray-300 p-2 text-center">{{ product.qty }}</td>
            <td class="border border-gray-300 p-2 text-right">{{ product.revenue }}</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 font-bold">
          <tr>
            <td colspan="3" class="border border-gray-300 p-2 text-right">Total Achieved</td>
            <td class="border border-gray-300 p-2 text-right text-blue-700">
              {{ employee?.achieved }}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>

    <!-- AREA TANDA TANGAN -->
    <section class="mt-16 flex justify-between px-10 text-sm">
      <div class="text-center">
        <p class="mb-20">Karyawan,</p>
        <p class="font-bold underline">{{ employee?.name }}</p>
        <p class="text-gray-500">{{ employee?.department }}</p>
      </div>

      <div class="text-center">
        <p class="mb-20">Mengetahui, Sales Manager</p>
        <p class="font-bold underline">Budi Santoso</p>
        <p class="text-gray-500">Head of Sales</p>
      </div>
    </section>
  </div>

  <div id="paged-output"></div>
</template>

<style>
/* 1. Aturan Halaman Paged.js */
@page {
  size: A4;
  margin: 20mm 20mm 25mm 20mm;

  @bottom-right {
    content: 'Halaman ' counter(page) ' dari ' counter(pages);
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 10px;
    color: #6b7280;
  }
  @bottom-left {
    content: 'Confidential - Laporan Evaluasi Kinerja Penjualan';
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 10px;
    color: #6b7280;
  }
}

/* 2. Perlindungan Tabel agar tidak terpotong */
table {
  page-break-inside: auto;
}
tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

/* 3. PENGGANTI POLYFILL: Reset antarmuka layar saat mode cetak (Ctrl+P) dipanggil */
@media print {
  /* Hapus batas dan margin struktur utama Vue */
  html,
  body,
  #app,
  .paged-report-container {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  /* Hilangkan bayangan kertas dan margin layar bawaan antarmuka Paged.js */
  .pagedjs_pages {
    display: block !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .pagedjs_page {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    page-break-after: always !important; /* Paksa ganti kertas fisik */
  }

  /* Paksa browser mencetak warna latar Tailwind */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Nonaktifkan margin bawaan dari mesin printer browser */
  @page {
    margin: 0 !important;
  }
}
</style>
