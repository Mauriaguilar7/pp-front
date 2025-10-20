"use client"

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/common/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VentasPendientesTable } from "../components/VentasPendientesTable"
import { DTEsTable } from "../components/DTEsTable"
import { DTEStatusCard } from "../components/DTEStatusCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function FacturacionPage() {
  const [searchParams] = useSearchParams()
  const ventaId = searchParams.get("ventaId")
  const [activeTab, setActiveTab] = useState(ventaId ? "status" : "pendientes")

  const stats = [
    {
      title: "Pendientes",
      value: "3",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Aceptados",
      value: "21",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rechazados",
      value: "2",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      title: "Total DTEs",
      value: "26",
      icon: FileText,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturación Electrónica"
        description="Gestiona la generación y seguimiento de Documentos Tributarios Electrónicos (DTE)"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendientes">Ventas Pendientes</TabsTrigger>
          <TabsTrigger value="dtes">DTEs Generados</TabsTrigger>
          {ventaId && <TabsTrigger value="status">Estado DTE</TabsTrigger>}
        </TabsList>

        <TabsContent value="pendientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Pendientes de Facturación</CardTitle>
              <CardDescription>
                Ventas registradas que están listas para generar su Documento Tributario Electrónico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VentasPendientesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dtes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Tributarios Electrónicos</CardTitle>
              <CardDescription>Historial de todos los DTEs generados y su estado en DGII</CardDescription>
            </CardHeader>
            <CardContent>
              <DTEsTable />
            </CardContent>
          </Card>
        </TabsContent>

        {ventaId && (
          <TabsContent value="status" className="space-y-4">
            <DTEStatusCard ventaId={ventaId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
