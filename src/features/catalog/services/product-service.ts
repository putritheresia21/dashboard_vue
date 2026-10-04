import type { ApiProduct, CreateProductPayload, Product } from '@/features/catalog/types/product'
import { api } from '@/shared/services/axios'

function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    category: p.category?.name ?? '-',
    quantity: p.quantity,
    price: p.price,
    image: p.image,
    inventoryStatus: p.inventoryStatus,
  }
}

export const getProducts = () =>
  api.get<ApiProduct[]>('/products').then((res) => res.data.map(mapApiProduct))

export const createProduct = (payload: CreateProductPayload) =>
  api.post<ApiProduct>('/products', payload).then((res) => mapApiProduct(res.data))

export const updateProduct = (id: number, payload: CreateProductPayload) =>
  api.put<ApiProduct>(`/products/${id}`, payload).then((res) => mapApiProduct(res.data))

export const deleteProduct = (id: number) => api.delete(`/products/${id}`)
