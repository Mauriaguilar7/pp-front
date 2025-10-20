import type { User } from "@/lib/validations"

export const users: User[] = [
  {
    id: "1",
    nombre: "Administrador Sistema",
    email: "admin@adventureworks.com",
    rol: "ADMIN",
    estado: "ACTIVO",
    ultimoAcceso: new Date("2024-01-15T10:30:00"),
    fechaCreacion: new Date("2024-01-01T00:00:00"),
  },
  {
    id: "2",
    nombre: "María González",
    email: "cajero@adventureworks.com",
    rol: "CASHIER",
    estado: "ACTIVO",
    ultimoAcceso: new Date("2024-01-15T09:15:00"),
    fechaCreacion: new Date("2024-01-02T00:00:00"),
  },
  {
    id: "3",
    nombre: "Carlos Supervisor",
    email: "supervisor@adventureworks.com",
    rol: "SUPERVISOR",
    estado: "ACTIVO",
    ultimoAcceso: new Date("2024-01-14T16:45:00"),
    fechaCreacion: new Date("2024-01-03T00:00:00"),
  },
  {
    id: "4",
    nombre: "Ana Vendedora",
    email: "vendedor@adventureworks.com",
    rol: "CASHIER",
    estado: "INACTIVO",
    ultimoAcceso: new Date("2024-01-10T14:20:00"),
    fechaCreacion: new Date("2024-01-04T00:00:00"),
  },
]

export const usersFixtures = users
