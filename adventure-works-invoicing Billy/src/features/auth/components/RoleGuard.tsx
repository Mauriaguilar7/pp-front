"use client"

import type { ReactNode } from "react"
import { useAuth } from "../hooks/use-auth"
import type { UserRole } from "@/lib/validations"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || (!allowedRoles.includes(user.rol) && user.rol !== "ADMIN")) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
