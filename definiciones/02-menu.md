# Pantalla 2 — Menú principal

## Objetivo
El usuario elige qué categoría de maquillaje quiere explorar.

## Elementos
- Pregunta en letra grande: **¿Cómo quieres maquillarte hoy?**
- Buscador (campo de texto con ícono de lupa).
- Lista de categorías, cada una con ícono grande y nombre:

| Categoría | Ícono |
|---|---|
| Ojos | 👁️ |
| Labios | 💋 |
| Pestañas | 👀 (pestañas largas) |
| Mejillas | 😊 |
| Cejas | 🖊️ |

- Debajo, un segundo subtítulo **Por ocasión** con una fila de chips (ver `06-ocasiones.md` para la tabla completa de etiquetas).
- Botón **← Cerrar sesión** arriba de todo, visible siempre (con o sin cuenta iniciada).

## Comportamiento
- Escribir en el buscador filtra en vivo tanto la lista de categorías como la de ocasiones, por nombre (ej. escribir "oj" deja visible solo "Ojos"; escribir "fiesta" deja visible solo el chip "Fiesta / Noche" y oculta todas las categorías).
- Tocar una categoría abre la pantalla de Galería mostrando los looks de esa categoría.
- Tocar un chip de ocasión abre la misma pantalla de Galería, pero mostrando los looks de **cualquier** categoría que tengan esa etiqueta (navegación cruzada, ver `06-ocasiones.md`).
- Tocar **← Cerrar sesión** cierra la sesión actual (si había una), borra los campos de Email/Contraseña del Login, y regresa a Inicio de sesión — sirve tanto para salir de una cuenta real como para volver a probar el flujo desde cero como invitado.

## Estilo
- Fondo pastel, letras e íconos grandes y fáciles de entender.
- Estilo femenino, tarjetas redondeadas para cada categoría.
