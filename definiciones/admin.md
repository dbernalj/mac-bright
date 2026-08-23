# Administración de usuarios (herramienta interna)

No es una pantalla de la app (no vive en `index.html` ni es alcanzable navegando la app) — es una página aparte, `admin.html`, solo para administradores. Ningún botón ni link de la app apunta a ella.

## Objetivo
Como el pago por QR (Nequi/Bre-B/transferencia/efectivo) es simulado y nadie lo verifica automáticamente, cada cuenta nueva queda **pendiente de aprobación** hasta que un administrador confirme por fuera de la app que sí llegó el pago, y la active manualmente aquí. Así se evita que cualquiera cree una cuenta y tenga acceso pago sin haber pagado de verdad.

## Acceso
- Contraseña de administrador única y compartida (variable de entorno `ADMIN_PASSWORD` en Vercel, nunca en el código ni en el repo).
- La contraseña se guarda en `sessionStorage` del navegador tras entrar correctamente (se pierde al cerrar la pestaña/navegador) y se envía en cada llamada a la API en el header `X-Admin-Password`.
- La página `admin.html` en sí es técnicamente accesible por cualquiera que conozca la URL (el hosting es estático, no hay forma de ocultar el archivo), pero no muestra ningún dato de usuarios sin la contraseña correcta — el backend rechaza cualquier llamada sin ella.

## Elementos
- Formulario de acceso: campo de contraseña + botón **Entrar**.
- Tabla de usuarios: Nombre, Email, Plan, Método de pago, Fecha de creación, Estado (**Activo** / **Pendiente**), y una columna de Acciones por fila.
- Botones de acción por usuario: **Activar** / **Desactivar** (según el estado actual), **Resetear contraseña**, **Eliminar**.
- Botones **↻ Recargar** y **Salir** arriba de la tabla.

## Comportamiento
- Al activar una cuenta, ese usuario queda con suscripción activa **la próxima vez que inicie sesión** (no hay notificación en tiempo real al dispositivo del usuario — es un prototipo).
- Desactivar revierte lo anterior: la próxima vez que ese usuario inicie sesión, vuelve a modo freemium con el aviso de pendiente.
- Resetear contraseña pide la nueva contraseña (mínimo 6 caracteres) y la actualiza — útil si un usuario perdió acceso a su cuenta.
- Eliminar borra la cuenta por completo de la base de datos, pidiendo confirmación antes.
- Si la contraseña de administrador es incorrecta o expira, cualquier acción devuelve error 401 y regresa al formulario de acceso.

## Estilo
- Página de escritorio simple (tabla), no usa el frame de celular del resto del prototipo — reutiliza la misma paleta de colores (rosa/blanco) pero con su propia hoja de estilos (`admin.css`), separada de `style.css`.
