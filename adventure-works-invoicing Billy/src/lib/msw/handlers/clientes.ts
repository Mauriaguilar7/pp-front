import { http, HttpResponse } from "msw"
import { ClienteSchema } from "@/lib/validations"
import { clientes } from "../fixtures/clientes"
import { ventas } from "../fixtures/ventas"
import { generateId } from "@/lib/utils"

export const clientesHandlers = [
  // Get all clients
  http.get("/api/clientes", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const perfilFiscal = url.searchParams.get("perfilFiscal")
    const estado = url.searchParams.get("estado")

    let filteredClientes = [...clientes]

    if (search) {
      filteredClientes = filteredClientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
          cliente.nit?.toLowerCase().includes(search.toLowerCase()) ||
          cliente.email?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (perfilFiscal) {
      filteredClientes = filteredClientes.filter((cliente) => cliente.perfilFiscal === perfilFiscal)
    }

    if (estado) {
      filteredClientes = filteredClientes.filter((cliente) => cliente.estado === estado)
    }

    return HttpResponse.json({ clientes: filteredClientes })
  }),

  // Get single client
  http.get("/api/clientes/:id", ({ params }) => {
    const cliente = clientes.find((c) => c.id === params.id)
    if (!cliente) {
      return HttpResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    return HttpResponse.json({ cliente })
  }),

  // Create client
  http.post("/api/clientes", async ({ request }) => {
    const body = await request.json()
    const result = ClienteSchema.omit({ id: true, fechaCreacion: true }).safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    // Check for duplicate NIT
    if (result.data.nit) {
      const existingNIT = clientes.find((c) => c.nit === result.data.nit)
      if (existingNIT) {
        return HttpResponse.json({ error: "El NIT ya existe" }, { status: 409 })
      }
    }

    // Check for duplicate NRC
    if (result.data.nrc) {
      const existingNRC = clientes.find((c) => c.nrc === result.data.nrc)
      if (existingNRC) {
        return HttpResponse.json({ error: "El NRC ya existe" }, { status: 409 })
      }
    }

    const newCliente = {
      ...result.data,
      id: generateId(),
      fechaCreacion: new Date(),
    }

    clientes.push(newCliente)

    return HttpResponse.json({ cliente: newCliente }, { status: 201 })
  }),

  // Update client
  http.put("/api/clientes/:id", async ({ params, request }) => {
    const clienteIndex = clientes.findIndex((c) => c.id === params.id)
    if (clienteIndex === -1) {
      return HttpResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const result = ClienteSchema.partial().omit({ id: true, fechaCreacion: true }).safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    // Check if client has invoiced sales (restrict critical field changes)
    const hasInvoicedSales = ventas.some((venta) => venta.clienteId === params.id && venta.estado === "FACTURADA")

    if (hasInvoicedSales) {
      // Only allow non-critical field updates
      const allowedFields = ["telefono", "email", "direccion"]
      const updatedFields = Object.keys(result.data)
      const restrictedFields = updatedFields.filter((field) => !allowedFields.includes(field))

      if (restrictedFields.length > 0) {
        return HttpResponse.json(
          {
            error: "No se pueden modificar campos críticos",
            reason: "El cliente tiene facturas emitidas. Solo se pueden modificar: teléfono, email, dirección",
            restrictedFields,
          },
          { status: 409 },
        )
      }
    }

    // Check for duplicate NIT (excluding current client)
    if (result.data.nit) {
      const existingNIT = clientes.find((c) => c.nit === result.data.nit && c.id !== params.id)
      if (existingNIT) {
        return HttpResponse.json({ error: "El NIT ya existe" }, { status: 409 })
      }
    }

    // Check for duplicate NRC (excluding current client)
    if (result.data.nrc) {
      const existingNRC = clientes.find((c) => c.nrc === result.data.nrc && c.id !== params.id)
      if (existingNRC) {
        return HttpResponse.json({ error: "El NRC ya existe" }, { status: 409 })
      }
    }

    clientes[clienteIndex] = { ...clientes[clienteIndex], ...result.data }

    return HttpResponse.json({ cliente: clientes[clienteIndex] })
  }),

  // Delete client
  http.delete("/api/clientes/:id", ({ params }) => {
    const clienteIndex = clientes.findIndex((c) => c.id === params.id)
    if (clienteIndex === -1) {
      return HttpResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Check if client is referenced in any sale
    const isReferenced = ventas.some((venta) => venta.clienteId === params.id)

    if (isReferenced) {
      return HttpResponse.json(
        {
          error: "No se puede eliminar el cliente",
          reason: "El cliente está referenciado en ventas existentes",
        },
        { status: 409 },
      )
    }

    clientes.splice(clienteIndex, 1)

    return HttpResponse.json({ message: "Cliente eliminado exitosamente" })
  }),
]
