"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useDTEs, useDownloadDTE } from "../hooks/use-facturacion"
import type { DTE } from "@/lib/validations"
import { formatDateTime } from "@/lib/utils"
import { DataTable } from "@/components/common/DataTable"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, File } from "lucide-react"

type DTEWithDetails = DTE & {
  venta?: { numero: string; total: number }
  cliente?: { nombre: string }
}

export function DTEsTable() {
  const [estadoFilter, setEstadoFilter] = useState<string>("all")
  const { data: dtesData, isLoading } = useDTEs(estadoFilter === "all" ? undefined : estadoFilter)
  const { downloadXML, downloadPDF } = useDownloadDTE()

  const dtes = dtesData?.dtes || []

  const columns: ColumnDef<DTEWithDetails>[] = [
    {
      accessorKey: "id",
      header: "DTE ID",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "venta",
      header: "Venta",
      cell: ({ row }) => {
        const venta = row.getValue("venta") as { numero: string }
        return venta?.numero || "N/A"
      },
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
      accessorKey: "fechaCreacion",
      header: "Fecha Creación",
      cell: ({ row }) => formatDateTime(row.getValue("fechaCreacion")),
    },
    {
      accessorKey: "fechaRespuesta",
      header: "Fecha Respuesta",
      cell: ({ row }) => {
        const fecha = row.getValue("fechaRespuesta")
        return fecha ? formatDateTime(fecha) : "Pendiente"
      },
    },
    {
      accessorKey: "estadoDGII",
      header: "Estado DGII",
      cell: ({ row }) => <StatusBadge status={row.getValue("estadoDGII")} />,
    },
    {
      accessorKey: "mensajes",
      header: "Mensajes",
      cell: ({ row }) => {
        const mensajes = row.getValue("mensajes") as string[]
        if (!mensajes || mensajes.length === 0) return "N/A"

        return (
          <div className="max-w-xs">
            <p className="text-sm truncate">{mensajes[0]}</p>
            {mensajes.length > 1 && (
              <Badge variant="outline" className="text-xs">
                +{mensajes.length - 1} más
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const dte = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadXML(dte.id)}>
                <File className="mr-2 h-4 w-4" />
                Descargar XML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadPDF(dte.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Descargar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="ACEPTADO">Aceptado</SelectItem>
            <SelectItem value="RECHAZADO">Rechazado</SelectItem>
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
          </SelectContent>
        </Select>
        {estadoFilter !== "all" && (
          <Badge variant="secondary">
            {dtes.length} resultado{dtes.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={dtes}
        searchKey="id"
        isLoading={isLoading}
        emptyMessage="No se encontraron DTEs"
        onExport={() => {
          // TODO: Implement export functionality
          console.log("Export DTEs")
        }}
        exportLabel="Exportar DTEs"
      />
    </div>
  )
}
