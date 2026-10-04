import type { Category } from './category'

export type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK'

export interface Product {
  id: number
  code: string
  name: string
  category: string
  quantity: number
  price: number
  image: string
  inventoryStatus: InventoryStatus
}

//response dari api
export interface ApiProduct {
  id: number
  code: string
  name: string
  categoryId: number
  category: Category
  quantity: number
  price: number
  image: string
  inventoryStatus: InventoryStatus
}

export interface CreateProductPayload {
  code: string
  name: string
  categoryId: number
  quantity: number
  price: number
  image: string
}
