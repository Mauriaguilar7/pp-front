"use client"

import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"
import type { UserRole } from "@/lib/validations"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.rol !== requiredRole && user?.rol !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
