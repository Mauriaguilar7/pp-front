import { create } from "zustand"
import type { VentaItem, Cliente, Producto } from "@/lib/validations"

interface CartState {
  cliente: Cliente | null
  items: VentaItem[]
  subtotal: number
  totalIva: number
  total: number
  setCliente: (cliente: Cliente | null) => void
  addItem: (producto: Producto, cantidad: number) => void
  updateItem: (productoId: string, cantidad: number) => void
  removeItem: (productoId: string) => void
  clearCart: () => void
  calculateTotals: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  cliente: null,
  items: [],
  subtotal: 0,
  totalIva: 0,
  total: 0,

  setCliente: (cliente) => set({ cliente }),

  addItem: (producto, cantidad) => {
    const { items } = get()
    const existingItem = items.find((item) => item.productoId === producto.id)

    if (existingItem) {
      get().updateItem(producto.id, existingItem.cantidad + cantidad)
    } else {
      const subtotal = producto.precio * cantidad
      const newItem: VentaItem = {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad,
        precio: producto.precio,
        iva: producto.iva,
        subtotal,
      }

      set({ items: [...items, newItem] })
      get().calculateTotals()
    }
  },

  updateItem: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(productoId)
      return
    }

    const { items } = get()
    const updatedItems = items.map((item) =>
      item.productoId === productoId ? { ...item, cantidad, subtotal: item.precio * cantidad } : item,
    )

    set({ items: updatedItems })
    get().calculateTotals()
  },

  removeItem: (productoId) => {
    const { items } = get()
    const updatedItems = items.filter((item) => item.productoId !== productoId)
    set({ items: updatedItems })
    get().calculateTotals()
  },

  clearCart: () => {
    set({
      cliente: null,
      items: [],
      subtotal: 0,
      totalIva: 0,
      total: 0,
    })
  },

  calculateTotals: () => {
    const { items } = get()
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const totalIva = items.reduce((sum, item) => sum + item.subtotal * item.iva, 0)
    const total = subtotal + totalIva

    set({ subtotal, totalIva, total })
  },
}))
