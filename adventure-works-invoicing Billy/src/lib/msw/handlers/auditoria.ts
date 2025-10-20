import { http, HttpResponse } from "msw"
import { auditoriaFixtures } from "../fixtures/auditoria"
import type { Auditoria } from "@/lib/validations"

const auditorias = [...auditoriaFixtures]

export const auditoriaHandlers = [
  // Obtener auditorías
  http.get("/api/auditoria", ({ request }) => {
    const url = new URL(request.url)
    const usuarioId = url.searchParams.get("usuarioId")
    const accion = url.searchParams.get("accion")
    const entidad = url.searchParams.get("entidad")
    const fechaInicio = url.searchParams.get("fechaInicio")
    const fechaFin = url.searchParams.get("fechaFin")

    let filteredAuditorias = auditorias

    if (usuarioId) {
      filteredAuditorias = filteredAuditorias.filter((auditoria) => auditoria.usuarioId === usuarioId)
    }

    if (accion) {
      filteredAuditorias = filteredAuditorias.filter((auditoria) => auditoria.accion === accion)
    }

    if (entidad) {
      filteredAuditorias = filteredAuditorias.filter((auditoria) => auditoria.entidad === entidad)
    }

    if (fechaInicio) {
      filteredAuditorias = filteredAuditorias.filter(
        (auditoria) => new Date(auditoria.fechaCreacion) >= new Date(fechaInicio),
      )
    }

    if (fechaFin) {
      filteredAuditorias = filteredAuditorias.filter(
        (auditoria) => new Date(auditoria.fechaCreacion) <= new Date(fechaFin),
      )
    }

    // Ordenar por fecha descendente
    filteredAuditorias.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())

    return HttpResponse.json(filteredAuditorias)
  }),

  // Crear entrada de auditoría
  http.post("/api/auditoria", async ({ request }) => {
    const data = (await request.json()) as Omit<Auditoria, "id" | "fechaCreacion">

    const newAuditoria: Auditoria = {
      ...data,
      id: (auditorias.length + 1).toString(),
      fechaCreacion: new Date().toISOString(),
    }

    auditorias.push(newAuditoria)

    return HttpResponse.json(newAuditoria, { status: 201 })
  }),
]
