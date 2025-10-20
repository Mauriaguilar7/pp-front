"use client"

import { useState } from "react"
import { useProductos } from "../hooks/use-productos"
import type { Producto } from "@/lib/validations"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package } from "lucide-react"

interface ProductoSelectorProps {
  onAddProduct: (producto: Producto, cantidad: number) => void
}

export function ProductoSelector({ onAddProduct }: ProductoSelectorProps) {
  const [search, setSearch] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const { data: productosData, isLoading } = useProductos(search)

  const productos = productosData?.productos || []

  const handleAddProduct = (producto: Producto) => {
    const cantidad = quantities[producto.id] || 1
    onAddProduct(producto, cantidad)
    setQuantities({ ...quantities, [producto.id]: 1 })
  }

  const updateQuantity = (productoId: string, cantidad: number) => {
    setQuantities({ ...quantities, [productoId]: Math.max(1, cantidad) })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Agregar Productos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Buscando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {search ? "No se encontraron productos" : "No hay productos disponibles"}
              </p>
            </div>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} className="p-3 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{producto.nombre}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">SKU: {producto.sku}</p>
                    <p className="text-sm text-muted-foreground">Categoría: {producto.categoria}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-semibold text-primary">{formatCurrency(producto.precio)}</span>
                      <Badge variant="outline" className="text-xs">
                        Stock: {producto.stock}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(producto.id, (quantities[producto.id] || 1) - 1)}
                      disabled={(quantities[producto.id] || 1) <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={quantities[producto.id] || 1}
                      onChange={(e) => updateQuantity(producto.id, Number.parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(producto.id, (quantities[producto.id] || 1) + 1)}
                      disabled={(quantities[producto.id] || 1) >= (producto.stock || 0)}
                    >
                      +
                    </Button>
                  </div>
                  <Button onClick={() => handleAddProduct(producto)} size="sm" className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
