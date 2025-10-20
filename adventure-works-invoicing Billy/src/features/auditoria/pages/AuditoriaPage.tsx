"use client"

import { useState } from "react"
import { Filter, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/common/DataTable"
import { PageHeader } from "@/components/common/PageHeader"
import { useAuditoria } from "../hooks/use-auditoria"
import { useUsuarios } from "@/features/usuarios/hooks/use-usuarios"
import type { Auditoria } from "@/lib/validations"

export function AuditoriaPage() {
  const [usuarioFilter, setUsuarioFilter] = useState<string>("all")
  const [accionFilter, setAccionFilter] = useState<string>("all")
  const [entidadFilter, setEntidadFilter] = useState<string>("all")
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")

  const filters = {
    usuarioId: usuarioFilter === "all" ? undefined : usuarioFilter,
    accion: accionFilter === "all" ? undefined : accionFilter,
    entidad: entidadFilter === "all" ? undefined : entidadFilter,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  }

  const { data: auditorias = [], isLoading } = useAuditoria(filters)
  const { data: usuarios = [] } = useUsuarios()

  const accionLabels = {
    LOGIN: "Inicio de Sesión",
    LOGOUT: "Cierre de Sesión",
    LOGIN_FAILED: "Login Fallido",
    CREATE: "Crear",
    UPDATE: "Actualizar",
    DELETE: "Eliminar",
    VIEW: "Ver",
  }

  const accionColors = {
    LOGIN: "default",
    LOGOUT: "secondary",
    LOGIN_FAILED: "destructive",
    CREATE: "default",
    UPDATE: "secondary",
    DELETE: "destructive",
    VIEW: "outline",
  } as const

  const columns = [
    {
      accessorKey: "fechaCreacion",
      header: "Fecha y Hora",
      cell: ({ row }: { row: { original: Auditoria } }) => {
        const fecha = new Date(row.original.fechaCreacion)
        return (
          <div className="text-sm">
            <div>{fecha.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{fecha.toLocaleTimeString()}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "usuarioId",
      header: "Usuario",
      cell: ({ row }: { row: { original: Auditoria } }) => {
        const usuario = usuarios.find((u) => u.id === row.original.usuarioId)
        return usuario?.nombre || "Usuario no encontrado"
      },
    },
    {
      accessorKey: "accion",
      header: "Acción",
      cell: ({ row }: { row: { original: Auditoria } }) => (
        <Badge variant={accionColors[row.original.accion as keyof typeof accionColors]}>
          {accionLabels[row.original.accion as keyof typeof accionLabels] || row.original.accion}
        </Badge>
      ),
    },
    {
      accessorKey: "entidad",
      header: "Entidad",
    },
    {
      accessorKey: "detalles",
      header: "Detalles",
      cell: ({ row }: { row: { original: Auditoria } }) => (
        <div className="max-w-xs truncate" title={row.original.detalles}>
          {row.original.detalles}
        </div>
      ),
    },
    {
      accessorKey: "ip",
      header: "IP",
      cell: ({ row }: { row: { original: Auditoria } }) => (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">{row.original.ip}</code>
      ),
    },
  ]

  const handleExport = () => {
    // Implementar exportación a Excel/CSV
    console.log("Exportar auditoría", auditorias)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoría del Sistema"
        description="Registro de todas las actividades realizadas en el sistema"
      >
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Select value={usuarioFilter} onValueChange={setUsuarioFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los usuarios</SelectItem>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={accionFilter} onValueChange={setAccionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Acción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las acciones</SelectItem>
            {Object.entries(accionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={entidadFilter} onValueChange={setEntidadFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Entidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las entidades</SelectItem>
            <SelectItem value="Usuario">Usuario</SelectItem>
            <SelectItem value="Cliente">Cliente</SelectItem>
            <SelectItem value="Producto">Producto</SelectItem>
            <SelectItem value="Venta">Venta</SelectItem>
            <SelectItem value="DTE">DTE</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="date"
            placeholder="Fecha inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="date"
            placeholder="Fecha fin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={auditorias}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No se encontraron registros de auditoría"
      />
    </div>
  )
}
