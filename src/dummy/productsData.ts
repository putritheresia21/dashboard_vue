export type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK'

export interface ProductHistory {
  month: string
  stockIn: number
  stockOut: number
}

export interface Product {
  id: number
  code: string
  name: string
  category: string
  categoryId: number
  quantity: number
  price: number
  image: string
  inventoryStatus: InventoryStatus
  rating: number
  description: string
  stockHistory: ProductHistory[]
}

const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Fitness' },
  { id: 4, name: 'Accessories' },
]

function statusFromQty(qty: number): InventoryStatus {
  if (qty === 0) return 'OUTOFSTOCK'
  if (qty <= 10) return 'LOWSTOCK'
  return 'INSTOCK'
}

const rawProducts = [
  { name: 'Bamboo Watch', category: 1, quantity: 24, price: 65 },
  { name: 'Black Watch', category: 1, quantity: 8, price: 72 },
  { name: 'Blue Band', category: 4, quantity: 0, price: 15 },
  { name: 'Blue T-Shirt', category: 2, quantity: 45, price: 12 },
  { name: 'Bracelet', category: 4, quantity: 15, price: 38 },
  { name: 'Brown Purse', category: 4, quantity: 5, price: 55 },
  { name: 'Chakra Bracelet', category: 4, quantity: 32, price: 27 },
  { name: 'Classic Sneakers', category: 2, quantity: 12, price: 89 },
  { name: 'Yoga Mat', category: 3, quantity: 0, price: 45 },
  { name: 'Dumbbell Set 5kg', category: 3, quantity: 18, price: 60 },
  { name: 'Resistance Band', category: 3, quantity: 60, price: 9 },
  { name: 'Wireless Earbuds', category: 1, quantity: 3, price: 120 },
]

export const productsData: Product[] = rawProducts.map((p, i) => {
  const cat = categories.find((c) => c.id === p.category)!
  return {
    id: i + 1,
    code: `PRD-${String(i + 1).padStart(4, '0')}`,
    name: p.name,
    category: cat.name,
    categoryId: cat.id,
    quantity: p.quantity,
    price: p.price,
    image: `https://placehold.co/100x100/0d9488/white?text=${p.name.charAt(0)}`,
    inventoryStatus: statusFromQty(p.quantity),
    rating: Number((3 + Math.random() * 2).toFixed(1)),
    description: `${p.name} - produk kategori ${cat.name}.`,
    stockHistory: ['Jan', 'Feb', 'Mar', 'Apr'].map((month) => ({
      month,
      stockIn: Math.floor(Math.random() * 30) + 5,
      stockOut: Math.floor(Math.random() * 25),
    })),
  }
})

export const categoryOptionsDummy = categories
