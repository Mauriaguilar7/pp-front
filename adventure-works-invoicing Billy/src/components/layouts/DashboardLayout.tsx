"use client"

import { type ReactNode, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { RoleGuard } from "@/features/auth/components/RoleGuard"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Users,
  Shield,
  BarChart3,
  Menu,
  LogOut,
  User,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

const navigation = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "CASHIER", "SUPERVISOR"],
  },
  {
    name: "ventas",
    href: "/ventas",
    icon: ShoppingCart,
    roles: ["ADMIN", "CASHIER"],
  },
  {
    name: "facturacion",
    href: "/facturacion",
    icon: FileText,
    roles: ["ADMIN", "CASHIER"],
  },
  {
    name: "productos",
    href: "/productos",
    icon: Package,
    roles: ["ADMIN"],
  },
  {
    name: "clientes",
    href: "/clientes",
    icon: Users,
    roles: ["ADMIN", "CASHIER"],
  },
  {
    name: "usuarios",
    href: "/usuarios",
    icon: User,
    roles: ["ADMIN"],
  },
  {
    name: "seguridad",
    href: "/seguridad",
    icon: Shield,
    roles: ["ADMIN"],
  },
  {
    name: "reportes",
    href: "/reportes",
    icon: BarChart3,
    roles: ["ADMIN", "SUPERVISOR"],
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">Adventure Works</span>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <RoleGuard key={item.name} allowedRoles={item.roles as any}>
                <li>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {t(item.name)}
                  </Link>
                </li>
              </RoleGuard>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getUserInitials(user.nombre) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.nombre}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">Rol: {user?.rol}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("cerrarSesion")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
