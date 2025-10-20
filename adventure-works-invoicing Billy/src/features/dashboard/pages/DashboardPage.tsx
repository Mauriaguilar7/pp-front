"use client"

import { useTranslation } from "react-i18next"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { DollarSign, FileText, AlertCircle, CheckCircle, TrendingUp, Users, ShoppingCart } from "lucide-react"

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const kpis = [
    {
      title: "Ventas del Día",
      value: "$2,450.00",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Facturas Emitidas",
      value: "24",
      change: "+8%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Facturas Pendientes",
      value: "3",
      change: "-2%",
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "Facturas Aceptadas",
      value: "21",
      change: "+15%",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Factura generada",
      details: "Factura #F-001234 para Cliente ABC",
      time: "Hace 5 minutos",
      status: "success",
    },
    {
      id: 2,
      action: "Venta registrada",
      details: "Venta #V-005678 por $350.00",
      time: "Hace 15 minutos",
      status: "info",
    },
    {
      id: 3,
      action: "Cliente creado",
      details: "Nuevo cliente: Empresa XYZ S.A.",
      time: "Hace 1 hora",
      status: "success",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.nombre}</h1>
        <p className="text-muted-foreground">
          Último acceso: {user?.ultimoAcceso ? formatDateTime(user.ultimoAcceso) : "Nunca"}
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{kpi.change}</span>{" "}
                desde ayer
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.status === "info" && <TrendingUp className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Acciones frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Nueva Venta</span>
                </div>
                <Badge variant="secondary">Ctrl+N</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Generar Factura</span>
                </div>
                <Badge variant="secondary">Ctrl+F</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Nuevo Cliente</span>
                </div>
                <Badge variant="secondary">Ctrl+C</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
