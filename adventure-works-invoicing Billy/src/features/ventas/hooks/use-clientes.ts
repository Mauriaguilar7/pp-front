import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Cliente } from "@/lib/validations"

interface ClientesResponse {
  clientes: Cliente[]
}

export function useClientes(search?: string) {
  return useQuery({
    queryKey: ["clientes", search],
    queryFn: async (): Promise<ClientesResponse> => {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      return apiClient.get(`/clientes?${params.toString()}`)
    },
  })
}
