"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ClienteSchema, type Cliente } from "@/lib/validations"
import { TextField, SelectField } from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ClienteFormProps {
  cliente?: Cliente
  onSubmit: (data: Omit<Cliente, "id" | "fechaCreacion">) => void
  onCancel: () => void
  isLoading?: boolean
}

const createClienteSchema = ClienteSchema.omit({ id: true, fechaCreacion: true })

export function ClienteForm({ cliente, onSubmit, onCancel, isLoading }: ClienteFormProps) {
  const form = useForm<Omit<Cliente, "id" | "fechaCreacion">>({
    resolver: zodResolver(createClienteSchema),
    defaultValues: cliente
      ? {
          nombre: cliente.nombre,
          nit: cliente.nit,
          nrc: cliente.nrc,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          email: cliente.email,
          perfilFiscal: cliente.perfilFiscal,
          estado: cliente.estado,
        }
      : {
          nombre: "",
          nit: "",
          nrc: "",
          direccion: "",
          telefono: "",
          email: "",
          perfilFiscal: "RESPONSABLE_IVA",
          estado: "ACTIVO",
        },
  })

  const perfilFiscalOptions = [
    { value: "RESPONSABLE_IVA", label: "Responsable de IVA" },
    { value: "EXENTO", label: "Exento" },
    { value: "PERCEPCION", label: "Percepción" },
  ]

  const estadoOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField
              form={form}
              name="nombre"
              label="Nombre / Razón Social"
              required
              placeholder="Nombre completo o razón social"
              className="md:col-span-2"
            />

            <TextField
              form={form}
              name="nit"
              label="NIT"
              placeholder="0614-123456-001-2"
              description="Número de Identificación Tributaria"
            />

            <TextField
              form={form}
              name="nrc"
              label="NRC"
              placeholder="123456-7"
              description="Número de Registro de Contribuyente"
            />

            <TextField
              form={form}
              name="direccion"
              label="Dirección"
              required
              placeholder="Dirección completa"
              className="md:col-span-2"
            />

            <TextField
              form={form}
              name="telefono"
              label="Teléfono"
              type="tel"
              placeholder="2234-5678"
              description="Número de teléfono de contacto"
            />

            <TextField
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="contacto@empresa.com"
              description="Correo electrónico de contacto"
            />

            <SelectField
              form={form}
              name="perfilFiscal"
              label="Perfil Fiscal"
              required
              placeholder="Seleccionar perfil fiscal"
              options={perfilFiscalOptions}
            />

            <SelectField
              form={form}
              name="estado"
              label="Estado"
              required
              placeholder="Seleccionar estado"
              options={estadoOptions}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cliente ? "Actualizar" : "Crear"} Cliente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
