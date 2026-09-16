import type { SalesPerson } from '@/dummy/salesData'
import { formatRupiah } from '@/utils/formatter'

export function buildSalesReportHtml(p: SalesPerson): string {
  const rowsHistory = p.targetHistory
    .map(
      (h) => `
    <tr>
      <td class="border border-gray-300 p-2">${h.month}</td>
      <td class="border border-gray-300 p-2 text-right">${formatRupiah(h.target)}</td>
      <td class="border border-gray-300 p-2 text-right">${formatRupiah(h.achieved)}</td>
      <td class="border border-gray-300 p-2 text-center text-green-600 font-bold">${((h.achieved / h.target) * 100).toFixed(2)}%</td>
    </tr>`,
    )
    .join('')

  const rowsProduct = p.products
    .map(
      (prod) => `
    <tr>
      <td class="border border-gray-300 p-2 font-medium">${prod.name}</td>
      <td class="border border-gray-300 p-2">${prod.category}</td>
      <td class="border border-gray-300 p-2 text-center">${prod.qty}</td>
      <td class="border border-gray-300 p-2 text-right">${formatRupiah(prod.revenue)}</td>
    </tr>`,
    )
    .join('')

  return (
    `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><` +
    `/script>
<style>
  @media print {
    @page { size: A4 portrait; margin: 20mm 20mm 25mm 20mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
  table { break-inside: auto; }
  tr { break-inside: avoid; break-after: auto; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
</style>
</head>
<body>
  <header class="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
    <div>
      <h1 class="text-3xl font-bold tracking-tight uppercase text-gray-900">Nusantara Sales Corp</h1>
      <p class="text-sm text-gray-500 mt-1">Divisi Sumber Daya Manusia & Kinerja</p>
    </div>
    <div class="text-right text-sm">
      <p><strong>Dokumen:</strong> PR-2026-Q3-001</p>
      <p><strong>Tanggal:</strong> 10 September 2026</p>
    </div>
  </header>
  <h2 class="text-xl font-bold text-center mb-6 uppercase tracking-wider">Laporan Evaluasi Kinerja Individu</h2>
  <section class="mb-8 p-4 border border-gray-300 rounded-lg flex items-start gap-6 bg-gray-50">
    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=120&background=0D8ABC&color=fff&bold=true" class="w-24 h-24 rounded-full shadow-sm" />
    <div class="flex-1 grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
      <div><span class="text-gray-500 block text-xs uppercase">Nama Lengkap</span><span class="font-semibold text-lg">${p.name}</span></div>
      <div><span class="text-gray-500 block text-xs uppercase">ID Karyawan</span><span class="font-medium">${p.id}</span></div>
      <div><span class="text-gray-500 block text-xs uppercase">Departemen</span><span class="font-medium">${p.department}</span></div>
      <div><span class="text-gray-500 block text-xs uppercase">Area/Kota</span><span class="font-medium">${p.city}</span></div>
      <div><span class="text-gray-500 block text-xs uppercase">Email</span><span class="font-medium">${p.email}</span></div>
      <div><span class="text-gray-500 block text-xs uppercase">No. Telepon</span><span class="font-medium">${p.phone}</span></div>
    </div>
  </section>
  <section class="mb-8 grid grid-cols-4 gap-4">
    <div class="p-4 border border-gray-200 rounded-lg text-center">
      <p class="text-xs text-gray-500 uppercase mb-1">Target Penjualan</p>
      <p class="text-lg font-bold">${formatRupiah(p.target)}</p>
    </div>
    <div class="p-4 border border-blue-200 bg-blue-50 rounded-lg text-center">
      <p class="text-xs text-blue-600 uppercase mb-1">Total Pencapaian</p>
      <p class="text-lg font-bold text-blue-800">${formatRupiah(p.achieved)}</p>
    </div>
    <div class="p-4 border border-green-200 bg-green-50 rounded-lg text-center">
      <p class="text-xs text-green-600 uppercase mb-1">Total Komisi</p>
      <p class="text-lg font-bold text-green-800">${formatRupiah(p.commission)}</p>
    </div>
    <div class="p-4 border border-gray-200 rounded-lg text-center flex flex-col justify-center items-center">
      <p class="text-xs text-gray-500 uppercase mb-1">Status Kinerja</p>
      <span class="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full border border-green-300">${p.status}</span>
    </div>
  </section>
  <section class="mb-8">
    <h3 class="text-md font-bold mb-3 border-l-4 border-blue-600 pl-2">Riwayat Pencapaian Bulanan (Q3)</h3>
    <table class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="font-bold border border-gray-300 p-2">Bulan</th>
          <th class="font-bold border border-gray-300 p-2 text-right">Target (Rp)</th>
          <th class="font-bold border border-gray-300 p-2 text-right">Pencapaian (Rp)</th>
          <th class="font-bold border border-gray-300 p-2 text-center">Persentase</th>
        </tr>
      </thead>
      <tbody>${rowsHistory}</tbody>
    </table>
  </section>
  <section class="mb-8">
    <h3 class="text-md font-bold mb-3 border-l-4 border-blue-600 pl-2">Rincian Penjualan Produk</h3>
    <table class="w-full text-sm border-collapse border border-gray-300">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="font-bold border border-gray-300 p-2">Nama Produk</th>
          <th class="font-bold border border-gray-300 p-2">Kategori</th>
          <th class="font-bold border border-gray-300 p-2 text-center">Qty</th>
          <th class="font-bold border border-gray-300 p-2 text-right">Pendapatan (Rp)</th>
        </tr>
      </thead>
      <tbody>${rowsProduct}</tbody>
      <tfoot class="bg-gray-50 font-bold">
        <tr>
          <td colspan="3" class="font-bold border border-gray-300 p-2 text-right">Total Achieved</td>
          <td class="font-bold border border-gray-300 p-2 text-right text-blue-700">${formatRupiah(p.achieved)}</td>
        </tr>
      </tfoot>
    </table>
  </section>
  <section class="mt-16 flex justify-between px-10 text-sm">
    <div class="text-center">
      <p class="mb-20">Karyawan,</p>
      <p class="font-bold underline">${p.name}</p>
      <p class="text-gray-500">${p.department}</p>
    </div>
    <div class="text-center">
      <p class="mb-20">Mengetahui, Sales Manager</p>
      <p class="font-bold underline">Budi Santoso</p>
      <p class="text-gray-500">Head of Sales</p>
    </div>
  </section>
</body>
</html>`
  )
}
