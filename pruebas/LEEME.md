# Pruebas de regresión — Mac Bright

Este archivo (`test-flujo.js`) prueba automáticamente que el prototipo (`../index.html`) sigue funcionando: login → menú → buscador → categoría → galería → detalle → video → botones atrás, y que los datos de `../data.js` son consistentes (5 categorías, 3 looks cada una, sin IDs ni videos repetidos, todos con materiales).

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
