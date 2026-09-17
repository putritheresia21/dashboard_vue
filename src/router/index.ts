import { createRouter, createWebHistory } from 'vue-router'
// import DashboardView from '../views/DashboardView.vue'
// import AppLayout from '../components/layouts/AppLayout.vue'
// import EmployeeView from '../views/EmployeeView.vue'
// import ProductView from '../views/ProductView.vue'
// import ReportView from '@/views/ReportView.vue'
// import LoginView from '@/views/LoginView.vue'
// import CategoryView from '@/views/CategoryView.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { routes } from 'vue-router/auto-routes'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string | false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // routes: [
  //   // {
  //   //   path: '/',
  //   //   name: 'home',
  //   //   component: DashboardView,
  //   // },
  //   {
  //     path: '/',
  //     name: 'dashboard',
  //     component: AppLayout,
  //     meta: { requiresAuth: true },
  //     children: [
  //       {
  //         path: '',
  //         name: 'dashboard-home',
  //         component: DashboardView,
  //         meta: {
  //           title: 'Dashboard',
  //         },
  //       },
  //       {
  //         path: 'employee',
  //         name: 'employee',
  //         component: EmployeeView,
  //         meta: {
  //           title: 'Employee',
  //         },
  //       },
  //       {
  //         path: 'product',
  //         name: 'product',
  //         component: ProductView,
  //         meta: {
  //           title: 'Product',
  //         },
  //       },
  //       {
  //         path: 'categories',
  //         name: 'category',
  //         component: CategoryView,
  //         meta: {
  //           title: 'Category Product',
  //         },
  //       },
  //       {
  //         path: 'reports',
  //         name: 'reports',
  //         component: ReportView,
  //         meta: {
  //           title: 'Report',
  //         },
  //       },
  //     ],
  //   },

  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: LoginView,
  //     meta: {
  //       title: 'Login',
  //     },
  //   },
  // ],
})

// implementasi middleware sementara
router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.checkSession()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }
  if (to.path === '/login' && authStore.isAuthenticated) {
    return { path: '/' }
  }
})

export default router
