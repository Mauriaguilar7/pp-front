"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"
import { useVentas } from "../hooks/use-ventas"
import type { Venta } from "@/lib/validations"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { PageHeader } from "@/components/common/PageHeader"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, FileText } from "lucide-react"

type VentaWithDetails = Venta & {
  cliente?: { nombre: string }
  vendedor?: { nombre: string }
}

export function VentasPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("all")

  const { data: ventasData, isLoading } = useVentas({
    search: search || undefined,
    estado: estadoFilter === "all" ? undefined : estadoFilter,
  })

  const ventas = ventasData?.ventas || []

  const columns: ColumnDef<VentaWithDetails>[] = [
    {
      accessorKey: "numero",
      header: "Número",
      cell: ({ row }) => <div className="font-medium">{row.getValue("numero")}</div>,
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => formatDateTime(row.getValue("fecha")),
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: ({ row }) => {
        const cliente = row.getValue("cliente") as { nombre: string }
        return cliente?.nombre || "N/A"
      },
    },
    {
      accessorKey: "vendedor",
      header: "Vendedor",
      cell: ({ row }) => {
        const vendedor = row.getValue("vendedor") as { nombre: string }
        return vendedor?.nombre || "N/A"
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("total"))}</div>,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => <StatusBadge status={row.getValue("estado")} />,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const venta = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/ventas/${venta.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            {venta.estado === "PENDIENTE" && (
              <Button variant="ghost" size="sm" onClick={() => navigate(`/facturacion?ventaId=${venta.id}`)}>
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Ventas"
        description="Administra todas las ventas registradas en el sistema"
        action={{
          label: "Nueva Venta",
          onClick: () => navigate("/ventas/nueva"),
          icon: <Plus className="mr-2 h-4 w-4" />,
        }}
      />

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Buscar por número o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            <SelectItem value="FACTURADA">Facturada</SelectItem>
            <SelectItem value="ANULADA">Anulada</SelectItem>
          </SelectContent>
        </Select>
        {(search || estadoFilter !== "all") && (
          <Badge variant="secondary">
            {ventas.length} resultado{ventas.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={ventas}
        searchKey="numero"
        isLoading={isLoading}
        emptyMessage="No se encontraron ventas"
      />
    </div>
  )
}
