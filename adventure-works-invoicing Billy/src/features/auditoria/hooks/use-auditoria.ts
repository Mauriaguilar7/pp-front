import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Auditoria } from "@/lib/validations"

interface AuditoriaFilters {
  usuarioId?: string
  accion?: string
  entidad?: string
  fechaInicio?: string
  fechaFin?: string
}

export function useAuditoria(filters: AuditoriaFilters = {}) {
  return useQuery({
    queryKey: ["auditoria", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.usuarioId) params.append("usuarioId", filters.usuarioId)
      if (filters.accion) params.append("accion", filters.accion)
      if (filters.entidad) params.append("entidad", filters.entidad)
      if (filters.fechaInicio) params.append("fechaInicio", filters.fechaInicio)
      if (filters.fechaFin) params.append("fechaFin", filters.fechaFin)

      const response = await apiClient.get(`/auditoria?${params.toString()}`)
      return response.data as Auditoria[]
    },
  })
}
