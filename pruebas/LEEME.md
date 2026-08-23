# Pruebas de regresión — Mac Bright

Este archivo (`test-flujo.js`) prueba automáticamente que el prototipo (`../index.html`) sigue funcionando: login → menú → buscador → categoría → galería → detalle → video → botones atrás, registro de cuenta nueva (con `/api/register` simulado), modelo freemium (look gratis vs bloqueado por categoría), navegación cruzada por ocasión, inicio de sesión (con `/api/login` simulado, incluyendo credenciales inválidas) y restauración automática de sesión guardada — y que los datos de `../data.js` son consistentes (5 categorías, 3 looks cada una con exactamente 1 gratis, sin IDs ni videos repetidos, todos con materiales y etiquetas de ocasión válidas, planes y métodos de pago sin duplicados).

Las llamadas de red a `/api/register` y `/api/login` se simulan dentro del propio test (no hace falta tener el backend desplegado ni internet para correr `npm test`).

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
