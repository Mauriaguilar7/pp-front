"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useVentasPendientes, useGenerateDTE } from "../hooks/use-facturacion"
import type { Venta } from "@/lib/validations"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { DataTable } from "@/components/common/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { FileText, Loader2 } from "lucide-react"

type VentaWithDetails = Venta & {
  cliente?: { nombre: string }
  vendedor?: { nombre: string }
}

export function VentasPendientesTable() {
  const { data: ventasData, isLoading } = useVentasPendientes()
  const generateDTEMutation = useGenerateDTE()
  const [selectedVentaId, setSelectedVentaId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const ventas = ventasData?.ventas || []

  const handleGenerateDTE = (ventaId: string) => {
    setSelectedVentaId(ventaId)
    setShowConfirmDialog(true)
  }

  const confirmGenerateDTE = async () => {
    if (!selectedVentaId) return

    try {
      await generateDTEMutation.mutateAsync(selectedVentaId)
    } catch (error) {
      // Error handled by mutation
    }

    setShowConfirmDialog(false)
    setSelectedVentaId(null)
  }

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
      cell: () => <Badge variant="secondary">Pendiente</Badge>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const venta = row.original
        const isGenerating = generateDTEMutation.isPending && selectedVentaId === venta.id

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateDTE(venta.id)}
            disabled={isGenerating || generateDTEMutation.isPending}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generar DTE
              </>
            )}
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={ventas}
        searchKey="numero"
        isLoading={isLoading}
        emptyMessage="No hay ventas pendientes de facturación"
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Generar DTE"
        description="¿Está seguro de generar el Documento Tributario Electrónico para esta venta? Este proceso puede tomar unos momentos."
        confirmText="Generar"
        onConfirm={confirmGenerateDTE}
      />
    </>
  )
}
