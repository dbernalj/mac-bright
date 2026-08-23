# Pantalla 1 — Inicio de sesión

## Objetivo
Primera pantalla que ve el usuario al abrir la app. Da acceso al Menú principal.

## Elementos
- Logo / nombre de la app: **Mac Bright**
- Campo de texto: **Email**
- Campo de texto (oculto): **Contraseña**
- Mensaje de error (oculto salvo que falle un intento de inicio de sesión)
- Botón: **Iniciar sesión**
- Botón principal: **Registrarse**
- Botón/link secundario: **Continuar como invitado**

## Comportamiento
- **Iniciar sesión** usa los campos Email/Contraseña de esta misma pantalla y valida contra cuentas reales (ver `05-registro.md`). Si la cuenta no existe o la contraseña no coincide, muestra un único mensaje genérico ("Email o contraseña incorrectos") sin indicar cuál de los dos falló — no se revela si el email existe o no. Si es correcto, lleva al Menú principal con la suscripción activa.
- **Registrarse** lleva a la pantalla de Registro (`05-registro.md`) para crear una cuenta nueva con plan y método de pago.
- **Continuar como invitado** lleva directo al Menú principal sin cuenta — aplican los límites freemium (ver `03-galeria.md`).
- Si el dispositivo ya tiene una sesión guardada de una visita anterior, la app entra directo al Menú principal al abrirse, sin mostrar esta pantalla.
- Las cuentas y contraseñas ahora son reales (se guardan en una base de datos compartida entre dispositivos) — este ya no es un flujo decorativo, a diferencia del resto de datos de contenido del prototipo.

## Estilo
- Fondo pastel (rosa suave).
- Letras grandes.
- Campos de texto redondeados y grandes, fáciles de tocar.
