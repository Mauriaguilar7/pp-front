import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Producto } from "@/lib/validations"

interface ProductosResponse {
  productos: Producto[]
}

export function useProductos(search?: string) {
  return useQuery({
    queryKey: ["productos", search],
    queryFn: async (): Promise<ProductosResponse> => {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      return apiClient.get(`/productos?${params.toString()}`)
    },
  })
}
