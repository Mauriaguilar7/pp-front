import { http, HttpResponse } from "msw"
import { usersFixtures } from "../fixtures/users"
import type { Usuario } from "@/lib/validations"

const usuarios = [...usersFixtures]

export const usuariosHandlers = [
  // Obtener usuarios
  http.get("/api/usuarios", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const rol = url.searchParams.get("rol")
    const activo = url.searchParams.get("activo")

    let filteredUsuarios = usuarios

    if (search) {
      filteredUsuarios = filteredUsuarios.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
          usuario.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (rol) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.rol === rol)
    }

    if (activo !== null) {
      filteredUsuarios = filteredUsuarios.filter((usuario) => usuario.activo === (activo === "true"))
    }

    return HttpResponse.json(filteredUsuarios)
  }),

  // Crear usuario
  http.post("/api/usuarios", async ({ request }) => {
    const data = (await request.json()) as Omit<Usuario, "id" | "fechaCreacion" | "fechaActualizacion">

    // Verificar email único
    const existingUser = usuarios.find((u) => u.email === data.email)
    if (existingUser) {
      return HttpResponse.json({ message: "Ya existe un usuario con este email" }, { status: 400 })
    }

    const newUsuario: Usuario = {
      ...data,
      id: (usuarios.length + 1).toString(),
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    usuarios.push(newUsuario)

    return HttpResponse.json(newUsuario, { status: 201 })
  }),

  // Actualizar usuario
  http.put("/api/usuarios/:id", async ({ params, request }) => {
    const { id } = params
    const data = (await request.json()) as Partial<Usuario>

    const index = usuarios.findIndex((u) => u.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar email único (excluyendo el usuario actual)
    if (data.email) {
      const existingUser = usuarios.find((u) => u.email === data.email && u.id !== id)
      if (existingUser) {
        return HttpResponse.json({ message: "Ya existe un usuario con este email" }, { status: 400 })
      }
    }

    usuarios[index] = {
      ...usuarios[index],
      ...data,
      fechaActualizacion: new Date().toISOString(),
    }

    return HttpResponse.json(usuarios[index])
  }),

  // Eliminar usuario
  http.delete("/api/usuarios/:id", ({ params }) => {
    const { id } = params

    const index = usuarios.findIndex((u) => u.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // No permitir eliminar el último administrador
    const adminCount = usuarios.filter((u) => u.rol === "ADMIN" && u.activo).length
    if (usuarios[index].rol === "ADMIN" && adminCount <= 1) {
      return HttpResponse.json({ message: "No se puede eliminar el último administrador activo" }, { status: 400 })
    }

    usuarios.splice(index, 1)

    return HttpResponse.json({ message: "Usuario eliminado correctamente" })
  }),

  // Cambiar contraseña
  http.post("/api/usuarios/:id/cambiar-password", async ({ params, request }) => {
    const { id } = params
    const { passwordActual, passwordNuevo } = (await request.json()) as {
      passwordActual: string
      passwordNuevo: string
    }

    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) {
      return HttpResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Simular verificación de contraseña actual
    if (passwordActual !== "password123") {
      return HttpResponse.json({ message: "Contraseña actual incorrecta" }, { status: 400 })
    }

    // Actualizar contraseña (en un sistema real se hashearia)
    const index = usuarios.findIndex((u) => u.id === id)
    usuarios[index] = {
      ...usuarios[index],
      fechaActualizacion: new Date().toISOString(),
    }

    return HttpResponse.json({ message: "Contraseña actualizada correctamente" })
  }),
]
