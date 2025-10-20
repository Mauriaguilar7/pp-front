import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/features/auth/providers/AuthProvider"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { VentasPage } from "@/features/ventas/pages/VentasPage"
import { NuevaVentaPage } from "@/features/ventas/pages/NuevaVentaPage"
import { FacturacionPage } from "@/features/facturacion/pages/FacturacionPage"
import { ProductosPage } from "@/features/productos/pages/ProductosPage"
import { ClientesPage } from "@/features/clientes/pages/ClientesPage"
import { UsuariosPage } from "@/features/usuarios/pages/UsuariosPage"
import { AuditoriaPage } from "@/features/auditoria/pages/AuditoriaPage"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/ventas"
                    element={
                      <ProtectedRoute requiredRole="CASHIER">
                        <VentasPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ventas/nueva"
                    element={
                      <ProtectedRoute requiredRole="CASHIER">
                        <NuevaVentaPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/facturacion"
                    element={
                      <ProtectedRoute requiredRole="CASHIER">
                        <FacturacionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/productos"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <ProductosPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/clientes"
                    element={
                      <ProtectedRoute requiredRole="CASHIER">
                        <ClientesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/usuarios"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <UsuariosPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/auditoria"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AuditoriaPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
