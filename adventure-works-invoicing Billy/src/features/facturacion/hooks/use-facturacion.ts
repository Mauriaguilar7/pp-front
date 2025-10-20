import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { DTE, Venta } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface VentasPendientesResponse {
  ventas: (Venta & { cliente?: any; vendedor?: any })[]
}

interface DTEResponse {
  dte: DTE
}

interface DTEsResponse {
  dtes: (DTE & { venta?: Venta; cliente?: any })[]
}

export function useVentasPendientes() {
  return useQuery({
    queryKey: ["facturacion", "ventas-pendientes"],
    queryFn: async (): Promise<VentasPendientesResponse> => {
      return apiClient.get("/facturacion/ventas-pendientes")
    },
  })
}

export function useDTEs(estado?: string) {
  return useQuery({
    queryKey: ["facturacion", "dtes", estado],
    queryFn: async (): Promise<DTEsResponse> => {
      const params = new URLSearchParams()
      if (estado) params.append("estado", estado)
      return apiClient.get(`/facturacion/dtes?${params.toString()}`)
    },
  })
}

export function useDTE(ventaId: string) {
  return useQuery({
    queryKey: ["facturacion", "dte", ventaId],
    queryFn: async (): Promise<DTEResponse> => {
      return apiClient.get(`/facturacion/${ventaId}/dte`)
    },
    enabled: !!ventaId,
    retry: false,
  })
}

export function useGenerateDTE() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ventaId: string): Promise<DTEResponse> => {
      return apiClient.post(`/facturacion/${ventaId}/dte`)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["facturacion"] })
      queryClient.invalidateQueries({ queryKey: ["ventas"] })

      if (data.dte.estadoDGII === "ACEPTADO") {
        toast({
          title: "DTE Generado",
          description: "El documento tributario electrónico ha sido aceptado por DGII",
        })
      } else {
        toast({
          title: "DTE Rechazado",
          description: "El documento fue rechazado. Revise los mensajes de error.",
          variant: "destructive",
        })
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDownloadDTE() {
  return {
    downloadXML: async (dteId: string) => {
      try {
        const response = await fetch(`/api/dte/${dteId}/xml`)
        if (!response.ok) throw new Error("Error al descargar XML")

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `DTE-${dteId}.xml`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Descarga completada",
          description: "El archivo XML ha sido descargado",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo descargar el archivo XML",
          variant: "destructive",
        })
      }
    },

    downloadPDF: async (dteId: string) => {
      try {
        const response = await fetch(`/api/dte/${dteId}/pdf`)
        if (!response.ok) throw new Error("Error al descargar PDF")

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Factura-${dteId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Descarga completada",
          description: "El archivo PDF ha sido descargado",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo descargar el archivo PDF",
          variant: "destructive",
        })
      }
    },
  }
}
