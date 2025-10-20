import type { Venta } from "@/lib/validations"

export const ventas: Venta[] = [
  {
    id: "1",
    numero: "V-000001",
    fecha: new Date("2024-01-15T10:30:00"),
    clienteId: "1",
    vendedorId: "2",
    items: [
      {
        productoId: "1",
        nombre: "Laptop Dell Inspiron 15",
        cantidad: 2,
        precio: 850.0,
        iva: 0.13,
        subtotal: 1700.0,
      },
      {
        productoId: "2",
        nombre: "Mouse Inalámbrico Logitech",
        cantidad: 2,
        precio: 45.99,
        iva: 0.13,
        subtotal: 91.98,
      },
    ],
    subtotal: 1791.98,
    totalIva: 232.96,
    total: 2024.94,
    estado: "PENDIENTE",
    fechaCreacion: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    numero: "V-000002",
    fecha: new Date("2024-01-15T14:15:00"),
    clienteId: "2",
    vendedorId: "2",
    items: [
      {
        productoId: "3",
        nombre: "Monitor Samsung 24 pulgadas",
        cantidad: 1,
        precio: 299.99,
        iva: 0.13,
        subtotal: 299.99,
      },
    ],
    subtotal: 299.99,
    totalIva: 39.0,
    total: 338.99,
    estado: "FACTURADA",
    fechaCreacion: new Date("2024-01-15T14:15:00"),
  },
]
