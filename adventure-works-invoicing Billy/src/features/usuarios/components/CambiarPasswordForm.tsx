"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormField } from "@/components/common/FormField"

const cambiarPasswordSchema = z
  .object({
    passwordActual: z.string().min(1, "Ingrese la contraseña actual"),
    passwordNuevo: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarPassword: z.string().min(1, "Confirme la nueva contraseña"),
  })
  .refine((data) => data.passwordNuevo === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  })

type CambiarPasswordData = z.infer<typeof cambiarPasswordSchema>

interface CambiarPasswordFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { passwordActual: string; passwordNuevo: string }) => void
  isLoading?: boolean
}

export function CambiarPasswordForm({ open, onOpenChange, onSubmit, isLoading = false }: CambiarPasswordFormProps) {
  const form = useForm<CambiarPasswordData>({
    resolver: zodResolver(cambiarPasswordSchema),
    defaultValues: {
      passwordActual: "",
      passwordNuevo: "",
      confirmarPassword: "",
    },
  })

  const handleSubmit = (data: CambiarPasswordData) => {
    onSubmit({
      passwordActual: data.passwordActual,
      passwordNuevo: data.passwordNuevo,
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            label="Contraseña actual"
            name="passwordActual"
            type="password"
            control={form.control}
            placeholder="Ingrese la contraseña actual"
          />

          <FormField
            label="Nueva contraseña"
            name="passwordNuevo"
            type="password"
            control={form.control}
            placeholder="Ingrese la nueva contraseña"
          />

          <FormField
            label="Confirmar nueva contraseña"
            name="confirmarPassword"
            type="password"
            control={form.control}
            placeholder="Confirme la nueva contraseña"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
