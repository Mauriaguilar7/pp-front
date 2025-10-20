"use client"

import { useState } from "react"
import { useClientes } from "../hooks/use-clientes"
import type { Cliente } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, User } from "lucide-react"

interface ClienteSelectorProps {
  selectedCliente: Cliente | null
  onSelectCliente: (cliente: Cliente) => void
  onCreateCliente?: () => void
}

export function ClienteSelector({ selectedCliente, onSelectCliente, onCreateCliente }: ClienteSelectorProps) {
  const [search, setSearch] = useState("")
  const { data: clientesData, isLoading } = useClientes(search)

  const clientes = clientesData?.clientes || []

  if (selectedCliente) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cliente Seleccionado</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onSelectCliente(null as any)}>
              Cambiar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{selectedCliente.nombre}</span>
              <Badge variant="outline">{selectedCliente.perfilFiscal}</Badge>
            </div>
            {selectedCliente.nit && <p className="text-sm text-muted-foreground">NIT: {selectedCliente.nit}</p>}
            {selectedCliente.email && <p className="text-sm text-muted-foreground">Email: {selectedCliente.email}</p>}
            <p className="text-sm text-muted-foreground">{selectedCliente.direccion}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Seleccionar Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nombre, NIT o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {onCreateCliente && (
            <Button onClick={onCreateCliente} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nuevo
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Buscando clientes...</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {search ? "No se encontraron clientes" : "No hay clientes disponibles"}
              </p>
            </div>
          ) : (
            clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onSelectCliente(cliente)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                    {cliente.nit && <p className="text-sm text-muted-foreground">NIT: {cliente.nit}</p>}
                    {cliente.email && <p className="text-sm text-muted-foreground">{cliente.email}</p>}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cliente.perfilFiscal}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
