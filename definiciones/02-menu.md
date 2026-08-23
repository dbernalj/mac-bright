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
| Mejillas | 🐿️ |
| Cejas | 🖊️ |

- Debajo, un segundo subtítulo **Por ocasión** con una fila de chips (ver `06-ocasiones.md` para la tabla completa de etiquetas).

## Comportamiento
- Escribir en el buscador filtra la lista de categorías en vivo, por nombre (ej. escribir "oj" deja visible solo "Ojos"). El buscador solo filtra categorías, no ocasiones.
- Tocar una categoría abre la pantalla de Galería mostrando los looks de esa categoría.
- Tocar un chip de ocasión abre la misma pantalla de Galería, pero mostrando los looks de **cualquier** categoría que tengan esa etiqueta (navegación cruzada, ver `06-ocasiones.md`).

## Estilo
- Fondo pastel, letras e íconos grandes y fáciles de entender.
- Estilo femenino, tarjetas redondeadas para cada categoría.
