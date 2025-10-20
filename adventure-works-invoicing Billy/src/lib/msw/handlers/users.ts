import { http, HttpResponse } from "msw"
import { users } from "../fixtures/users"

export const userHandlers = [
  // Get all users
  http.get("/api/users", ({ request }) => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return HttpResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return HttpResponse.json({ users })
  }),
]
