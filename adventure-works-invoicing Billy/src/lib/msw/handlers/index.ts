import { authHandlers } from "./auth"
import { userHandlers } from "./users"
import { ventasHandlers } from "./ventas"
import { facturacionHandlers } from "./facturacion"
import { productosHandlers } from "./productos"
import { clientesHandlers } from "./clientes"
import { usuariosHandlers } from "./usuarios"
import { auditoriaHandlers } from "./auditoria"

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...ventasHandlers,
  ...facturacionHandlers,
  ...productosHandlers,
  ...clientesHandlers,
  ...usuariosHandlers,
  ...auditoriaHandlers,
]
