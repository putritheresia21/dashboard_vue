import { createSSRApp } from 'vue'
import type { Component } from 'vue'
import { renderToString } from '@vue/server-renderer'

export function useHtmlRenderer() {
  async function renderTemplate(component: Component, props = {}) {
    const app = createSSRApp(component, props)

    const bodyHTML = await renderToString(app)

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

    <style>
      /* Mengatur agar background color Tailwind tetap tercetak */
      @media print {
        /* Mengatur ukuran dan margin kertas */
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 25mm 20mm;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }

      /* Aturan Print untuk tabel */
      table {
        break-inside: auto;
      }

      tr {
        break-inside: avoid;
        break-after: auto;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }

      .page-break {
        break-before: page;
      }
    </style>
</head>
<body>${bodyHTML}</body>
</html>`
  }

  async function sendToPDF(component: Component, props = {}) {
    const html = await renderTemplate(component, props)

    const blob = new Blob([html], { type: 'text/html' })
    const formData = new FormData()
    formData.append('files', blob, 'index.html')

    const response = await fetch('/gotenberg/forms/chromium/convert/html', {
      method: 'POST',
      body: formData,
    })

    return response.blob() // PDF blob
  }

  return { renderTemplate, sendToPDF }
}
