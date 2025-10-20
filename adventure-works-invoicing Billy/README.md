# Adventure Works - Sistema de Facturación Electrónica

Sistema frontend de facturación electrónica desarrollado en React + TypeScript para Adventure Works.

## Características

- 🔐 **Autenticación y autorización** por roles (Admin, Cajero, Supervisor)
- 💰 **Gestión de ventas** completa con carrito y cálculo de impuestos
- 📄 **Facturación electrónica** con generación de DTE (XML/PDF)
- 📦 **Catálogos** de productos y clientes
- 📊 **Reportes** con exportación a Excel/PDF
- 🔒 **Seguridad** con auditoría y control de sesiones
- 🌐 **Internacionalización** (es-SV, en-US)
- 📱 **Responsive design** con TailwindCSS

## Stack Tecnológico

- **Frontend**: React 18, TypeScript, Vite
- **UI**: TailwindCSS, shadcn/ui, Lucide React
- **Estado**: Zustand con persistencia
- **Routing**: React Router v6 con rutas protegidas
- **Formularios**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Testing**: Vitest, Testing Library, MSW
- **i18n**: react-i18next

## Instalación

\`\`\`bash
# Instalar dependencias
pnpm install

# Preparar MSW
pnpm msw:prepare

# Iniciar desarrollo
pnpm dev
\`\`\`

## Scripts Disponibles

- `pnpm dev` - Servidor de desarrollo
- `pnpm build` - Build de producción
- `pnpm preview` - Preview del build
- `pnpm test` - Ejecutar tests
- `pnpm test:watch` - Tests en modo watch
- `pnpm lint` - Linter
- `pnpm format` - Formatear código
- `pnpm typecheck` - Verificar tipos

## Estructura del Proyecto

\`\`\`
src/
├── app/                    # Configuración de la app
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── common/            # Componentes comunes
│   └── layouts/           # Layouts de página
├── features/              # Módulos por funcionalidad
│   ├── auth/             # Autenticación
│   ├── dashboard/        # Panel principal
│   ├── ventas/           # Gestión de ventas
│   ├── facturacion/      # Facturación electrónica
│   ├── productos/        # Catálogo de productos
│   ├── clientes/         # Gestión de clientes
│   ├── usuarios/         # Administración de usuarios
│   └── reportes/         # Reportes y analytics
├── lib/                   # Utilidades y configuración
│   ├── msw/              # Mock Service Worker
│   ├── validations/      # Schemas Zod
│   └── utils.ts          # Utilidades generales
├── i18n/                 # Internacionalización
└── styles/               # Estilos globales
\`\`\`

## Roles y Permisos

- **ADMIN**: Acceso completo al sistema
- **CASHIER**: Ventas, facturación, clientes (limitado)
- **SUPERVISOR**: Reportes, supervisión, auditoría

## Usuarios de Prueba

- **Admin**: admin@adventureworks.com / password123
- **Cajero**: cajero@adventureworks.com / password123
- **Supervisor**: supervisor@adventureworks.com / password123

## Funcionalidades Principales

### Ventas (CDU1)
- Búsqueda y selección de clientes
- Carrito de compras con cálculo automático
- Gestión de descuentos e impuestos
- Vista previa de comprobante

### Facturación Electrónica (CDU2)
- Generación de DTE (XML/PDF)
- Integración simulada con DGII
- Trazabilidad de estados
- Descarga de documentos

### Catálogos (CDU3, CDU4)
- CRUD de productos con validaciones
- Gestión de clientes con datos fiscales
- Prevención de eliminación con referencias

### Seguridad (CDU5, CDU6, CDU7)
- Bloqueo por intentos fallidos
- Timeout de inactividad
- Auditoría de eventos
- Gestión de usuarios y roles

## Testing

El proyecto incluye tests unitarios y de integración:

\`\`\`bash
# Ejecutar todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch
\`\`\`

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es privado y pertenece a Adventure Works.
