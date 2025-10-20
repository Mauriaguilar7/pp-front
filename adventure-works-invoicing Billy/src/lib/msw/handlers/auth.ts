import { http, HttpResponse } from "msw"
import { LoginSchema } from "@/lib/validations"
import { users } from "../fixtures/users"

const failedAttempts: Record<string, { count: number; lastAttempt: number }> = {}

export const authHandlers = [
  // Login
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json()
    const result = LoginSchema.safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    const { email, password } = result.data
    const now = Date.now()

    // Check failed attempts
    const userAttempts = failedAttempts[email]
    if (userAttempts && userAttempts.count >= 5) {
      const timeSinceLastAttempt = now - userAttempts.lastAttempt
      const lockoutTime = 15 * 60 * 1000 // 15 minutes

      if (timeSinceLastAttempt < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - timeSinceLastAttempt) / 60000)
        return HttpResponse.json(
          { error: `Cuenta bloqueada. Intente nuevamente en ${remainingTime} minutos.` },
          { status: 423 },
        )
      } else {
        // Reset attempts after lockout period
        delete failedAttempts[email]
      }
    }

    // Find user
    const user = users.find((u) => u.email === email)

    // Simulate password check (in real app, this would be hashed)
    if (!user || password !== "password123") {
      // Track failed attempt
      if (!failedAttempts[email]) {
        failedAttempts[email] = { count: 0, lastAttempt: 0 }
      }
      failedAttempts[email].count++
      failedAttempts[email].lastAttempt = now

      const remainingAttempts = 5 - failedAttempts[email].count
      let message = "Credenciales inválidas"

      if (remainingAttempts > 0) {
        message += `. ${remainingAttempts} intentos restantes.`
      } else {
        message = "Cuenta bloqueada por múltiples intentos fallidos."
      }

      return HttpResponse.json({ error: message }, { status: 401 })
    }

    if (user.estado === "INACTIVO") {
      return HttpResponse.json({ error: "Usuario inactivo" }, { status: 403 })
    }

    // Reset failed attempts on successful login
    delete failedAttempts[email]

    // Update last access
    user.ultimoAcceso = new Date()

    // Generate token (in real app, this would be a JWT)
    const token = `token_${user.id}_${Date.now()}`

    return HttpResponse.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        ultimoAcceso: user.ultimoAcceso,
      },
      token,
    })
  }),

  // Get current user
  http.get("/api/auth/me", ({ request }) => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Token requerido" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const userId = token.split("_")[1]

    const user = users.find((u) => u.id === userId)
    if (!user) {
      return HttpResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return HttpResponse.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        ultimoAcceso: user.ultimoAcceso,
      },
    })
  }),

  // Logout
  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ message: "Sesión cerrada exitosamente" })
  }),
]
