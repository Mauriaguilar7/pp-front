"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormField } from "@/components/common/FormField"
import type { Usuario } from "@/lib/validations"

const usuarioFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  rol: z.enum(["ADMIN", "CASHIER", "SUPERVISOR"], {
    required_error: "Seleccione un rol",
  }),
  activo: z.boolean().default(true),
})

type UsuarioFormData = z.infer<typeof usuarioFormSchema>

interface UsuarioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario
  onSubmit: (data: UsuarioFormData) => void
  isLoading?: boolean
}

export function UsuarioForm({ open, onOpenChange, usuario, onSubmit, isLoading = false }: UsuarioFormProps) {
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: {
      nombre: usuario?.nombre || "",
      email: usuario?.email || "",
      rol: usuario?.rol || "CASHIER",
      activo: usuario?.activo ?? true,
    },
  })

  const handleSubmit = (data: UsuarioFormData) => {
    onSubmit(data)
    if (!usuario) {
      form.reset()
    }
  }

  const roleOptions = [
    { value: "ADMIN", label: "Administrador" },
    { value: "CASHIER", label: "Cajero/Vendedor" },
    { value: "SUPERVISOR", label: "Supervisor" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            label="Nombre completo"
            name="nombre"
            control={form.control}
            placeholder="Ingrese el nombre completo"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            control={form.control}
            placeholder="usuario@adventureworks.com"
          />

          <FormField label="Rol" name="rol" type="select" control={form.control} options={roleOptions} />

          <FormField label="Usuario activo" name="activo" type="checkbox" control={form.control} />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : usuario ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
