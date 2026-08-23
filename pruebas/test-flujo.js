const { JSDOM } = require("jsdom");
const path = require("path");

const DIR = path.join(__dirname, "..");

// --- Stub de red para /api/register y /api/login (sin frameworks de mocking nuevos) ---
const emailsRegistrados = new Set();

function respuestaJSON(status, datos) {
  return { ok: status >= 200 && status < 300, status, json: async () => datos };
}

function fetchFalso(url, opciones) {
  const cuerpo = JSON.parse(opciones.body);

  if (url.endsWith("/api/register")) {
    const emailNormalizado = cuerpo.email.trim().toLowerCase();
    if (emailsRegistrados.has(emailNormalizado)) {
      return Promise.resolve(respuestaJSON(409, { error: "Ese email ya está registrado." }));
    }
    emailsRegistrados.add(emailNormalizado);
    return Promise.resolve(
      respuestaJSON(201, {
        usuario: {
          id: emailsRegistrados.size,
          nombre: cuerpo.nombre,
          email: emailNormalizado,
          plan: cuerpo.plan,
          metodo_pago: cuerpo.metodoPago,
          creado_en: "2026-08-23T00:00:00.000Z",
        },
      })
    );
  }

  if (url.endsWith("/api/login")) {
    const emailNormalizado = cuerpo.email.trim().toLowerCase();
    const coincide = emailNormalizado === "ana@example.com" && cuerpo.password === "clave123";
    if (!coincide) {
      return Promise.resolve(respuestaJSON(401, { error: "Email o contraseña incorrectos." }));
    }
    return Promise.resolve(
      respuestaJSON(200, {
        usuario: { id: 1, nombre: "Ana", email: emailNormalizado, plan: "mensual", metodo_pago: "nequi" },
      })
    );
  }

  return Promise.reject(new Error("URL no simulada en fetchFalso: " + url));
}

function esperar(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// jsdom no habilita localStorage para el origen "opaco" de las URLs file://, así que se
// reemplaza por un almacén en memoria equivalente (mismo enfoque que el stub de fetch: sin
// agregar dependencias nuevas al proyecto).
function instalarLocalStorage(window, semilla = {}) {
  const almacen = new Map(Object.entries(semilla));
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
      setItem: (k, v) => almacen.set(k, String(v)),
      removeItem: (k) => almacen.delete(k),
      clear: () => almacen.clear(),
    },
  });
}

async function main() {
  const dom = await JSDOM.fromFile(path.join(DIR, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    url: "file://" + DIR + "/index.html",
    beforeParse(window) {
      window.fetch = fetchFalso;
      instalarLocalStorage(window);
    },
  });

  await new Promise((resolve) => {
    dom.window.addEventListener("load", resolve);
  });

  const { window } = dom;

  function esVisible(id) {
    return window.document.getElementById(id).classList.contains("activa");
  }

  const resultados = [];
  function check(nombre, cond) {
    resultados.push({ nombre, ok: !!cond });
  }

  check("Login visible al inicio", esVisible("pantalla-login"));

  // --- Sección A: registro (sin cuenta aún) accesible desde Login, luego volver ---
  window.document.getElementById("btn-registrarse").dispatchEvent(new window.Event("click"));
  check("Registro visible tras click en Registrarse", esVisible("pantalla-registro"));
  check("Sin mensaje contextual al venir de Login", window.document.getElementById("mensaje-registro").textContent === "");
  check("Registro tiene 1 tarjeta de plan", window.document.querySelectorAll(".tarjeta-plan").length === 1);
  check("Registro tiene 4 metodos de pago", window.document.querySelectorAll(".chip-metodo-pago").length === 4);

  window.document.querySelector('.boton-atras[data-atras="pantalla-login"]').dispatchEvent(new window.Event("click"));
  check("Atras en Registro regresa a Login", esVisible("pantalla-login"));

  window.document.getElementById("btn-continuar").dispatchEvent(new window.Event("click"));
  check("Menu visible tras Continuar", esVisible("pantalla-menu"));
  check("Menu tiene 5 categorias renderizadas", window.document.querySelectorAll(".item-categoria").length === 5);
  check("Menu tiene 4 chips de ocasion", window.document.querySelectorAll(".chip-ocasion").length === 4);

  const buscador = window.document.getElementById("buscador");
  buscador.value = "oj";
  buscador.dispatchEvent(new window.Event("input"));
  check("Buscador 'oj' deja solo 1 categoria (Ojos)", window.document.querySelectorAll(".item-categoria").length === 1);
  check("Esa categoria es Ojos", window.document.querySelector(".item-categoria .nombre").textContent === "Ojos");

  buscador.value = "";
  buscador.dispatchEvent(new window.Event("input"));
  const itemOjos = [...window.document.querySelectorAll(".item-categoria")].find((el) => el.textContent.includes("Ojos"));
  itemOjos.dispatchEvent(new window.Event("click"));

  check("Galeria visible tras click en Ojos", esVisible("pantalla-galeria"));
  check("Titulo galeria es 'Ojos'", window.document.getElementById("titulo-galeria").textContent === "Ojos");
  check("Galeria de Ojos tiene 3 tarjetas", window.document.querySelectorAll(".tarjeta-look").length === 3);

  // --- Sección B: freemium como invitado (look gratis vs bloqueado) ---
  const tarjetasOjosInvitado = window.document.querySelectorAll(".tarjeta-look");
  check("Primer look (gratis) no tiene candado", !tarjetasOjosInvitado[0].classList.contains("tarjeta-bloqueada"));
  check("Segundo look (pago) tiene candado", tarjetasOjosInvitado[1].classList.contains("tarjeta-bloqueada"));
  check("Tercer look (pago) tiene candado", tarjetasOjosInvitado[2].classList.contains("tarjeta-bloqueada"));

  const primeraTarjeta = tarjetasOjosInvitado[0];
  const imgSrc = primeraTarjeta.querySelector("img").src;
  check("Miniatura usa img.youtube.com", imgSrc.includes("img.youtube.com/vi/"));

  primeraTarjeta.dispatchEvent(new window.Event("click"));
  check("Detalle visible tras click en tarjeta gratis", esVisible("pantalla-detalle"));
  check("Detalle muestra 'Materiales' no vacio", window.document.getElementById("texto-materiales").textContent.length > 0);
  check("Titulo del look no vacio", window.document.getElementById("titulo-look").textContent.length > 0);

  window.document.getElementById("btn-ver-video").dispatchEvent(new window.Event("click"));
  const iframe = window.document.querySelector("#contenedor-video iframe");
  check("Boton 'Ver video' embebe un iframe de youtube.com/embed", iframe && iframe.src.includes("youtube.com/embed/"));

  window.document.getElementById("btn-atras-detalle").dispatchEvent(new window.Event("click"));
  check("Atras en Detalle regresa a Galeria", esVisible("pantalla-galeria"));
  check("Sigue mostrando la categoria Ojos", window.document.getElementById("titulo-galeria").textContent === "Ojos");
  check(
    "Atras en Detalle quita el iframe del video (no se queda sonando)",
    window.document.querySelector("#contenedor-video iframe") === null
  );

  // Tocar un look bloqueado redirige a Registro, con mensaje contextual
  window.document.querySelectorAll(".tarjeta-look")[1].dispatchEvent(new window.Event("click"));
  check("Look bloqueado redirige a Registro (no a Detalle)", esVisible("pantalla-registro"));
  check(
    "Registro muestra mensaje contextual al venir de un look bloqueado",
    window.document.getElementById("mensaje-registro").textContent.length > 0
  );

  // --- Registro real (cuenta nueva vía API simulada) ---
  window.document.getElementById("registro-nombre").value = "Ana";
  window.document.getElementById("registro-email").value = "ana@example.com";
  window.document.getElementById("registro-password").value = "clave123";
  window.document.querySelector(".tarjeta-plan").dispatchEvent(new window.Event("click"));
  window.document.querySelector(".chip-metodo-pago").dispatchEvent(new window.Event("click"));
  window.document.getElementById("btn-confirmar-pago").dispatchEvent(new window.Event("click"));
  await esperar();

  check("Registro exitoso navega a Menu", esVisible("pantalla-menu"));
  check("estado.usuario quedo guardado", window.eval("estado.usuario.email") === "ana@example.com");
  check("estado.premium quedo activo", window.eval("estado.premium") === true);
  check(
    "Sesion quedo en localStorage",
    JSON.parse(window.localStorage.getItem("mac-bright-usuario")).email === "ana@example.com"
  );

  // Reintentar el mismo email debe fallar (409 simulado) sin navegar
  window.document.getElementById("btn-registrarse").dispatchEvent(new window.Event("click"));
  window.document.getElementById("registro-nombre").value = "Otra";
  window.document.getElementById("registro-email").value = "ana@example.com";
  window.document.getElementById("registro-password").value = "otraClave1";
  window.document.getElementById("btn-confirmar-pago").dispatchEvent(new window.Event("click"));
  await esperar();
  check(
    "Email duplicado muestra error y no navega",
    esVisible("pantalla-registro") &&
      window.document.getElementById("registro-error").textContent.includes("ya está registrado")
  );

  // Ahora todos los looks de Ojos deben verse desbloqueados
  itemOjos.dispatchEvent(new window.Event("click"));
  check(
    "Con sesion activa, ningun look de Ojos tiene candado",
    [...window.document.querySelectorAll(".tarjeta-look")].every((t) => !t.classList.contains("tarjeta-bloqueada"))
  );

  window.document.querySelectorAll(".tarjeta-look")[1].dispatchEvent(new window.Event("click"));
  check("Con sesion activa, el segundo look ahora abre Detalle", esVisible("pantalla-detalle"));

  window.document.getElementById("btn-atras-detalle").dispatchEvent(new window.Event("click"));
  check("Atras en Detalle vuelve a Galeria de Ojos (origen categoria)", esVisible("pantalla-galeria"));
  check("Titulo sigue siendo 'Ojos'", window.document.getElementById("titulo-galeria").textContent === "Ojos");

  window.document.querySelector('.boton-atras[data-atras="pantalla-menu"]').dispatchEvent(new window.Event("click"));
  check("Atras en Galeria regresa a Menu", esVisible("pantalla-menu"));

  // --- Sección C: navegación cruzada por ocasión ---
  const chipOficina = [...window.document.querySelectorAll(".chip-ocasion")].find((el) =>
    el.textContent.includes("Oficina")
  );
  chipOficina.dispatchEvent(new window.Event("click"));

  const looksOficina = window.eval('getLooksPorOcasion("oficina")');
  check("Galeria por ocasion visible", esVisible("pantalla-galeria"));
  check("Titulo galeria es el nombre de la ocasion", window.document.getElementById("titulo-galeria").textContent === "Oficina / Diario");
  check(
    "Galeria por ocasion muestra looks de varias categorias",
    window.document.querySelectorAll(".tarjeta-look").length === looksOficina.length && looksOficina.length > 3
  );

  window.document.querySelector(".tarjeta-look").dispatchEvent(new window.Event("click"));
  check("Detalle visible desde navegacion por ocasion", esVisible("pantalla-detalle"));

  window.document.getElementById("btn-atras-detalle").dispatchEvent(new window.Event("click"));
  check(
    "Atras en Detalle vuelve a la Galeria de la MISMA ocasion (no a una categoria)",
    esVisible("pantalla-galeria") && window.document.getElementById("titulo-galeria").textContent === "Oficina / Diario"
  );

  // --- Sección D: login real (con la cuenta ya creada arriba) ---
  window.document.querySelector('.boton-atras[data-atras="pantalla-menu"]').dispatchEvent(new window.Event("click"));
  window.localStorage.removeItem("mac-bright-usuario");
  window.eval("estado.usuario = null; estado.premium = false;");

  window.document.getElementById("email").value = "ana@example.com";
  window.document.getElementById("password").value = "clave-incorrecta";
  window.document.getElementById("btn-iniciar-sesion").dispatchEvent(new window.Event("click"));
  await esperar();
  check(
    "Login con password incorrecta muestra error generico",
    window.document.getElementById("login-error").textContent.includes("incorrectos")
  );

  window.document.getElementById("password").value = "clave123";
  window.document.getElementById("btn-iniciar-sesion").dispatchEvent(new window.Event("click"));
  await esperar();
  check("Login correcto navega a Menu", esVisible("pantalla-menu"));
  check("Login correcto activa estado.premium", window.eval("estado.premium") === true);

  // --- Sección E: sesión guardada se restaura sola al recargar (segunda carga independiente) ---
  const domRestaurada = await JSDOM.fromFile(path.join(DIR, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    url: "file://" + DIR + "/index.html",
    beforeParse(w) {
      w.fetch = fetchFalso;
      instalarLocalStorage(w, {
        "mac-bright-usuario": JSON.stringify({ id: 1, nombre: "Ana", email: "ana@example.com", plan: "mensual", metodo_pago: "nequi" }),
      });
    },
  });
  await new Promise((resolve) => domRestaurada.window.addEventListener("load", resolve));
  check(
    "Con sesion guardada, la app entra directo a Menu sin pedir login",
    domRestaurada.window.document.getElementById("pantalla-menu").classList.contains("activa")
  );

  // --- Consistencia de datos (util cuando alguien edita data.js a mano) ---
  const categorias = window.eval("CATEGORIAS");
  const looks = window.eval("LOOKS");
  const ocasiones = window.eval("OCASIONES");
  const planes = window.eval("PLANES");
  const metodosPago = window.eval("METODOS_PAGO");

  check("5 categorias en data.js", categorias.length === 5);
  categorias.forEach((cat) => {
    const looksDeCategoria = looks.filter((l) => l.categoria === cat.id);
    check(`Categoria '${cat.id}' tiene 3 looks`, looksDeCategoria.length === 3);
    check(`Categoria '${cat.id}' tiene exactamente 1 look gratis`, looksDeCategoria.filter((l) => l.gratis === true).length === 1);
  });

  const idsCategoria = new Set(categorias.map((c) => c.id));
  check(
    "Todos los looks apuntan a una categoria que existe",
    looks.every((l) => idsCategoria.has(l.categoria))
  );

  const videoIds = looks.map((l) => l.videoId);
  check("No hay videoId duplicados entre los 15 looks", new Set(videoIds).size === videoIds.length);

  const idsLook = looks.map((l) => l.id);
  check("No hay id de look duplicados", new Set(idsLook).size === idsLook.length);

  check(
    "Todos los looks tienen texto de materiales",
    looks.every((l) => typeof l.materiales === "string" && l.materiales.trim().length > 0)
  );

  check(
    "Todos los looks tienen campo 'gratis' booleano",
    looks.every((l) => typeof l.gratis === "boolean")
  );

  const idsOcasion = new Set(ocasiones.map((o) => o.id));
  check(
    "Todos los looks tienen al menos 1 ocasion valida",
    looks.every((l) => Array.isArray(l.ocasion) && l.ocasion.length >= 1 && l.ocasion.every((id) => idsOcasion.has(id)))
  );

  check("4 ocasiones en data.js", ocasiones.length === 4);
  check("No hay id de ocasion duplicados", idsOcasion.size === ocasiones.length);
  check(
    "Cada ocasion tiene al menos 1 look asociado",
    ocasiones.every((o) => looks.some((l) => l.ocasion.includes(o.id)))
  );

  check("1 solo plan en data.js (mensual)", planes.length === 1 && planes[0].id === "mensual");

  const idsMetodoPago = new Set(metodosPago.map((m) => m.id));
  check("4 metodos de pago en data.js", metodosPago.length === 4);
  check("No hay id de metodo de pago duplicados", idsMetodoPago.size === metodosPago.length);

  let fallos = 0;
  resultados.forEach((r) => {
    console.log((r.ok ? "OK  " : "FAIL") + " - " + r.nombre);
    if (!r.ok) fallos++;
  });
  console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS PASARON" : fallos + " PRUEBA(S) FALLARON"));
  process.exit(fallos === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
