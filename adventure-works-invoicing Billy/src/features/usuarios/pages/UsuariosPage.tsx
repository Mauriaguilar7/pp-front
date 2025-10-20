"use client"

import { useState } from "react"
import { Plus, Search, Filter, Key, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/DataTable"
import { PageHeader } from "@/components/common/PageHeader"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { UsuarioForm } from "../components/UsuarioForm"
import { CambiarPasswordForm } from "../components/CambiarPasswordForm"
import {
  useUsuarios,
  useCreateUsuario,
  useUpdateUsuario,
  useDeleteUsuario,
  useCambiarPassword,
} from "../hooks/use-usuarios"
import type { Usuario } from "@/lib/validations"

export function UsuariosPage() {
  const [search, setSearch] = useState("")
  const [rolFilter, setRolFilter] = useState<string>("all")
  const [activoFilter, setActivoFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>()
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | undefined>()

  const filters = {
    search: search || undefined,
    rol: rolFilter !== "all" ? rolFilter : undefined,
    activo: activoFilter !== "all" ? activoFilter === "true" : undefined,
  }

  const { data: usuarios = [], isLoading } = useUsuarios(filters)
  const createUsuario = useCreateUsuario()
  const updateUsuario = useUpdateUsuario()
  const deleteUsuario = useDeleteUsuario()
  const cambiarPassword = useCambiarPassword()

  const handleCreateUsuario = (data: any) => {
    createUsuario.mutate(data, {
      onSuccess: () => setShowForm(false),
    })
  }

  const handleUpdateUsuario = (data: any) => {
    if (!selectedUsuario) return
    updateUsuario.mutate(
      { id: selectedUsuario.id, data },
      {
        onSuccess: () => {
          setShowForm(false)
          setSelectedUsuario(undefined)
        },
      },
    )
  }

  const handleDeleteUsuario = () => {
    if (!usuarioToDelete) return
    deleteUsuario.mutate(usuarioToDelete.id, {
      onSuccess: () => setUsuarioToDelete(undefined),
    })
  }

  const handleCambiarPassword = (data: { passwordActual: string; passwordNuevo: string }) => {
    if (!selectedUsuario) return
    cambiarPassword.mutate(
      { id: selectedUsuario.id, data },
      {
        onSuccess: () => {
          setShowPasswordForm(false)
          setSelectedUsuario(undefined)
        },
      },
    )
  }

  const columns = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "rol",
      header: "Rol",
      cell: ({ row }: { row: { original: Usuario } }) => {
        const rolLabels = {
          ADMIN: "Administrador",
          CASHIER: "Cajero/Vendedor",
          SUPERVISOR: "Supervisor",
        }
        return <Badge variant="secondary">{rolLabels[row.original.rol]}</Badge>
      },
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }: { row: { original: Usuario } }) => (
        <Badge variant={row.original.activo ? "default" : "destructive"}>
          {row.original.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha Creación",
      cell: ({ row }: { row: { original: Usuario } }) => new Date(row.original.fechaCreacion).toLocaleDateString(),
    },
  ]

  const actions = [
    {
      label: "Editar",
      icon: Edit,
      onClick: (usuario: Usuario) => {
        setSelectedUsuario(usuario)
        setShowForm(true)
      },
    },
    {
      label: "Cambiar Contraseña",
      icon: Key,
      onClick: (usuario: Usuario) => {
        setSelectedUsuario(usuario)
        setShowPasswordForm(true)
      },
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: (usuario: Usuario) => setUsuarioToDelete(usuario),
      variant: "destructive" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Gestión de Usuarios" description="Administre los usuarios del sistema y sus permisos">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={rolFilter} onValueChange={setRolFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="CASHIER">Cajero/Vendedor</SelectItem>
            <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activoFilter} onValueChange={setActivoFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={usuarios}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
      />

      <UsuarioForm
        open={showForm}
        onOpenChange={setShowForm}
        usuario={selectedUsuario}
        onSubmit={selectedUsuario ? handleUpdateUsuario : handleCreateUsuario}
        isLoading={createUsuario.isPending || updateUsuario.isPending}
      />

      <CambiarPasswordForm
        open={showPasswordForm}
        onOpenChange={setShowPasswordForm}
        onSubmit={handleCambiarPassword}
        isLoading={cambiarPassword.isPending}
      />

      <ConfirmDialog
        open={!!usuarioToDelete}
        onOpenChange={() => setUsuarioToDelete(undefined)}
        title="Eliminar Usuario"
        description={`¿Está seguro de que desea eliminar al usuario "${usuarioToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteUsuario}
        isLoading={deleteUsuario.isPending}
      />
    </div>
  )
}
