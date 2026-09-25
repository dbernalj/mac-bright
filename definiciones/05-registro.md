# Pantalla 5 — Registro y suscripción

## Objetivo
Crear una cuenta nueva, elegir el plan y el método de pago, todo en un solo formulario. Al confirmar, la cuenta queda creada de verdad (compartida entre dispositivos) y con la suscripción activa.

## Elementos
- Botón atrás (regresa a Inicio de sesión).
- Título: **Crea tu cuenta**
- Mensaje contextual (solo visible si se llegó por tocar un look bloqueado): *"Este look es exclusivo para suscriptores. Regístrate para verlo."*
- Campo de texto: **Nombre**
- Campo de texto: **Email**
- Campo de texto (oculto): **Contraseña**
- Mensaje de error (oculto salvo que falle el registro)
- Subtítulo **Elige tu plan** + una tarjeta con el plan disponible.
- Subtítulo **Método de pago** + chips con las opciones disponibles.
- Bloque con las **llaves de pago** reales (banco + número) a las que transferir, y el nombre del titular.
- Botón: **Ya pagué / Confirmar pago**

## Comportamiento
- Se llega desde (a) el botón **Registrarse** en Inicio de sesión, o (b) tocar un look bloqueado en la Galería (en ese caso se muestra el mensaje contextual).
- El plan y el método de pago (Llaves Bre-B, la única opción) vienen preseleccionados por defecto para que la pantalla se vea lista sin exigir clics extra.
- El usuario transfiere por fuera de la app a cualquiera de las dos llaves (Bancolombia o Falabella) y luego confirma que ya pagó; la app no verifica el pago automáticamente.
- Tocar **Ya pagué / Confirmar pago** llama a una cuenta real en el servidor (`POST /api/register`): valida los datos, verifica que el email no esté ya registrado, y crea la cuenta con contraseña protegida (nunca se guarda en texto plano). Mientras espera la respuesta, el botón muestra "Creando cuenta...".
  - Si el email ya existe, muestra el error correspondiente sin navegar ("Ese email ya está registrado.").
  - Si tiene éxito, la sesión queda guardada en el dispositivo (persiste aunque se recargue la página) y la app navega al Menú principal — **pero la cuenta queda "pendiente de aprobación"**, no premium todavía. Como nadie verifica automáticamente que la transferencia llegó, un administrador tiene que revisar el pago (contra el extracto de Bancolombia/Falabella) y activar la cuenta manualmente desde un panel aparte (ver `admin.md`) antes de que desbloquee los looks pagos. Mientras tanto el usuario ve el Menú en modo freemium normal, con un aviso de "pago pendiente de aprobación".
- El botón atrás siempre regresa a Inicio de sesión.
- A diferencia del resto del prototipo, **la cuenta creada aquí es real**: se guarda en una base de datos compartida entre dispositivos, no solo en este navegador. El pago sigue siendo por fuera de la app — por eso la aprobación es manual.

## Contenido: método de pago

| id | Nombre |
|---|---|
| bre-b | Llaves Bre-B |

## Contenido: llaves de pago

| Banco | Llave | Titular |
|---|---|---|
| Bancolombia | 35198893 | Sandra Correa |
| Falabella | 3103358934 | Sandra Correa |

## Contenido: plan

| id | Nombre | Precio |
|---|---|---|
| mensual | Plan Mensual | $9.900 COP / mes |

## Contenido: métodos de pago

| id | Nombre |
|---|---|
| nequi | Nequi |
| bre-b | Bre-B |
| transferencia | Transferencia bancaria |
| efectivo | Efectivo |

## Estilo
- Mismo fondo pastel y tipografía que el resto de la app.
- La tarjeta de plan y los chips de método de pago reusan el lenguaje visual de las tarjetas de categoría/look, con un estado "seleccionado" marcado con borde rosa.
- Bloque de llaves de pago centrado, con cada llave en su propia fila (banco a la izquierda, número destacado a la derecha) y el nombre del titular debajo.
