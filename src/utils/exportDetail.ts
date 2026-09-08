import type { SalesPerson } from '@/dummy/salesData'
import { formatRupiah, formatDate, getAge, getTenure, getPercent } from '@/utils/formatter'

const escapeHtml = (str: string) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export function buildSalesDetailHtml(p: SalesPerson): string {
  const pct = getPercent(p.achieved, p.target)

  const historyRows = p.targetHistory
    .map(
      (h) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(h.month)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatRupiah(h.target)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatRupiah(h.achieved)}</td>
      </tr>`,
    )
    .join('')

  const productRows = p.products
    .map(
      (prod) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(prod.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(prod.category)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${prod.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatRupiah(prod.revenue)}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Detail Sales - ${escapeHtml(p.name)}</title>
<style>
  body { font-family: Arial, sans-serif; color: #1e293b; padding: 32px; max-width: 700px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .muted { color: #64748b; font-size: 13px; }
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 24px 0 8px; font-weight: 600; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .box { background: #f8fafc; border-radius: 8px; padding: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px; background: #f8fafc; font-size: 12px; color: #64748b; text-transform: uppercase; }
  .bar-bg { background: #e2e8f0; border-radius: 999px; height: 8px; overflow: hidden; margin-top: 4px; }
  .bar-fill { height: 100%; background: ${pct >= 100 ? '#10b981' : '#eab308'}; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>${escapeHtml(p.name)}</h1>
  <p class="muted">${escapeHtml(p.email)} · ${escapeHtml(p.phone)}</p>
  <p class="muted">${escapeHtml(p.department)} · ${escapeHtml(p.city)}</p>

  <div class="section-title">Biodata</div>
  <div class="grid">
    <div class="box"><strong>Tanggal Lahir</strong><br/>${formatDate(p.birthDate)} (${getAge(p.birthDate)} tahun)</div>
    <div class="box"><strong>Bergabung Sejak</strong><br/>${formatDate(p.joinDate)} (${getTenure(p.joinDate)})</div>
    <div class="box" style="grid-column: span 2"><strong>Alamat</strong><br/>${escapeHtml(p.address)}</div>
  </div>

  <div class="section-title">Ringkasan</div>
  <div class="grid">
    <div class="box"><strong>Target</strong><br/>${formatRupiah(p.target)}</div>
    <div class="box"><strong>Tercapai</strong><br/>${formatRupiah(p.achieved)}</div>
    <div class="box"><strong>Komisi</strong><br/>${formatRupiah(p.commission)}</div>
    <div class="box"><strong>Status</strong><br/>${escapeHtml(p.status)}</div>
  </div>
  <div class="box" style="margin-top:12px">
    <strong>Pencapaian: ${pct}%</strong>
    <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>
  </div>

  <div class="section-title">Riwayat Target (6 Bulan Terakhir)</div>
  <table>
    <thead><tr><th>Bulan</th><th style="text-align:right">Target</th><th style="text-align:right">Tercapai</th></tr></thead>
    <tbody>${historyRows}</tbody>
  </table>

  <div class="section-title">Produk Terjual</div>
  <table>
    <thead><tr><th>Produk</th><th>Kategori</th><th style="text-align:center">Qty</th><th style="text-align:right">Revenue</th></tr></thead>
    <tbody>${productRows}</tbody>
  </table>
</body>
</html>`
}

export function exportSalesHtml(person: SalesPerson) {
  const html = buildSalesDetailHtml(person)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `detail-${person.name.toLowerCase().replace(/\s+/g, '-')}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportSalesPdf(person: SalesPerson) {
  const html = buildSalesDetailHtml(person)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
  }
}
