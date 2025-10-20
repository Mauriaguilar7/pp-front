import type { DTE } from "@/lib/validations"

export const dtes: DTE[] = [
  {
    id: "1",
    ventaId: "2",
    estadoDGII: "ACEPTADO",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
  <dte:SAT ClaseDocumento="dte">
    <dte:DTE ID="DatosCertificados">
      <dte:DatosEmision ID="DatosEmision">
        <dte:DatosGenerales CodigoMoneda="USD" FechaHoraEmision="2024-01-15T14:15:00" Tipo="FACT"/>
        <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="1" CorreoEmisor="facturacion@adventureworks.com" NITEmisor="0614-123456-001-2" NombreComercial="Adventure Works" NombreEmisor="Adventure Works S.A. de C.V."/>
        <dte:Receptor CorreoReceptor="ventas@comercialxyz.com" IDReceptor="0614-234567-002-1" NombreReceptor="Comercial XYZ Ltda."/>
        <dte:Items>
          <dte:Item BienOServicio="B" NumeroLinea="1">
            <dte:Cantidad>1</dte:Cantidad>
            <dte:UnidadMedida>UNI</dte:UnidadMedida>
            <dte:Descripcion>Monitor Samsung 24 pulgadas</dte:Descripcion>
            <dte:PrecioUnitario>299.99</dte:PrecioUnitario>
            <dte:Precio>299.99</dte:Precio>
            <dte:Descuento>0</dte:Descuento>
            <dte:Impuestos>
              <dte:Impuesto>
                <dte:NombreCorto>IVA</dte:NombreCorto>
                <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                <dte:MontoGravable>299.99</dte:MontoGravable>
                <dte:MontoImpuesto>39.00</dte:MontoImpuesto>
              </dte:Impuesto>
            </dte:Impuestos>
            <dte:Total>338.99</dte:Total>
          </dte:Item>
        </dte:Items>
        <dte:Totales>
          <dte:TotalImpuestos>
            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="39.00"/>
          </dte:TotalImpuestos>
          <dte:GranTotal>338.99</dte:GranTotal>
        </dte:Totales>
      </dte:DatosEmision>
    </dte:DTE>
  </dte:SAT>
</dte:GTDocumento>`,
    pdfUrl: "/api/dte/1/pdf",
    mensajes: ["Documento aceptado por DGII"],
    fechaCreacion: new Date("2024-01-15T14:20:00"),
    fechaRespuesta: new Date("2024-01-15T14:22:00"),
  },
]
