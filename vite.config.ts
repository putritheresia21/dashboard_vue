import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'vue-router/vite'

const routePathFrom = (source: string, filePath: string) => {
  const sourceIndex = filePath.lastIndexOf(source)
  const routePath = sourceIndex >= 0 ? filePath.slice(sourceIndex + source.length) : filePath
  return routePath.replace(/^\/+/, '')
}

const appRoutePath = (filePath: string) => {
  const routePath = routePathFrom('src/views/app', filePath)

  return `app/${routePath}`
}

const authRoutePath = (filePath: string) => routePathFrom('src/views/auth', filePath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: [
        { src: 'src/views/app', path: appRoutePath },
        { src: 'src/views/auth', path: authRoutePath },
      ],
      dts: false,
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
