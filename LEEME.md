# Cómo ver el prototipo Mac Bright

**No abras `index.html` con doble clic.** Los videos de YouTube no cargan así — YouTube da "Error 153" cuando el video se embebe desde un archivo local (`file://...`) en vez de una página web real, aunque el video sí permita insertarse en sitios.

## Para verlo (cada vez)

1. Doble clic en **`iniciar-servidor.command`** (en esta misma carpeta).
2. La primera vez macOS puede pedir permiso para abrirlo — acepta ("Abrir" en el aviso de seguridad).
3. Se va a abrir solo en Chrome en `http://localhost:8765`. Así sí funcionan los videos.
4. Para cerrar el prototipo cuando terminen: cierra esa ventana de Terminal que se abrió (o `Ctrl+C` dentro de ella).

## Si prefieren hacerlo a mano

Desde la Terminal:

```
cd "Mac Bright/Prototipo"
python3 -m http.server 8765
```

Y abrir `http://localhost:8765/index.html` en el navegador.
