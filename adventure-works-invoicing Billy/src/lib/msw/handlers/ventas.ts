import { http, HttpResponse } from "msw"
import { VentaSchema } from "@/lib/validations"
import { ventas } from "../fixtures/ventas"
import { clientes } from "../fixtures/clientes"
import { productos } from "../fixtures/productos"
import { generateId } from "@/lib/utils"

export const ventasHandlers = [
  // Get all sales
  http.get("/api/ventas", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const estado = url.searchParams.get("estado")
    const clienteId = url.searchParams.get("clienteId")

    let filteredVentas = [...ventas]

    if (search) {
      filteredVentas = filteredVentas.filter(
        (venta) =>
          venta.numero.toLowerCase().includes(search.toLowerCase()) ||
          clientes
            .find((c) => c.id === venta.clienteId)
            ?.nombre.toLowerCase()
            .includes(search.toLowerCase()),
      )
    }

    if (estado) {
      filteredVentas = filteredVentas.filter((venta) => venta.estado === estado)
    }

    if (clienteId) {
      filteredVentas = filteredVentas.filter((venta) => venta.clienteId === clienteId)
    }

    // Add client and vendor info
    const ventasWithDetails = filteredVentas.map((venta) => ({
      ...venta,
      cliente: clientes.find((c) => c.id === venta.clienteId),
      vendedor: { id: venta.vendedorId, nombre: "María González" }, // Mock vendor
    }))

    return HttpResponse.json({ ventas: ventasWithDetails })
  }),

  // Get single sale
  http.get("/api/ventas/:id", ({ params }) => {
    const venta = ventas.find((v) => v.id === params.id)
    if (!venta) {
      return HttpResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const ventaWithDetails = {
      ...venta,
      cliente: clientes.find((c) => c.id === venta.clienteId),
      vendedor: { id: venta.vendedorId, nombre: "María González" },
    }

    return HttpResponse.json({ venta: ventaWithDetails })
  }),

  // Create new sale
  http.post("/api/ventas", async ({ request }) => {
    const body = await request.json()
    const result = VentaSchema.omit({ id: true, numero: true, fechaCreacion: true }).safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    const newVenta = {
      ...result.data,
      id: generateId(),
      numero: `V-${String(ventas.length + 1).padStart(6, "0")}`,
      fechaCreacion: new Date(),
    }

    ventas.push(newVenta)

    return HttpResponse.json({ venta: newVenta }, { status: 201 })
  }),

  // Update sale
  http.put("/api/ventas/:id", async ({ params, request }) => {
    const ventaIndex = ventas.findIndex((v) => v.id === params.id)
    if (ventaIndex === -1) {
      return HttpResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    const body = await request.json()
    const result = VentaSchema.partial().safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    ventas[ventaIndex] = { ...ventas[ventaIndex], ...result.data }

    return HttpResponse.json({ venta: ventas[ventaIndex] })
  }),

  // Get products for sale
  http.get("/api/productos", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")

    let filteredProductos = productos.filter((p) => p.estado === "ACTIVO")

    if (search) {
      filteredProductos = filteredProductos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
          producto.sku.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return HttpResponse.json({ productos: filteredProductos })
  }),

  // Get clients for sale
  http.get("/api/clientes", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")

    let filteredClientes = clientes.filter((c) => c.estado === "ACTIVO")

    if (search) {
      filteredClientes = filteredClientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
          cliente.nit?.toLowerCase().includes(search.toLowerCase()) ||
          cliente.email?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return HttpResponse.json({ clientes: filteredClientes })
  }),
]
