"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductoSchema, type Producto } from "@/lib/validations"
import { useCategorias } from "../hooks/use-productos"
import { TextField, SelectField } from "@/components/common/FormField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ProductoFormProps {
  producto?: Producto
  onSubmit: (data: Omit<Producto, "id" | "fechaCreacion">) => void
  onCancel: () => void
  isLoading?: boolean
}

const createProductoSchema = ProductoSchema.omit({ id: true, fechaCreacion: true })

export function ProductoForm({ producto, onSubmit, onCancel, isLoading }: ProductoFormProps) {
  const { data: categoriasData } = useCategorias()
  const categorias = categoriasData?.categorias || []

  const form = useForm<Omit<Producto, "id" | "fechaCreacion">>({
    resolver: zodResolver(createProductoSchema),
    defaultValues: producto
      ? {
          nombre: producto.nombre,
          sku: producto.sku,
          categoria: producto.categoria,
          unidad: producto.unidad,
          precio: producto.precio,
          iva: producto.iva,
          estado: producto.estado,
          stock: producto.stock,
        }
      : {
          nombre: "",
          sku: "",
          categoria: "",
          unidad: "Unidad",
          precio: 0,
          iva: 0.13,
          estado: "ACTIVO",
          stock: 0,
        },
  })

  const categoriaOptions = [
    ...categorias.map((cat) => ({ value: cat, label: cat })),
    { value: "Computadoras", label: "Computadoras" },
    { value: "Accesorios", label: "Accesorios" },
    { value: "Monitores", label: "Monitores" },
    { value: "Impresoras", label: "Impresoras" },
    { value: "Software", label: "Software" },
  ].filter((option, index, self) => self.findIndex((o) => o.value === option.value) === index)

  const unidadOptions = [
    { value: "Unidad", label: "Unidad" },
    { value: "Caja", label: "Caja" },
    { value: "Paquete", label: "Paquete" },
    { value: "Metro", label: "Metro" },
    { value: "Kilogramo", label: "Kilogramo" },
    { value: "Litro", label: "Litro" },
  ]

  const estadoOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{producto ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField form={form} name="nombre" label="Nombre" required placeholder="Nombre del producto" />

            <TextField form={form} name="sku" label="SKU" required placeholder="Código único del producto" />

            <SelectField
              form={form}
              name="categoria"
              label="Categoría"
              required
              placeholder="Seleccionar categoría"
              options={categoriaOptions}
            />

            <SelectField
              form={form}
              name="unidad"
              label="Unidad de Medida"
              required
              placeholder="Seleccionar unidad"
              options={unidadOptions}
            />

            <TextField
              form={form}
              name="precio"
              label="Precio"
              type="number"
              required
              placeholder="0.00"
              description="Precio en USD"
            />

            <TextField
              form={form}
              name="iva"
              label="IVA"
              type="number"
              required
              placeholder="0.13"
              description="Porcentaje de IVA (ej: 0.13 para 13%)"
            />

            <TextField
              form={form}
              name="stock"
              label="Stock"
              type="number"
              placeholder="0"
              description="Cantidad disponible (informativo)"
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
              {producto ? "Actualizar" : "Crear"} Producto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
