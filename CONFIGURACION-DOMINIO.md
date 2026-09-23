# Conectar el dominio macbright.club (una sola vez)

El objetivo: que **https://www.macbright.club** abra la app, en vez del link largo de Vercel.

## Por qué apuntarlo a Vercel y no a GitHub Pages

Hoy la app vive en dos lados a la vez: el sitio en GitHub Pages (`dbernalj.github.io/mac-bright`) y la API en Vercel (`mac-bright.vercel.app/api`). Pero Vercel ya sirve **las dos cosas**: la carpeta del repo se publica tal cual y `api/` corre como funciones. Comprobado: `https://mac-bright.vercel.app/` abre el `index.html` completo.

Apuntar el dominio a Vercel deja el sitio y la API en el **mismo origen**, así el navegador ya no tiene que pedir permiso cruzado (CORS) para el login. Con GitHub Pages habría que mantener el permiso cruzado a mano y además configurar el dominio en dos servicios. Por eso: Vercel.

GitHub Pages puede quedar como está — sigue funcionando de respaldo, no hay que apagarlo.

## 1. Agregar el dominio en Vercel

1. Ir directo a esta URL (la sección existe, pero está abajo en la barra lateral de Settings, no arriba):

   **https://vercel.com/projects-efb4/mac-bright/settings/domains**

2. En "Add Domain", escribir `www.macbright.club` → **Add**.
3. Cuando pregunte por la redirección, elegir la opción que **redirige `macbright.club` → `www.macbright.club`** (así el dominio principal es el que compraste, y quien escriba la versión corta también llega).
4. Vercel va a mostrar en pantalla los dos registros DNS que hay que crear. **Hay que copiar esos valores exactos, no los de ningún tutorial**: el CNAME de `www` es **único por proyecto** (tiene forma de `d1d4fc829fe7bc7c.vercel-dns-017.com`, no el genérico `cname.vercel-dns.com`), y el valor de la A también puede variar. Anotá los dos tal cual aparecen antes de ir a GoDaddy.

Va a quedar en estado "Invalid Configuration" hasta que se haga el paso 2. Es normal.

## 2. Cambiar el DNS en GoDaddy

El dominio está registrado en GoDaddy y usa sus nameservers (`ns21/ns22.domaincontrol.com`), así que el DNS se edita ahí — **no hay que cambiar los nameservers**.

1. Entrar a godaddy.com → **My Products** → al lado de `macbright.club`, botón **DNS** (o "Administrar DNS").
2. Primero, **borrar el registro de parking**. Acá está la trampa: GoDaddy **no muestra la IP** de ese registro, muestra la palabra literal **`Parked`** en la columna "Datos". Es una fila `A` con nombre `@` y datos `Parked`, y por dentro expande a **dos** IPs (`3.33.130.190` y `15.197.148.33`) — justo las dos que Vercel pide eliminar. Por eso parece que "no existen": existen, pero escondidas detrás de esa etiqueta. Borrarla con el ícono de basura.

   Si además hay algo configurado en la sección **Forwarding** (Reenvío), borrarlo también, o GoDaddy vuelve a crear el registro de parking solo.
3. En **Registros DNS**, dejar estos dos (los valores son los que mostró Vercel para este proyecto en el paso 1.4):

   | Tipo  | Nombre | Valor                                   |
   |-------|--------|-----------------------------------------|
   | A     | `@`    | `216.198.79.1`                          |
   | CNAME | `www`  | `e6efdc2927cb3fb3.vercel-dns-017.com.`  |

   El `A` hay que crearlo; el `CNAME` de `www` ya existe por defecto apuntando a `@` y se edita con el lápiz.

   Se editan con el lápiz de cada fila y **Guardar**. Si GoDaddy no deja editar el CNAME de `www`, borrarlo y crearlo de nuevo con el valor nuevo.

   **Tiene que quedar una sola `A` para `@`**, la de Vercel. Si quedan la de Vercel y la de parking conviviendo, el DNS reparte el tráfico entre las dos al azar: una parte de las visitas cae en la app y otra en la página de "dominio estacionado". Vercel lo marca como *Invalid Configuration* mientras eso pase.
4. Dejar el resto de los registros (MX, TXT, etc.) como están.

## 3. Esperar la propagación

GoDaddy suele tardar entre 10 minutos y 1 hora (puede llegar a 24h en el peor caso). Para revisar desde la Terminal, sin depender del caché del navegador:

```
dig +short www.macbright.club
```

Cuando devuelva el CNAME de Vercel (y no `macbright.club.`), ya cambió. En Vercel, el dominio pasa solo de "Invalid Configuration" a **Valid** y emite el certificado HTTPS gratis — eso puede tomar unos minutos más después de que el DNS esté bien. No hay que hacer nada para el certificado.

## 4. Publicar los cambios de código

Junto con este documento ya quedaron hechos los ajustes que el dominio necesita:

- `script.js` y `admin.js`: cuando la app se abre desde `macbright.club` o desde `*.vercel.app`, llama a la API con la ruta relativa `/api` (mismo origen, sin CORS). Desde GitHub Pages o `localhost` sigue usando la URL completa de Vercel, así que **ninguno de los dos se rompe**.
- `lib/cors.js`: se agregaron `https://www.macbright.club` y `https://macbright.club` a los orígenes permitidos, como red de seguridad.

Falta subirlos para que Vercel redespliegue:

```
cd Prototipo
git add script.js admin.js lib/cors.js CONFIGURACION-DOMINIO.md LEEME.md
git commit -m "Conectar el dominio macbright.club"
git push
```

## 5. Probar que quedó funcionando

1. Abrir **https://www.macbright.club** — debe cargar la app, con el candado de HTTPS.
2. Abrir **https://macbright.club** (sin www) — debe redirigir sola a la versión con www.
3. **La prueba real**: tocar "Registrarse" con un email de prueba. Si la cuenta se crea, la API está respondiendo desde el mismo dominio.
4. Abrir **https://www.macbright.club/admin.html** y entrar con la `ADMIN_PASSWORD` — debe listar los usuarios.

Si el sitio carga pero el login falla, es casi siempre que el navegador guardó la versión vieja de `script.js`: recargar con `Cmd+Shift+R`.
