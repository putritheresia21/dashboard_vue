import type { Category, CategoryPayload } from '@/types/category'

import { api } from './axios'

export const getCategories = () => api.get<Category[]>('/categories').then((res) => res.data)

export const createCategory = (payload: CategoryPayload) =>
  api.post<Category>('/categories', payload)

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`)
