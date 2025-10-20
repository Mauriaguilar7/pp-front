import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Cliente } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface ClientesResponse {
  clientes: Cliente[]
}

interface ClienteResponse {
  cliente: Cliente
}

export function useClientes(filters?: {
  search?: string
  perfilFiscal?: string
  estado?: string
}) {
  return useQuery({
    queryKey: ["clientes", filters],
    queryFn: async (): Promise<ClientesResponse> => {
      const params = new URLSearchParams()
      if (filters?.search) params.append("search", filters.search)
      if (filters?.perfilFiscal) params.append("perfilFiscal", filters.perfilFiscal)
      if (filters?.estado) params.append("estado", filters.estado)

      return apiClient.get(`/clientes?${params.toString()}`)
    },
  })
}

export function useCliente(id: string) {
  return useQuery({
    queryKey: ["cliente", id],
    queryFn: async (): Promise<ClienteResponse> => {
      return apiClient.get(`/clientes/${id}`)
    },
    enabled: !!id,
  })
}

export function useCreateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Cliente, "id" | "fechaCreacion">): Promise<ClienteResponse> => {
      return apiClient.post("/clientes", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente",
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

export function useUpdateCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cliente> }): Promise<ClienteResponse> => {
      return apiClient.put(`/clientes/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      queryClient.invalidateQueries({ queryKey: ["cliente", id] })
      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado exitosamente",
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

export function useDeleteCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      return apiClient.delete(`/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente",
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
