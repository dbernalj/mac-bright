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
| colegio | Colegio / Universidad | 🎒 |
| fiesta | Fiesta / Noche | 🎉 |
| adolescente | Adolescente | 🌱 |
| evento | Evento especial | 👑 |

## Contenido: etiquetas por look

Para `labios-3`, `pestanas-3`, `mejillas-2` y `cejas-3` esta asignación ya fue **revisada y ajustada por el equipo** (junto con la curaduría de videos de `03-galeria.md`). El resto sigue siendo la asignación sugerida original, pendiente de esa misma revisión.

| id | Nombre del look | Ocasión(es) |
|---|---|---|
| ojos-1 | Look elegante con sombras | Colegio, Fiesta/Noche |
| ojos-2 | Ojos encapotados | Evento especial, Colegio |
| ojos-3 | Look natural del día | Colegio, Adolescente |
| labios-1 | Labios perfectos clásico | Colegio, Fiesta/Noche |
| labios-2 | Lip combo con gloss | Adolescente, Fiesta/Noche |
| labios-3 | Según la forma de tus labios | Adolescente, Evento especial |
| pestanas-1 | Rímel básico | Colegio, Adolescente |
| pestanas-2 | Pestañas naturales largas | Colegio, Evento especial |
| pestanas-3 | Pestañas individuales | Fiesta/Noche, Evento especial |
| mejillas-1 | Rubor básico | Colegio, Adolescente |
| mejillas-2 | Rubor según tu tipo de cara | Adolescente |
| mejillas-3 | Técnicas y estilos de blush | Fiesta/Noche, Adolescente |
| cejas-1 | Look natural del día | Colegio, Adolescente |
| cejas-2 | Delinear y rellenar | Fiesta/Noche, Evento especial |
| cejas-3 | Técnica con lápiz | Adolescente, Colegio |

## Estilo
- Chips tipo "pill", fondo blanco, ícono + texto, fila horizontal con scroll si no caben en pantalla.
