import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Producto } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface ProductosResponse {
  productos: Producto[]
}

interface ProductoResponse {
  producto: Producto
}

interface CategoriasResponse {
  categorias: string[]
}

export function useProductos(filters?: {
  search?: string
  categoria?: string
  estado?: string
}) {
  return useQuery({
    queryKey: ["productos", filters],
    queryFn: async (): Promise<ProductosResponse> => {
      const params = new URLSearchParams()
      if (filters?.search) params.append("search", filters.search)
      if (filters?.categoria) params.append("categoria", filters.categoria)
      if (filters?.estado) params.append("estado", filters.estado)

      return apiClient.get(`/productos?${params.toString()}`)
    },
  })
}

export function useProducto(id: string) {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: async (): Promise<ProductoResponse> => {
      return apiClient.get(`/productos/${id}`)
    },
    enabled: !!id,
  })
}

export function useCategorias() {
  return useQuery({
    queryKey: ["productos", "categorias"],
    queryFn: async (): Promise<CategoriasResponse> => {
      return apiClient.get("/productos/categorias")
    },
  })
}

export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Producto, "id" | "fechaCreacion">): Promise<ProductoResponse> => {
      return apiClient.post("/productos", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
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

export function useUpdateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Producto> }): Promise<ProductoResponse> => {
      return apiClient.put(`/productos/${id}`, data)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      queryClient.invalidateQueries({ queryKey: ["producto", id] })
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente",
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

export function useDeleteProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      return apiClient.delete(`/productos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
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
