# 06 — Navegación por ocasión

No es una pantalla nueva en sí: agrega una fila de chips en el Menú principal (`02-menu.md`) y reutiliza la pantalla de Galería (`03-galeria.md`) para mostrar el resultado — igual que `03-galeria.md` y `04-detalle.md` ya se conectan entre sí por `id`, esta pantalla se conecta con ambas.

## Objetivo
Dejar explorar el contenido no solo por zona de maquillaje (Ojos, Labios...) sino también por el momento/ocasión para el que se está maquillando — confirmado que hay abundante contenido de tutoriales en YouTube en español para las 4 etiquetas elegidas.

## Elementos
- 4 chips de ocasión en el Menú principal, cada uno con ícono + nombre, en una fila con scroll horizontal.

## Comportamiento
- Tocar un chip abre la Galería mostrando todos los looks de **cualquier** categoría que tengan esa etiqueta (navegación cruzada) — a diferencia de tocar una categoría, que solo muestra los looks de esa categoría.
- Un look puede tener una o dos etiquetas de ocasión.
- El estado gratis/bloqueado de cada look es el mismo sin importar el camino de entrada (categoría u ocasión).
- El botón atrás de la Galería vuelve al Menú principal en ambos casos.

## Contenido: etiquetas

| id | Nombre | Ícono |
|---|---|---|
| oficina | Oficina | 💼 |
| fiesta | Fiesta / Noche | 🎉 |
| adolescente | Adolescente | 🌱 |
| madura | Mujer adulta | 🌸 |

## Contenido: etiquetas por look

Asignación **sugerida** por juicio razonable a partir del nombre/materiales de cada look — pendiente de ajuste del equipo, igual que los `videoId` candidatos de `03-galeria.md`.

| id | Nombre del look | Ocasión(es) |
|---|---|---|
| ojos-1 | Look elegante con sombras | Oficina, Fiesta/Noche |
| ojos-2 | Ojos encapotados | Mujer adulta, Oficina |
| ojos-3 | Look natural del día | Oficina, Adolescente |
| labios-1 | Labios perfectos clásico | Oficina, Fiesta/Noche |
| labios-2 | Lip combo con gloss | Adolescente, Fiesta/Noche |
| labios-3 | Según la forma de tus labios | Adolescente, Oficina |
| pestanas-1 | Rímel básico | Oficina, Adolescente |
| pestanas-2 | Pestañas naturales largas | Oficina, Mujer adulta |
| pestanas-3 | Pestañas individuales | Fiesta/Noche |
| mejillas-1 | Rubor básico | Oficina, Adolescente |
| mejillas-2 | Según tu tipo de cara | Mujer adulta |
| mejillas-3 | Técnicas y estilos de blush | Fiesta/Noche, Adolescente |
| cejas-1 | Look natural del día | Oficina, Adolescente |
| cejas-2 | Delinear y rellenar | Fiesta/Noche, Mujer adulta |
| cejas-3 | Técnica con lápiz | Adolescente |

## Estilo
- Chips tipo "pill", fondo blanco, ícono + texto, fila horizontal con scroll si no caben en pantalla.
