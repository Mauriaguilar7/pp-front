"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useClientes, useDeleteCliente } from "../hooks/use-clientes"
import { ClienteForm } from "../components/ClienteForm"
import type { Cliente } from "@/lib/validations"
import { formatDate } from "@/lib/utils"
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
import { Plus, MoreHorizontal, Edit, Trash2, Users } from "lucide-react"

export function ClientesPage() {
  const [search, setSearch] = useState("")
  const [perfilFiscalFilter, setPerfilFiscalFilter] = useState<string>("all")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null)

  const { data: clientesData, isLoading } = useClientes({
    search: search || undefined,
    perfilFiscal: perfilFiscalFilter === "all" ? undefined : perfilFiscalFilter,
    estado: estadoFilter === "all" ? undefined : estadoFilter,
  })

  const deleteClienteMutation = useDeleteCliente()

  const clientes = clientesData?.clientes || []

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
  }

  const handleDelete = (cliente: Cliente) => {
    setDeletingCliente(cliente)
  }

  const confirmDelete = async () => {
    if (!deletingCliente) return

    try {
      await deleteClienteMutation.mutateAsync(deletingCliente.id)
    } catch (error) {
      // Error handled by mutation
    }

    setDeletingCliente(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCliente(null)
  }

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: "nombre",
      header: "Cliente",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("nombre")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.nit && `NIT: ${row.original.nit}`}
            {row.original.nit && row.original.email && " • "}
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "perfilFiscal",
      header: "Perfil Fiscal",
      cell: ({ row }) => {
        const perfil = row.getValue("perfilFiscal") as string
        const labels = {
          RESPONSABLE_IVA: "Responsable IVA",
          EXENTO: "Exento",
          PERCEPCION: "Percepción",
        }
        return <Badge variant="outline">{labels[perfil as keyof typeof labels] || perfil}</Badge>
      },
    },
    {
      accessorKey: "telefono",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.telefono && <div>{row.original.telefono}</div>}
          <div className="text-muted-foreground truncate max-w-32">{row.original.direccion}</div>
        </div>
      ),
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
        const cliente = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(cliente)} className="text-destructive">
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
        title="Gestión de Clientes"
        description="Administra la información de todos los clientes registrados"
        action={{
          label: "Nuevo Cliente",
          onClick: () => setShowForm(true),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Buscar por nombre, NIT o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={perfilFiscalFilter} onValueChange={setPerfilFiscalFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por perfil fiscal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los perfiles</SelectItem>
            <SelectItem value="RESPONSABLE_IVA">Responsable IVA</SelectItem>
            <SelectItem value="EXENTO">Exento</SelectItem>
            <SelectItem value="PERCEPCION">Percepción</SelectItem>
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
        {(search || perfilFiscalFilter !== "all" || estadoFilter !== "all") && (
          <Badge variant="secondary">
            {clientes.length} resultado{clientes.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={clientes}
        searchKey="nombre"
        isLoading={isLoading}
        emptyMessage={
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No hay clientes</h3>
            <p className="text-muted-foreground">Comienza agregando tu primer cliente</p>
          </div>
        }
      />

      {/* Client Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <ClienteForm
            cliente={editingCliente || undefined}
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
        open={!!deletingCliente}
        onOpenChange={() => setDeletingCliente(null)}
        title="Eliminar Cliente"
        description={`¿Está seguro de eliminar el cliente "${deletingCliente?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
