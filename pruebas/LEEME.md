# Pruebas de regresión — Mac Bright

`npm test` corre dos archivos:

- **`test-flujo.js`**: prueba que el prototipo (`../index.html`) sigue funcionando: login → menú → buscador → categoría → galería → detalle → video → botones atrás, registro de cuenta nueva (con `/api/register` simulado, la cuenta queda **pendiente de aprobación**, no premium hasta que un "admin" simulado la activa), modelo freemium (look gratis vs bloqueado por categoría), navegación cruzada por ocasión, inicio de sesión (con `/api/login` simulado, incluyendo credenciales inválidas), botón de cerrar sesión, y restauración automática de sesión guardada (tanto de una cuenta ya aprobada como de una todavía pendiente) — y que los datos de `../data.js` son consistentes (5 categorías, 3 looks cada una con exactamente 1 gratis, sin IDs ni videos repetidos, todos con materiales y etiquetas de ocasión válidas, planes y métodos de pago sin duplicados).
- **`test-admin.js`**: prueba el panel de administración (`../admin.html`, separado de la app): acceso con contraseña (correcta/incorrecta), listar usuarios, activar/desactivar, resetear contraseña, eliminar (con y sin confirmar), y salir.

Las llamadas de red a `/api/register`, `/api/login` y `/api/admin/*` se simulan dentro de cada test (no hace falta tener el backend desplegado ni internet para correr `npm test`).

## Cómo correrlas

La primera vez (instala las dependencias, una sola vez):

```
cd Prototipo/pruebas
npm install
```

Cada vez que modifiquen algo (por ejemplo, un `.md` en `definiciones/` y regeneren `data.js`/`script.js`), para confirmar que no se rompió nada:

```
cd Prototipo/pruebas
npm test
```

Si todo sigue bien vas a ver `TODAS LAS PRUEBAS PASARON`. Si algo se rompió, va a decir `FAIL` junto al nombre de la prueba que falló.
