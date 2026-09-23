# Que Google indexe macbright.club (una sola vez)

Ya quedaron listos en el código: `robots.txt` (permite rastrear el sitio, bloquea `/admin.html` y `/api/`), `sitemap.xml` (le dice a Google qué página existe), una meta descripción en `index.html`, y una etiqueta `noindex` en `admin.html` para que el panel de administración no aparezca nunca en resultados de búsqueda. Falta la parte manual: darle de alta el sitio en Google Search Console.

## 1. Verificar que eres dueño del dominio

1. Entrar a [search.google.com/search-console](https://search.google.com/search-console) con una cuenta de Google.
2. **Agregar propiedad** → elegir **Dominio** (no "Prefijo de URL") y escribir `macbright.club` — esta opción cubre `www` y sin `www`, http y https, todo junto.
3. Google va a mostrar un registro **TXT** para agregar en el DNS. Como el dominio está en GoDaddy (mismo lugar donde se configuró `macbright.club` para Vercel, ver `CONFIGURACION-DOMINIO.md`):
   - godaddy.com → **My Products** → `macbright.club` → **DNS**.
   - Agregar un registro nuevo: Tipo **TXT**, Nombre **@**, Valor el que te dio Google (algo como `google-site-verification=...`).
   - Guardar.
4. Volver a Search Console y tocar **Verificar**. Si GoDaddy tarda en propagar, puede pedir esperar unos minutos y reintentar.

## 2. Enviar el sitemap

1. Dentro de Search Console, con la propiedad ya verificada, ir a **Sitemaps** (menú izquierdo).
2. Escribir `sitemap.xml` y tocar **Enviar**.
3. Debe quedar en estado "Correcto" (puede tardar un rato en procesarse, no es instantáneo).

## 3. Pedir indexación inmediata de la portada (opcional, acelera el primer rastreo)

1. En la barra de arriba de Search Console, pegar `https://www.macbright.club/` en **Inspección de URLs**.
2. Tocar **Solicitar indexación**.

## 4. Qué esperar

Google no indexa al instante — lo normal es entre unos días y un par de semanas para que empiece a aparecer en resultados de búsqueda. El paso 3 acelera el primer rastreo, pero no garantiza que aparezca inmediatamente. Como el sitio es de una sola página, no hay que repetir nada de esto cuando se agreguen looks nuevos — solo si algún día se agregan páginas nuevas de verdad (con su propia URL) habría que sumar esa URL a `sitemap.xml`.
