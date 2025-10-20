"use client"

import { useCartStore } from "../store/cart-store"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, ShoppingCart } from "lucide-react"

interface CarritoVentaProps {
  onConfirmSale: () => void
  isLoading?: boolean
}

export function CarritoVenta({ onConfirmSale, isLoading }: CarritoVentaProps) {
  const { items, subtotal, totalIva, total, updateItem, removeItem } = useCartStore()

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Carrito vacío</h3>
          <p className="text-sm text-muted-foreground text-center">Agrega productos para comenzar una nueva venta</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Carrito de Venta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="w-24">Cant.</TableHead>
                <TableHead className="w-24">Precio</TableHead>
                <TableHead className="w-24">Subtotal</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productoId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-sm text-muted-foreground">IVA: {(item.iva * 100).toFixed(0)}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => updateItem(item.productoId, Number.parseInt(e.target.value) || 1)}
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(item.precio)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.subtotal)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productoId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA:</span>
            <span>{formatCurrency(totalIva)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Button onClick={onConfirmSale} className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Confirmar Venta"}
        </Button>
      </CardContent>
    </Card>
  )
}
