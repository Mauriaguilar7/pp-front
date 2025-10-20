"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useCartStore } from "../store/cart-store"
import { useCreateVenta } from "../hooks/use-ventas"
import type { Cliente, Producto } from "@/lib/validations"
import { PageHeader } from "@/components/common/PageHeader"
import { ClienteSelector } from "../components/ClienteSelector"
import { ProductoSelector } from "../components/ProductoSelector"
import { CarritoVenta } from "../components/CarritoVenta"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { toast } from "@/hooks/use-toast"

export function NuevaVentaPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cliente, items, subtotal, totalIva, total, setCliente, addItem, clearCart } = useCartStore()
  const createVentaMutation = useCreateVenta()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSelectCliente = (selectedCliente: Cliente) => {
    setCliente(selectedCliente)
  }

  const handleAddProduct = (producto: Producto, cantidad: number) => {
    addItem(producto, cantidad)
    toast({
      title: "Producto agregado",
      description: `${producto.nombre} x${cantidad} agregado al carrito`,
    })
  }

  const handleConfirmSale = () => {
    if (!cliente) {
      toast({
        title: "Cliente requerido",
        description: "Debe seleccionar un cliente para continuar",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Debe agregar al menos un producto",
        variant: "destructive",
      })
      return
    }

    setShowConfirmDialog(true)
  }

  const handleCreateVenta = async () => {
    if (!cliente || !user) return

    try {
      await createVentaMutation.mutateAsync({
        fecha: new Date(),
        clienteId: cliente.id,
        vendedorId: user.id,
        items,
        subtotal,
        totalIva,
        total,
        estado: "PENDIENTE",
      })

      clearCart()
      navigate("/ventas")
    } catch (error) {
      // Error is handled by the mutation
    }

    setShowConfirmDialog(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Nueva Venta" description="Registra una nueva venta seleccionando cliente y productos" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Client and Product Selection */}
        <div className="space-y-6">
          <ClienteSelector
            selectedCliente={cliente}
            onSelectCliente={handleSelectCliente}
            onCreateCliente={() => {
              // TODO: Open client creation modal
              toast({
                title: "Funcionalidad pendiente",
                description: "La creación de clientes estará disponible próximamente",
              })
            }}
          />

          <ProductoSelector onAddProduct={handleAddProduct} />
        </div>

        {/* Right Column - Shopping Cart */}
        <div>
          <CarritoVenta onConfirmSale={handleConfirmSale} isLoading={createVentaMutation.isPending} />
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar Venta"
        description={`¿Está seguro de registrar esta venta por ${total.toLocaleString("es-SV", {
          style: "currency",
          currency: "USD",
        })}?`}
        confirmText="Confirmar"
        onConfirm={handleCreateVenta}
      />
    </div>
  )
}
