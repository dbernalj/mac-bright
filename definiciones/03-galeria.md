# Pantalla 3 — Galería

## Objetivo
Mostrar varias imágenes (looks) de la categoría elegida en el Menú. Cada imagen representa un estilo distinto, inspirado en Pinterest.

## Elementos
- Título con el nombre de la categoría elegida.
- Grid de tarjetas (2 columnas), una por look: miniatura de imagen + nombre corto del look.
- Botón atrás (regresa al Menú principal).

## Comportamiento
- Tocar una tarjeta abre la pantalla de Detalle de ese look específico.
- La miniatura de cada tarjeta se genera automáticamente a partir del `videoId` de YouTube de ese look (`https://img.youtube.com/vi/<videoId>/hqdefault.jpg`), sin descargar ni copiar fotos de terceros.

## Contenido: looks por categoría

Cada categoría tiene 3 looks. El `id` de cada look es la clave que conecta esta pantalla con la de Detalle (`04-detalle.md`).

| id | Categoría | Nombre del look | videoId |
|---|---|---|---|
| ojos-1 | Ojos | Look elegante con sombras | McEWLLVGlgw |
| ojos-2 | Ojos | Ojos encapotados | Rk47nBXWViI |
| ojos-3 | Ojos | Look natural del día | bWGhom5jUXs |
| labios-1 | Labios | Labios perfectos clásico | AFRi-TU1iHM |
| labios-2 | Labios | Lip combo con gloss | fe_xvldKIpk |
| labios-3 | Labios | Según la forma de tus labios | o0Z0oNEGQVI |
| pestanas-1 | Pestañas | Rímel básico | MAM3pGFlhKk |
| pestanas-2 | Pestañas | Pestañas naturales largas | UMzKuHkTOEM |
| pestanas-3 | Pestañas | Pestañas individuales | CYt9qj_megM |
| mejillas-1 | Mejillas | Rubor básico | 8Ex8OHGuTJM |
| mejillas-2 | Mejillas | Según tu tipo de cara | BBQxrHq3y-I |
| mejillas-3 | Mejillas | Técnicas y estilos de blush | _lFMIC8RgrA |
| cejas-1 | Cejas | Look natural del día | W-jJH767E1w |
| cejas-2 | Cejas | Delinear y rellenar | QHmLQPBfVEE |
| cejas-3 | Cejas | Técnica con lápiz | 0_2TH633vO8 |

> Videos candidatos encontrados por búsqueda ("tutorial para principiantes" en español). Pendiente de que el equipo los apruebe o los reemplace por otros antes de la presentación final — para cambiar uno, basta con editar el `videoId` de esa fila.

## Estilo
- Fondo pastel, letras grandes en el título.
- Tarjetas redondeadas con sombra suave, nombre del look debajo de la miniatura.
