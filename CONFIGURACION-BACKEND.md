# Configurar el backend de cuentas (una sola vez)

Esto conecta "Registrarse" e "Iniciar sesión" con una base de datos real (Turso, compatible con SQLite) a través de una API gratuita en Vercel. Son pasos manuales de configuración — no requieren tocar código más allá de un único ajuste al final. Todo el código del backend (`api/`, `lib/`, `migrations/`) ya existe en este repo.

## 1. Turso (la base de datos)

1. Instalar la CLI: `curl -sSfL https://get.tur.so/install.sh | bash` (o `brew install tursodatabase/tap/turso` en Mac).
2. `turso auth signup` — crea una cuenta gratis (sin tarjeta).
3. `turso db create mac-bright` — crea la base de datos.
4. Correr las migraciones (crean la tabla `usuarios` y luego agregan la columna `activo`), una sola vez cada una, en orden:
   ```
   cd Prototipo
   turso db shell mac-bright < migrations/001_crear_usuarios.sql
   turso db shell mac-bright < migrations/002_agregar_activo.sql
   ```
5. Verificar que quedó bien: `turso db shell mac-bright "SELECT * FROM usuarios;"` (debe mostrar la columna `activo`).
6. Obtener las dos credenciales que va a pedir Vercel:
   - `turso db show mac-bright --url` → esto es `TURSO_DATABASE_URL`.
   - `turso db tokens create mac-bright` → esto es `TURSO_AUTH_TOKEN`.
   - Guardar ambas en un gestor de contraseñas. **Nunca** se pegan en el código ni se commitean.

## 2. Vercel (la API)

1. Crear cuenta gratis en vercel.com (recomendado: "Continue with GitHub", para que quede conectada directo al repo).
2. "Add New Project" → importar el repo `dbernalj/mac-bright`.
3. Framework Preset: **Other** (no hay paso de build). Root Directory: dejar el que viene por defecto (la raíz del repo, donde ya está la carpeta `api/`).
4. Antes de darle deploy, ir a **Project Settings → Environment Variables** y agregar:
   - `TURSO_DATABASE_URL` = (el valor del paso 1.6)
   - `TURSO_AUTH_TOKEN` = (el valor del paso 1.6)
   - `ADMIN_PASSWORD` = una contraseña larga y única que solo conozcan los administradores (protege el panel de `admin.html`)
5. Deploy. Vercel va a asignar una URL parecida a `https://mac-bright-api.vercel.app`.

## 3. Conectar el frontend con la API real

Editar `script.js`, línea 1, y reemplazar el placeholder por la URL real que asignó Vercel (con el sufijo `/api`):

```js
const API_BASE_URL = "https://mac-bright.vercel.app/api";
```

Luego `git add script.js`, `git commit`, `git push` — esto también vuelve a publicar el sitio en GitHub Pages con el cambio. De ahí en adelante, cada `git push` a `main` redespliega automáticamente tanto GitHub Pages (el sitio) como Vercel (la API).

## 4. Probar que quedó funcionando

Con el prototipo corriendo localmente (`iniciar-servidor.command`, ver `LEEME.md`) o desde el link público:

1. Tocar **Registrarse**, llenar el formulario con un email de prueba y confirmar. Debería llevar directo al Menú.
2. Confirmar que la cuenta quedó guardada de verdad: `turso db shell mac-bright "SELECT id, nombre, email FROM usuarios;"`.
3. Recargar la página — debería entrar directo al Menú sin pedir login otra vez.
4. **La prueba importante**: abrir el mismo link en otro navegador o dispositivo distinto, tocar **Iniciar sesión** con esa misma cuenta — debería funcionar, porque los datos viven en Turso, no en el navegador de origen.

Antes de completar este proceso, "Continuar como invitado" sigue funcionando normal para navegar el catálogo; solo Registrarse/Iniciar sesión van a mostrar un error de conexión hasta que la API esté desplegada.

## 5. Panel de administración

Toda cuenta nueva queda **pendiente de aprobación** (el pago por QR es simulado, nadie lo verifica solo). Para activarla:

1. Abrir `admin.html` (junto a `index.html`, ej. `https://dbernalj.github.io/mac-bright/admin.html`, o localmente en `http://localhost:8765/admin.html`).
2. Entrar con la `ADMIN_PASSWORD` que configuraste en el paso 2.4.
3. Buscar la cuenta en la tabla y tocar **Activar**. El usuario va a ver la suscripción activa la próxima vez que inicie sesión (no hay aviso en tiempo real).

Más detalle del panel (qué hace cada botón) en `definiciones/admin.md`.
