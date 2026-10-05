import type { SalesPerson } from '@/features/reporting/mocks/salesData'
import { formatRupiah } from '@/shared/utils/formatter'

function renderHistoryRows(person: SalesPerson): string {
  return person.targetHistory
    .map(
      (history) => `
    <tr>
      <td class="border border-bnf-border p-2">${history.month}</td>
      <td class="border border-bnf-border p-2 text-right">${formatRupiah(history.target)}</td>
      <td class="border border-bnf-border p-2 text-right">${formatRupiah(history.achieved)}</td>
      <td class="border border-bnf-border p-2 text-center text-bnf-success font-bold">${((history.achieved / history.target) * 100).toFixed(2)}%</td>
    </tr>`,
    )
    .join('')
}

function renderProductRows(person: SalesPerson): string {
  return person.products
    .map(
      (product) => `
    <tr>
      <td class="border border-bnf-border p-2 font-medium">${product.name}</td>
      <td class="border border-bnf-border p-2">${product.category}</td>
      <td class="border border-bnf-border p-2 text-center">${product.qty}</td>
      <td class="border border-bnf-border p-2 text-right">${formatRupiah(product.revenue)}</td>
    </tr>`,
    )
    .join('')
}

function renderDocumentHeader(person: SalesPerson): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
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
  <header class="border-b-2 border-bnf-text pb-4 mb-6 flex justify-between items-end">
    <div>
      <h1 class="text-3xl font-bold tracking-tight uppercase text-bnf-text">Nusantara Sales Corp</h1>
      <p class="text-sm text-bnf-text-muted mt-1">Divisi Sumber Daya Manusia & Kinerja</p>
    </div>
    <div class="text-right text-sm">
      <p><strong>Dokumen:</strong> PR-2026-Q3-001</p>
      <p><strong>Tanggal:</strong> 10 September 2026</p>
    </div>
  </header>
  <h2 class="text-xl font-bold text-center mb-6 uppercase tracking-wider">Laporan Evaluasi Kinerja Individu</h2>
  <section class="mb-8 p-4 border border-bnf-border rounded-lg flex items-start gap-6 bg-bnf-surface-muted">
    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=120&background=0D8ABC&color=fff&bold=true" class="w-24 h-24 rounded-full shadow-sm" />
    <div class="flex-1 grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
      <div><span class="text-bnf-text-muted block text-xs uppercase">Nama Lengkap</span><span class="font-semibold text-lg">${person.name}</span></div>
      <div><span class="text-bnf-text-muted block text-xs uppercase">ID Karyawan</span><span class="font-medium">${person.id}</span></div>
      <div><span class="text-bnf-text-muted block text-xs uppercase">Departemen</span><span class="font-medium">${person.department}</span></div>
      <div><span class="text-bnf-text-muted block text-xs uppercase">Area/Kota</span><span class="font-medium">${person.city}</span></div>
      <div><span class="text-bnf-text-muted block text-xs uppercase">Email</span><span class="font-medium">${person.email}</span></div>
      <div><span class="text-bnf-text-muted block text-xs uppercase">No. Telepon</span><span class="font-medium">${person.phone}</span></div>
    </div>
  </section>`
}

function renderSummary(person: SalesPerson): string {
  return `
  <section class="mb-8 grid grid-cols-4 gap-4">
    <div class="p-4 border border-bnf-border rounded-lg text-center">
      <p class="text-xs text-bnf-text-muted uppercase mb-1">Target Penjualan</p>
      <p class="text-lg font-bold">${formatRupiah(person.target)}</p>
    </div>
    <div class="p-4 border border-bnf-primary bg-bnf-primary/5 rounded-lg text-center">
      <p class="text-xs text-bnf-primary uppercase mb-1">Total Pencapaian</p>
      <p class="text-lg font-bold text-bnf-primary">${formatRupiah(person.achieved)}</p>
    </div>
    <div class="p-4 border border-bnf-success bg-bnf-success/10 rounded-lg text-center">
      <p class="text-xs text-bnf-success uppercase mb-1">Total Komisi</p>
      <p class="text-lg font-bold text-bnf-success">${formatRupiah(person.commission)}</p>
    </div>
    <div class="p-4 border border-bnf-border rounded-lg text-center flex flex-col justify-center items-center">
      <p class="text-xs text-bnf-text-muted uppercase mb-1">Status Kinerja</p>
      <span class="bg-bnf-success/10 text-bnf-success text-sm font-bold px-3 py-1 rounded-full border border-bnf-success">${person.status}</span>
    </div>
  </section>`
}

function renderHistorySection(rows: string): string {
  return `
  <section class="mb-8">
    <h3 class="text-md font-bold mb-3 border-l-4 border-bnf-primary pl-2">Riwayat Pencapaian Bulanan (Q3)</h3>
    <table class="w-full text-sm border-collapse border border-bnf-border">
      <thead class="bg-bnf-surface-muted text-left">
        <tr>
          <th class="font-bold border border-bnf-border p-2">Bulan</th>
          <th class="font-bold border border-bnf-border p-2 text-right">Target (Rp)</th>
          <th class="font-bold border border-bnf-border p-2 text-right">Pencapaian (Rp)</th>
          <th class="font-bold border border-bnf-border p-2 text-center">Persentase</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`
}

function renderProductSection(person: SalesPerson, rows: string): string {
  return `
  <section class="mb-8">
    <h3 class="text-md font-bold mb-3 border-l-4 border-bnf-primary pl-2">Rincian Penjualan Produk</h3>
    <table class="w-full text-sm border-collapse border border-bnf-border">
      <thead class="bg-bnf-surface-muted text-left">
        <tr>
          <th class="font-bold border border-bnf-border p-2">Nama Produk</th>
          <th class="font-bold border border-bnf-border p-2">Kategori</th>
          <th class="font-bold border border-bnf-border p-2 text-center">Qty</th>
          <th class="font-bold border border-bnf-border p-2 text-right">Pendapatan (Rp)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot class="bg-bnf-surface-muted font-bold">
        <tr>
          <td colspan="3" class="font-bold border border-bnf-border p-2 text-right">Total Achieved</td>
          <td class="font-bold border border-bnf-border p-2 text-right text-bnf-primary">${formatRupiah(person.achieved)}</td>
        </tr>
      </tfoot>
    </table>
  </section>`
}

function renderSignature(person: SalesPerson): string {
  return `
  <section class="mt-16 flex justify-between px-10 text-sm">
    <div class="text-center">
      <p class="mb-20">Karyawan,</p>
      <p class="font-bold underline">${person.name}</p>
      <p class="text-bnf-text-muted">${person.department}</p>
    </div>
    <div class="text-center">
      <p class="mb-20">Mengetahui, Sales Manager</p>
      <p class="font-bold underline">Budi Santoso</p>
      <p class="text-bnf-text-muted">Head of Sales</p>
    </div>
  </section>
</body>
</html>`
}

export function buildSalesReportHtml(person: SalesPerson): string {
  const historyRows = renderHistoryRows(person)
  const productRows = renderProductRows(person)

  return [
    renderDocumentHeader(person),
    renderSummary(person),
    renderHistorySection(historyRows),
    renderProductSection(person, productRows),
    renderSignature(person),
  ].join('')
}
