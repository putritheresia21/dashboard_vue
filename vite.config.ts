import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/views',
      // routesFolder: [
      //   {
      //     src: 'src/features',
      //     filePatterns: '*/pages/**/*.vue',
      //     path: (file) => file.replace(/\/views\//, '/'),
      //   },
      // ],
      dts: 'src/route-map.d.ts',
    }),
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/gotenberg': {
        target: 'https://demo.gotenberg.dev',
        rewrite: (path) => path.replace(/^\/gotenberg/, ''),
        changeOrigin: true,
      },
    },
  },
})
