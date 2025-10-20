import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Venta } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface VentasResponse {
  ventas: (Venta & { cliente?: any; vendedor?: any })[]
}

interface VentaResponse {
  venta: Venta & { cliente?: any; vendedor?: any }
}

export function useVentas(filters?: {
  search?: string
  estado?: string
  clienteId?: string
}) {
  return useQuery({
    queryKey: ["ventas", filters],
    queryFn: async (): Promise<VentasResponse> => {
      const params = new URLSearchParams()
      if (filters?.search) params.append("search", filters.search)
      if (filters?.estado) params.append("estado", filters.estado)
      if (filters?.clienteId) params.append("clienteId", filters.clienteId)

      return apiClient.get(`/ventas?${params.toString()}`)
    },
  })
}

export function useVenta(id: string) {
  return useQuery({
    queryKey: ["venta", id],
    queryFn: async (): Promise<VentaResponse> => {
      return apiClient.get(`/ventas/${id}`)
    },
    enabled: !!id,
  })
}

export function useCreateVenta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Venta, "id" | "numero" | "fechaCreacion">): Promise<VentaResponse> => {
      return apiClient.post("/ventas", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      toast({
        title: "Venta creada",
        description: "La venta ha sido registrada exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useUpdateVenta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Venta> }): Promise<VentaResponse> => {
      return apiClient.put(`/ventas/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      queryClient.invalidateQueries({ queryKey: ["venta", id] })
      toast({
        title: "Venta actualizada",
        description: "La venta ha sido actualizada exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
