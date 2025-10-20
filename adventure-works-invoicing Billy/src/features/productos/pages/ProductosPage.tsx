"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useProductos, useDeleteProducto } from "../hooks/use-productos"
import { ProductoForm } from "../components/ProductoForm"
import type { Producto } from "@/lib/validations"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Package } from "lucide-react"

export function ProductosPage() {
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [deletingProducto, setDeletingProducto] = useState<Producto | null>(null)

  const { data: productosData, isLoading } = useProductos({
    search: search || undefined,
    categoria: categoriaFilter === "all" ? undefined : categoriaFilter,
    estado: estadoFilter === "all" ? undefined : estadoFilter,
  })

  const deleteProductoMutation = useDeleteProducto()

  const productos = productosData?.productos || []
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort()

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto)
    setShowForm(true)
  }

  const handleDelete = (producto: Producto) => {
    setDeletingProducto(producto)
  }

  const confirmDelete = async () => {
    if (!deletingProducto) return

    try {
      await deleteProductoMutation.mutateAsync(deletingProducto.id)
    } catch (error) {
      // Error handled by mutation
    }

    setDeletingProducto(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProducto(null)
  }

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "nombre",
      header: "Producto",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("nombre")}</div>
          <div className="text-sm text-muted-foreground">SKU: {row.original.sku}</div>
        </div>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("categoria")}</Badge>,
    },
    {
      accessorKey: "precio",
      header: "Precio",
      cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("precio"))}</div>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number
        return (
          <Badge variant={stock > 10 ? "default" : stock > 0 ? "secondary" : "destructive"}>
            {stock} {row.original.unidad}
          </Badge>
        )
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => <StatusBadge status={row.getValue("estado")} />,
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha Creación",
      cell: ({ row }) => formatDate(row.getValue("fechaCreacion")),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const producto = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(producto)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(producto)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Productos"
        description="Administra el catálogo de productos disponibles para la venta"
        action={{
          label: "Nuevo Producto",
          onClick: () => setShowForm(true),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="ACTIVO">Activo</SelectItem>
            <SelectItem value="INACTIVO">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        {(search || categoriaFilter !== "all" || estadoFilter !== "all") && (
          <Badge variant="secondary">
            {productos.length} resultado{productos.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={productos}
        searchKey="nombre"
        isLoading={isLoading}
        emptyMessage={
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No hay productos</h3>
            <p className="text-muted-foreground">Comienza agregando tu primer producto al catálogo</p>
          </div>
        }
      />

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProducto ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          <ProductoForm
            producto={editingProducto || undefined}
            onSubmit={async (data) => {
              // This will be handled by the form component
              handleCloseForm()
            }}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingProducto}
        onOpenChange={() => setDeletingProducto(null)}
        title="Eliminar Producto"
        description={`¿Está seguro de eliminar el producto "${deletingProducto?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
