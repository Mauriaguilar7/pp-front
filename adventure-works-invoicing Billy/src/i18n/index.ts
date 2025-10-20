import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  "es-SV": {
    translation: {
      // Navigation
      dashboard: "Panel de Control",
      ventas: "Ventas",
      facturacion: "Facturación",
      productos: "Productos",
      clientes: "Clientes",
      usuarios: "Usuarios",
      seguridad: "Seguridad",
      reportes: "Reportes",

      // Common
      crear: "Crear",
      editar: "Editar",
      eliminar: "Eliminar",
      guardar: "Guardar",
      cancelar: "Cancelar",
      buscar: "Buscar",
      filtrar: "Filtrar",
      exportar: "Exportar",
      imprimir: "Imprimir",

      // Auth
      iniciarSesion: "Iniciar Sesión",
      cerrarSesion: "Cerrar Sesión",
      email: "Email",
      password: "Contraseña",
      recordarme: "Recordarme",

      // Sales
      nuevaVenta: "Nueva Venta",
      cliente: "Cliente",
      producto: "Producto",
      cantidad: "Cantidad",
      precio: "Precio",
      subtotal: "Subtotal",
      total: "Total",

      // Status
      pendiente: "Pendiente",
      facturada: "Facturada",
      anulada: "Anulada",
      activo: "Activo",
      inactivo: "Inactivo",
    },
  },
  "en-US": {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      ventas: "Sales",
      facturacion: "Invoicing",
      productos: "Products",
      clientes: "Clients",
      usuarios: "Users",
      seguridad: "Security",
      reportes: "Reports",

      // Common
      crear: "Create",
      editar: "Edit",
      eliminar: "Delete",
      guardar: "Save",
      cancelar: "Cancel",
      buscar: "Search",
      filtrar: "Filter",
      exportar: "Export",
      imprimir: "Print",

      // Auth
      iniciarSesion: "Sign In",
      cerrarSesion: "Sign Out",
      email: "Email",
      password: "Password",
      recordarme: "Remember Me",

      // Sales
      nuevaVenta: "New Sale",
      cliente: "Client",
      producto: "Product",
      cantidad: "Quantity",
      precio: "Price",
      subtotal: "Subtotal",
      total: "Total",

      // Status
      pendiente: "Pending",
      facturada: "Invoiced",
      anulada: "Cancelled",
      activo: "Active",
      inactivo: "Inactive",
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "es-SV",
  fallbackLng: "es-SV",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
