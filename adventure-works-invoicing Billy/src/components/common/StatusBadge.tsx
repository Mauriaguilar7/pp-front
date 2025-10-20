import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

const statusConfig = {
  // Sales statuses
  PENDIENTE: { variant: "secondary" as const, label: "Pendiente" },
  FACTURADA: { variant: "default" as const, label: "Facturada" },
  ANULADA: { variant: "destructive" as const, label: "Anulada" },

  // User statuses
  ACTIVO: { variant: "default" as const, label: "Activo" },
  INACTIVO: { variant: "secondary" as const, label: "Inactivo" },

  // DTE statuses
  ACEPTADO: { variant: "default" as const, label: "Aceptado" },
  RECHAZADO: { variant: "destructive" as const, label: "Rechazado" },

  // Generic statuses
  COMPLETADO: { variant: "default" as const, label: "Completado" },
  EN_PROCESO: { variant: "secondary" as const, label: "En Proceso" },
  ERROR: { variant: "destructive" as const, label: "Error" },
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig]

  if (!config) {
    return (
      <Badge variant={variant || "outline"} className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge variant={variant || config.variant} className={cn("capitalize", className)}>
      {config.label}
    </Badge>
  )
}
