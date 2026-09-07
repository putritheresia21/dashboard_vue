import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AppLayout from '../components/layouts/AppLayout.vue'
import EmployeeView from '../views/EmployeeView.vue'
import ProductView from '../views/ProductView.vue'
import ReportView from '@/views/ReportView.vue'
import LoginView from '@/views/LoginView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: DashboardView,
    // },
    {
      path: '/',
      name: 'dashboard',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: DashboardView,
          meta: {
            title: 'Dashboard',
          },
        },
        {
          path: 'employee',
          name: 'employee',
          component: EmployeeView,
          meta: {
            title: 'Employee',
          },
        },
        {
          path: 'product',
          name: 'product',
          component: ProductView,
          meta: {
            title: 'Product',
          },
        },
        {
          path: 'categories',
          name: 'category',
          component: CategoryView,
          meta: {
            title: 'Category Product',
          },
        },
        {
          path: 'login',
          name: 'login',
          component: LoginView,
          meta: {
            title: 'Login',
          },
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportView,
          meta: {
            title: 'Report',
          },
        },
      ],
    },
  ],
})

export default router
