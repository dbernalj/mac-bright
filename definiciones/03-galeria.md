# Pantalla 3 — Galería

## Objetivo
Mostrar varias imágenes (looks) de la categoría elegida en el Menú. Cada imagen representa un estilo distinto, inspirado en Pinterest.

## Elementos
- Título con el nombre de la categoría (o de la ocasión, si se llegó navegando por ocasión) elegida.
- Grid de tarjetas (2 columnas), una por look: miniatura de imagen + nombre corto del look. Las tarjetas bloqueadas muestran además un candado 🔒 sobre la miniatura, algo más apagada.
- Botón atrás: vuelve al Menú principal (funciona igual sin importar si se entró por categoría o por ocasión).

## Comportamiento
- Tocar una tarjeta **desbloqueada** abre la pantalla de Detalle de ese look específico.
- Tocar una tarjeta **bloqueada** (look pago que el usuario todavía no tiene) lleva a la pantalla de Registro (`05-registro.md`) con un mensaje corto explicando que ese look requiere cuenta y suscripción, en vez de abrir el Detalle.
- Un look está desbloqueado si es el gratis de su categoría (columna **Gratis** = Sí) o si el usuario tiene sesión iniciada (cuenta registrada = suscripción activa). El estado gratis/bloqueado de un look es el mismo sin importar si se llegó por categoría o por ocasión.
- La miniatura de cada tarjeta se genera automáticamente a partir del `videoId` de YouTube de ese look (`https://img.youtube.com/vi/<videoId>/hqdefault.jpg`), sin descargar ni copiar fotos de terceros.

## Contenido: looks por categoría

Cada categoría tiene 3 looks. El `id` de cada look es la clave que conecta esta pantalla con la de Detalle (`04-detalle.md`) y con las etiquetas de ocasión (`06-ocasiones.md`). Solo el primer look de cada categoría es gratis; el resto requiere cuenta+suscripción.

| id | Categoría | Nombre del look | videoId | Gratis |
|---|---|---|---|---|
| ojos-1 | Ojos | Look elegante con sombras | McEWLLVGlgw | Sí |
| ojos-2 | Ojos | Ojos encapotados | Rk47nBXWViI | No |
| ojos-3 | Ojos | Look natural del día | bWGhom5jUXs | No |
| labios-1 | Labios | Labios perfectos clásico | AFRi-TU1iHM | Sí |
| labios-2 | Labios | Lip combo con gloss | fe_xvldKIpk | No |
| labios-3 | Labios | Según la forma de tus labios | o0Z0oNEGQVI | No |
| pestanas-1 | Pestañas | Rímel básico | MAM3pGFlhKk | Sí |
| pestanas-2 | Pestañas | Pestañas naturales largas | UMzKuHkTOEM | No |
| pestanas-3 | Pestañas | Pestañas individuales | CYt9qj_megM | No |
| mejillas-1 | Mejillas | Rubor básico | 8Ex8OHGuTJM | Sí |
| mejillas-2 | Mejillas | Rubor según tu tipo de cara | BBQxrHq3y-I | No |
| mejillas-3 | Mejillas | Técnicas y estilos de blush | _lFMIC8RgrA | No |
| cejas-1 | Cejas | Look natural del día | W-jJH767E1w | Sí |
| cejas-2 | Cejas | Delinear y rellenar | QHmLQPBfVEE | No |
| cejas-3 | Cejas | Técnica con lápiz | 0_2TH633vO8 | No |

> El equipo revisó y curó estos videos pensando en el nicho de la app (mujeres de 13 a 20 años, Latinoamérica): `labios-3`, `pestanas-1`, `pestanas-3`, `mejillas-1`, `mejillas-2`, `cejas-1`, `cejas-2`, `cejas-3` y `ojos-3` quedaron confirmados tal cual (mismo `videoId` de antes). El resto (`ojos-1`, `ojos-2`, `labios-1`, `labios-2`, `pestanas-2`, `mejillas-3`) sigue siendo el candidato original, pendiente de esa misma revisión.

Videos suplentes que el equipo también aprobó pero que todavía no tienen casilla asignada (cada categoría ya tiene sus 3 looks completos): "Cómo maquillarse las cejas" de Mich (`ZyR5Boh9J3k`) y de Beautification By Marta (`eX2J2_2I9Kg`) para Cejas, y "Maquillaje de labios paso a paso" de SecretosdechicasVIP (`1YWWHuEtL4k`) para Labios — quedan como reemplazo de respaldo si alguno de los videos actuales deja de estar disponible.

## Estilo
- Fondo pastel, letras grandes en el título.
- Tarjetas redondeadas con sombra suave, nombre del look debajo de la miniatura.
