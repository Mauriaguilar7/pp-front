import { http, HttpResponse } from "msw"
import { ProductoSchema } from "@/lib/validations"
import { productos } from "../fixtures/productos"
import { ventas } from "../fixtures/ventas"
import { generateId } from "@/lib/utils"

export const productosHandlers = [
  // Get all products
  http.get("/api/productos", ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get("search")
    const categoria = url.searchParams.get("categoria")
    const estado = url.searchParams.get("estado")

    let filteredProductos = [...productos]

    if (search) {
      filteredProductos = filteredProductos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
          producto.sku.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (categoria) {
      filteredProductos = filteredProductos.filter((producto) => producto.categoria === categoria)
    }

    if (estado) {
      filteredProductos = filteredProductos.filter((producto) => producto.estado === estado)
    }

    return HttpResponse.json({ productos: filteredProductos })
  }),

  // Get single product
  http.get("/api/productos/:id", ({ params }) => {
    const producto = productos.find((p) => p.id === params.id)
    if (!producto) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return HttpResponse.json({ producto })
  }),

  // Create product
  http.post("/api/productos", async ({ request }) => {
    const body = await request.json()
    const result = ProductoSchema.omit({ id: true, fechaCreacion: true }).safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    // Check for duplicate SKU
    const existingSKU = productos.find((p) => p.sku === result.data.sku)
    if (existingSKU) {
      return HttpResponse.json({ error: "El SKU ya existe" }, { status: 409 })
    }

    const newProducto = {
      ...result.data,
      id: generateId(),
      fechaCreacion: new Date(),
    }

    productos.push(newProducto)

    return HttpResponse.json({ producto: newProducto }, { status: 201 })
  }),

  // Update product
  http.put("/api/productos/:id", async ({ params, request }) => {
    const productoIndex = productos.findIndex((p) => p.id === params.id)
    if (productoIndex === -1) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const body = await request.json()
    const result = ProductoSchema.partial().omit({ id: true, fechaCreacion: true }).safeParse(body)

    if (!result.success) {
      return HttpResponse.json({ error: "Datos inválidos", details: result.error.errors }, { status: 400 })
    }

    // Check for duplicate SKU (excluding current product)
    if (result.data.sku) {
      const existingSKU = productos.find((p) => p.sku === result.data.sku && p.id !== params.id)
      if (existingSKU) {
        return HttpResponse.json({ error: "El SKU ya existe" }, { status: 409 })
      }
    }

    productos[productoIndex] = { ...productos[productoIndex], ...result.data }

    return HttpResponse.json({ producto: productos[productoIndex] })
  }),

  // Delete product
  http.delete("/api/productos/:id", ({ params }) => {
    const productoIndex = productos.findIndex((p) => p.id === params.id)
    if (productoIndex === -1) {
      return HttpResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Check if product is referenced in any sale
    const isReferenced = ventas.some((venta) => venta.items.some((item) => item.productoId === params.id))

    if (isReferenced) {
      return HttpResponse.json(
        {
          error: "No se puede eliminar el producto",
          reason: "El producto está referenciado en ventas existentes",
        },
        { status: 409 },
      )
    }

    productos.splice(productoIndex, 1)

    return HttpResponse.json({ message: "Producto eliminado exitosamente" })
  }),

  // Get product categories
  http.get("/api/productos/categorias", () => {
    const categorias = [...new Set(productos.map((p) => p.categoria))].sort()
    return HttpResponse.json({ categorias })
  }),
]
