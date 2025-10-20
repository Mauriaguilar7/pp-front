"use client"

import { useDTE } from "../hooks/use-facturacion"
import { formatDateTime } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDownloadDTE } from "../hooks/use-facturacion"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import { AlertCircle, CheckCircle, Clock, FileText, File } from "lucide-react"

interface DTEStatusCardProps {
  ventaId: string
}

export function DTEStatusCard({ ventaId }: DTEStatusCardProps) {
  const { data: dteData, isLoading, error } = useDTE(ventaId)
  const { downloadXML, downloadPDF } = useDownloadDTE()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado del DTE</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton rows={3} columns={1} />
        </CardContent>
      </Card>
    )
  }

  if (error || !dteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado del DTE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>No se ha generado DTE para esta venta</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { dte } = dteData

  const getStatusIcon = () => {
    switch (dte.estadoDGII) {
      case "ACEPTADO":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "RECHAZADO":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "PENDIENTE":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>Estado del DTE</span>
        </CardTitle>
        <CardDescription>Documento Tributario Electrónico</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">ID DTE</p>
            <p className="text-sm text-muted-foreground font-mono">{dte.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Estado DGII</p>
            <StatusBadge status={dte.estadoDGII} />
          </div>
          <div>
            <p className="text-sm font-medium">Fecha Creación</p>
            <p className="text-sm text-muted-foreground">{formatDateTime(dte.fechaCreacion)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Fecha Respuesta</p>
            <p className="text-sm text-muted-foreground">
              {dte.fechaRespuesta ? formatDateTime(dte.fechaRespuesta) : "Pendiente"}
            </p>
          </div>
        </div>

        {dte.mensajes && dte.mensajes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Mensajes</p>
            <div className="space-y-1">
              {dte.mensajes.map((mensaje, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {mensaje}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => downloadXML(dte.id)}>
            <File className="mr-2 h-4 w-4" />
            Descargar XML
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadPDF(dte.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
