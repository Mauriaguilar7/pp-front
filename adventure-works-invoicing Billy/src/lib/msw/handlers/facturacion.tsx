import { http, HttpResponse } from "msw"
import { dtes } from "../fixtures/dte"
import { ventas } from "../fixtures/ventas"
import { clientes } from "../fixtures/clientes"
import { generateId } from "@/lib/utils"

export const facturacionHandlers = [
  // Get pending sales for invoicing
  http.get("/api/facturacion/ventas-pendientes", () => {
    const ventasPendientes = ventas
      .filter((venta) => venta.estado === "PENDIENTE")
      .map((venta) => ({
        ...venta,
        cliente: clientes.find((c) => c.id === venta.clienteId),
        vendedor: { id: venta.vendedorId, nombre: "María González" },
      }))

    return HttpResponse.json({ ventas: ventasPendientes })
  }),

  // Generate DTE for a sale
  http.post("/api/facturacion/:ventaId/dte", async ({ params }) => {
    const ventaId = params.ventaId as string
    const venta = ventas.find((v) => v.id === ventaId)

    if (!venta) {
      return HttpResponse.json({ error: "Venta no encontrada" }, { status: 404 })
    }

    if (venta.estado !== "PENDIENTE") {
      return HttpResponse.json({ error: "La venta ya fue procesada" }, { status: 400 })
    }

    const cliente = clientes.find((c) => c.id === venta.clienteId)
    if (!cliente) {
      return HttpResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1

    const newDTE = {
      id: generateId(),
      ventaId,
      estadoDGII: isSuccess ? ("ACEPTADO" as const) : ("RECHAZADO" as const),
      xml: generateDTEXML(venta, cliente),
      pdfUrl: `/api/dte/${generateId()}/pdf`,
      mensajes: isSuccess
        ? ["Documento aceptado por DGII", "Procesamiento exitoso"]
        : ["Error en validación de datos", "Revisar información del cliente"],
      fechaCreacion: new Date(),
      fechaRespuesta: new Date(),
    }

    dtes.push(newDTE)

    // Update sale status
    const ventaIndex = ventas.findIndex((v) => v.id === ventaId)
    if (ventaIndex !== -1) {
      ventas[ventaIndex].estado = isSuccess ? "FACTURADA" : "PENDIENTE"
    }

    return HttpResponse.json({ dte: newDTE })
  }),

  // Get DTE by sale ID
  http.get("/api/facturacion/:ventaId/dte", ({ params }) => {
    const ventaId = params.ventaId as string
    const dte = dtes.find((d) => d.ventaId === ventaId)

    if (!dte) {
      return HttpResponse.json({ error: "DTE no encontrado" }, { status: 404 })
    }

    return HttpResponse.json({ dte })
  }),

  // Get all DTEs
  http.get("/api/facturacion/dtes", ({ request }) => {
    const url = new URL(request.url)
    const estado = url.searchParams.get("estado")

    let filteredDTEs = [...dtes]

    if (estado) {
      filteredDTEs = filteredDTEs.filter((dte) => dte.estadoDGII === estado)
    }

    // Add sale and client info
    const dtesWithDetails = filteredDTEs.map((dte) => {
      const venta = ventas.find((v) => v.id === dte.ventaId)
      const cliente = venta ? clientes.find((c) => c.id === venta.clienteId) : null

      return {
        ...dte,
        venta,
        cliente,
      }
    })

    return HttpResponse.json({ dtes: dtesWithDetails })
  }),

  // Download DTE XML
  http.get("/api/dte/:id/xml", ({ params }) => {
    const dte = dtes.find((d) => d.id === params.id)
    if (!dte) {
      return HttpResponse.json({ error: "DTE no encontrado" }, { status: 404 })
    }

    return new HttpResponse(dte.xml, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="DTE-${dte.id}.xml"`,
      },
    })
  }),

  // Download DTE PDF (simulated)
  http.get("/api/dte/:id/pdf", ({ params }) => {
    const dte = dtes.find((d) => d.id === params.id)
    if (!dte) {
      return HttpResponse.json({ error: "DTE no encontrado" }, { status: 404 })
    }

    // Return a simple PDF placeholder
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Adventure Works - Factura Electrónica) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`

    return new HttpResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Factura-${dte.id}.pdf"`,
      },
    })
  }),
]

function generateDTEXML(venta: any, cliente: any): string {
  const now = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
  <dte:SAT ClaseDocumento="dte">
    <dte:DTE ID="DatosCertificados">
      <dte:DatosEmision ID="DatosEmision">
        <dte:DatosGenerales CodigoMoneda="USD" FechaHoraEmision="${now}" Tipo="FACT"/>
        <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="1" CorreoEmisor="facturacion@adventureworks.com" NITEmisor="0614-123456-001-2" NombreComercial="Adventure Works" NombreEmisor="Adventure Works S.A. de C.V."/>
        <dte:Receptor CorreoReceptor="${cliente.email || ""}" IDReceptor="${cliente.nit || ""}" NombreReceptor="${cliente.nombre}"/>
        <dte:Items>
          ${venta.items
            .map(
              (item: any, index: number) => `
          <dte:Item BienOServicio="B" NumeroLinea="${index + 1}">
            <dte:Cantidad>${item.cantidad}</dte:Cantidad>
            <dte:UnidadMedida>UNI</dte:UnidadMedida>
            <dte:Descripcion>${item.nombre}</dte:Descripcion>
            <dte:PrecioUnitario>${item.precio}</dte:PrecioUnitario>
            <dte:Precio>${item.subtotal}</dte:Precio>
            <dte:Descuento>0</dte:Descuento>
            <dte:Impuestos>
              <dte:Impuesto>
                <dte:NombreCorto>IVA</dte:NombreCorto>
                <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                <dte:MontoGravable>${item.subtotal}</dte:MontoGravable>
                <dte:MontoImpuesto>${(item.subtotal * item.iva).toFixed(2)}</dte:MontoImpuesto>
              </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>${(item.subtotal * (1 + item.iva)).toFixed(2)}</dte:Total>
          </dte:Item>`,
            )
            .join("")}
        </dte:Items>
        <dte:Totales>
          <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="${venta.totalIva.toFixed(2)}"/>
          </dte:TotalImpuestos>
          <dte:GranTotal>${venta.total.toFixed(2)}</dte:GranTotal>
        </dte:Totales>
      </dte:DatosEmision>
    </dte:DTE>
  </dte:SAT>
</dte:GTDocumento>`
}
