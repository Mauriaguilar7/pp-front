import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Usuario } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface UsuariosFilters {
  search?: string
  rol?: string
  activo?: boolean
}

interface CambiarPasswordData {
  passwordActual: string
  passwordNuevo: string
}

export function useUsuarios(filters: UsuariosFilters = {}) {
  return useQuery({
    queryKey: ["usuarios", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.rol) params.append("rol", filters.rol)
      if (filters.activo !== undefined) params.append("activo", filters.activo.toString())

      const response = await apiClient.get(`/usuarios?${params.toString()}`)
      return response.data as Usuario[]
    },
  })
}

export function useCreateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Usuario, "id" | "fechaCreacion" | "fechaActualizacion">) => {
      const response = await apiClient.post("/usuarios", data)
      return response.data as Usuario
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado correctamente.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear el usuario.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Usuario> }) => {
      const response = await apiClient.put(`/usuarios/${id}`, data)
      return response.data as Usuario
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado correctamente.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al actualizar el usuario.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/usuarios/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el usuario.",
        variant: "destructive",
      })
    },
  })
}

export function useCambiarPassword() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CambiarPasswordData }) => {
      const response = await apiClient.post(`/usuarios/${id}/cambiar-password`, data)
      return response.data
    },
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "La contraseña ha sido actualizada correctamente.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al cambiar la contraseña.",
        variant: "destructive",
      })
    },
  })
}
