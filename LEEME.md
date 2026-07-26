# Cómo ver el prototipo Mac Bright

## Link público (para el equipo)

**https://dbernalj.github.io/mac-bright/**

Cualquiera del equipo lo abre directo desde ese link, en cualquier dispositivo — no hay que descargar ni instalar nada, y los videos de YouTube funcionan normal ahí (está servido por https real).

Cada vez que se edite algo en `definiciones/`, `data.js`, `script.js`, etc., hay que avisar para regenerar y volver a publicar (`git add`, `git commit`, `git push`) — el link no se actualiza solo.

## Para probarlo en esta Mac mientras se edita

**No abras `index.html` con doble clic** — los videos de YouTube no cargan así (YouTube da "Error 153" cuando el video se embebe desde un archivo local `file://` en vez de una página web real).

1. Doble clic en **`iniciar-servidor.command`** (en esta misma carpeta).
2. La primera vez macOS puede pedir permiso para abrirlo — acepta ("Abrir" en el aviso de seguridad).
3. Se abre solo en Chrome en `http://localhost:8765`. Ahí sí funcionan los videos.
4. Para cerrar: cierra la ventana de Terminal que se abrió (o `Ctrl+C` dentro de ella).

### Si prefieren hacerlo a mano

```
cd "Mac Bright/Prototipo"
python3 -m http.server 8765
```

Y abrir `http://localhost:8765/index.html` en el navegador.
