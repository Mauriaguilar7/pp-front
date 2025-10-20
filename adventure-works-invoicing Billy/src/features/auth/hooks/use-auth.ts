"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "../store/auth-store"
import type { LoginData, User } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface LoginResponse {
  user: User
  token: string
}

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, token, isAuthenticated, setAuth, clearAuth, updateLastActivity, isSessionExpired } = useAuthStore()

  // Set token in API client when it changes
  if (token) {
    apiClient.setToken(token)
  }

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      return apiClient.post("/auth/login", data)
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      apiClient.setToken(data.token)
      toast({
        title: "Bienvenido",
        description: `Hola ${data.user.nombre}`,
      })
      navigate("/dashboard")
    },
    onError: (error: Error) => {
      toast({
        title: "Error de autenticación",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post("/auth/logout")
    },
    onSuccess: () => {
      clearAuth()
      apiClient.setToken(null)
      queryClient.clear()
      navigate("/login")
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
    },
  })

  const { data: currentUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiClient.get<{ user: User }>("/auth/me")
      return response.user
    },
    enabled: !!token && isAuthenticated,
    retry: false,
  })

  const login = (data: LoginData) => {
    updateLastActivity()
    loginMutation.mutate(data)
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  const checkSession = () => {
    if (isAuthenticated && isSessionExpired()) {
      toast({
        title: "Sesión expirada",
        description: "Tu sesión ha expirado por inactividad",
        variant: "destructive",
      })
      logout()
      return false
    }
    return true
  }

  return {
    user: currentUser || user,
    isAuthenticated: isAuthenticated && !!token,
    isLoading: loginMutation.isPending,
    login,
    logout,
    updateLastActivity,
    checkSession,
  }
}
