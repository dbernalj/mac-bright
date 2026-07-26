# Pantalla 4 — Detalle

## Objetivo
Mostrar la información completa del look elegido en la Galería: la foto, los materiales necesarios, y el video tutorial.

## Elementos
- Foto grande (misma miniatura del look, en tamaño grande).
- Encabezado: **Materiales**
- Texto con la lista de materiales/productos necesarios para ese look.
- Botón: **Ver video** — al tocarlo, embebe el video de YouTube de ese look directamente en la pantalla (no sale de la app).
- Botón atrás (regresa a la Galería de la misma categoría).

## Comportamiento
- El contenido mostrado depende del `id` del look que se tocó en la Galería.
- El video se embebe usando `https://www.youtube.com/embed/<videoId>`.
- Al tocar el botón atrás (o al abrir un look distinto), el video se **detiene de verdad**: se elimina el reproductor en vez de solo ocultar la pantalla, para que no se quede sonando de fondo.
- El prototipo debe verse sirviendo `index.html` por http (ver `../LEEME.md`); si se abre como archivo local (`file://`), YouTube bloquea el video con "Error 153" aunque el video sí permita insertarse.

## Contenido: materiales por look

Mismos `id` que en `03-galeria.md` (ahí está el nombre del look y el `videoId`; aquí solo vive el texto de Materiales, para poder editarlo sin tocar la Galería).

| id | Materiales |
|---|---|
| ojos-1 | Sombras neutras, brocha difuminadora, delineador líquido. |
| ojos-2 | Sombra oscura, delineador, rizador de pestañas. |
| ojos-3 | Sombra clara, delineador suave, máscara de pestañas. |
| labios-1 | Lápiz delineador para labios, labial mate. |
| labios-2 | Lápiz labial, labial líquido, gloss. |
| labios-3 | Delineador, labial, corrector para contornear. |
| pestanas-1 | Rímel, rizador de pestañas. |
| pestanas-2 | Rímel de fibras, rizador de pestañas, primer. |
| pestanas-3 | Pestañas postizas individuales, pegamento, pinza. |
| mejillas-1 | Rubor en polvo, brocha para rubor. |
| mejillas-2 | Rubor, brocha angulada, espejo. |
| mejillas-3 | Rubor en crema y en polvo, brocha, esponja. |
| cejas-1 | Lápiz para cejas, gel fijador. |
| cejas-2 | Lápiz, sombra para cejas, brocha angulada. |
| cejas-3 | Lápiz para cejas, cepillo espiral. |

## Estilo
- Fondo pastel, letras grandes en el encabezado "Materiales".
- Botón "Ver video" grande y llamativo.
