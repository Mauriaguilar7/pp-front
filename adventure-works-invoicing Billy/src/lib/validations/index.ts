import { z } from "zod"

// User schemas
export const UserRole = z.enum(["ADMIN", "CASHIER", "SUPERVISOR"])

export const UserSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre es requerido"),
  email: z.string().email("Email inválido"),
  rol: UserRole,
  estado: z.enum(["ACTIVO", "INACTIVO"]),
  ultimoAcceso: z.date().optional(),
  fechaCreacion: z.date(),
})

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
})

// Client schemas
export const ClienteSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre es requerido"),
  nit: z.string().optional(),
  nrc: z.string().optional(),
  direccion: z.string().min(1, "Dirección es requerida"),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  perfilFiscal: z.enum(["RESPONSABLE_IVA", "EXENTO", "PERCEPCION"]),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
  fechaCreacion: z.date(),
})

// Product schemas
export const ProductoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, "Nombre es requerido"),
  sku: z.string().min(1, "SKU es requerido"),
  categoria: z.string().min(1, "Categoría es requerida"),
  unidad: z.string().min(1, "Unidad es requerida"),
  precio: z.number().min(0, "Precio debe ser mayor a 0"),
  iva: z.number().min(0).max(1),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
  stock: z.number().min(0).optional(),
  fechaCreacion: z.date(),
})

// Sale schemas
export const VentaItemSchema = z.object({
  productoId: z.string(),
  nombre: z.string(),
  cantidad: z.number().min(1, "Cantidad debe ser mayor a 0"),
  precio: z.number().min(0),
  descuento: z.number().min(0).max(1).optional(),
  iva: z.number().min(0),
  subtotal: z.number().min(0),
})

export const VentaSchema = z.object({
  id: z.string(),
  numero: z.string(),
  fecha: z.date(),
  clienteId: z.string(),
  vendedorId: z.string(),
  items: z.array(VentaItemSchema),
  subtotal: z.number().min(0),
  totalIva: z.number().min(0),
  total: z.number().min(0),
  estado: z.enum(["PENDIENTE", "FACTURADA", "ANULADA"]),
  fechaCreacion: z.date(),
})

// DTE schemas
export const DTESchema = z.object({
  id: z.string(),
  ventaId: z.string(),
  estadoDGII: z.enum(["ACEPTADO", "RECHAZADO", "PENDIENTE"]),
  xml: z.string(),
  pdfUrl: z.string(),
  mensajes: z.array(z.string()).optional(),
  fechaCreacion: z.date(),
  fechaRespuesta: z.date().optional(),
})

// Audit schemas
export const AuditoriaSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  evento: z.string(),
  ip: z.string(),
  metadatos: z.record(z.any()).optional(),
  fecha: z.date(),
})

export type User = z.infer<typeof UserSchema>
export type UserRole = z.infer<typeof UserRole>
export type LoginData = z.infer<typeof LoginSchema>
export type Cliente = z.infer<typeof ClienteSchema>
export type Producto = z.infer<typeof ProductoSchema>
export type Venta = z.infer<typeof VentaSchema>
export type VentaItem = z.infer<typeof VentaItemSchema>
export type DTE = z.infer<typeof DTESchema>
export type Auditoria = z.infer<typeof AuditoriaSchema>
