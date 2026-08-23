const { JSDOM } = require("jsdom");
const path = require("path");

const DIR = path.join(__dirname, "..");
const ADMIN_PASSWORD_VALIDA = "clave-admin-de-prueba";

// --- "Base de datos" en memoria + stub de red para /api/admin/usuarios ---
let usuariosDB = [
  { id: 1, nombre: "Ana", email: "ana@example.com", plan: "mensual", metodo_pago: "nequi", creado_en: "2026-08-20T10:00:00.000Z", activo: false },
  { id: 2, nombre: "Bruno", email: "bruno@example.com", plan: "mensual", metodo_pago: "bre-b", creado_en: "2026-08-21T10:00:00.000Z", activo: true },
];

function respuestaJSON(status, datos) {
  return { ok: status >= 200 && status < 300, status, json: async () => datos };
}

function fetchFalso(url, opciones = {}) {
  const headers = opciones.headers || {};
  const metodo = opciones.method || "GET";
  const claveCorrecta = headers["X-Admin-Password"] === ADMIN_PASSWORD_VALIDA;

  if (url.endsWith("/api/admin/usuarios")) {
    if (!claveCorrecta) return Promise.resolve(respuestaJSON(401, { error: "Contraseña de administrador incorrecta." }));
    return Promise.resolve(respuestaJSON(200, { usuarios: usuariosDB }));
  }

  const coincidencia = url.match(/\/api\/admin\/usuarios\/(\d+)$/);
  if (coincidencia) {
    if (!claveCorrecta) return Promise.resolve(respuestaJSON(401, { error: "Contraseña de administrador incorrecta." }));
    const id = Number(coincidencia[1]);
    const usuario = usuariosDB.find((u) => u.id === id);
    if (!usuario) return Promise.resolve(respuestaJSON(404, { error: "No encontrado." }));

    if (metodo === "PATCH") {
      const cuerpo = JSON.parse(opciones.body);
      if (typeof cuerpo.activo === "boolean") usuario.activo = cuerpo.activo;
      if (typeof cuerpo.password === "string") usuario.passwordReseteada = cuerpo.password;
      return Promise.resolve(respuestaJSON(200, { ok: true }));
    }
    if (metodo === "DELETE") {
      usuariosDB = usuariosDB.filter((u) => u.id !== id);
      return Promise.resolve(respuestaJSON(200, { ok: true }));
    }
  }

  return Promise.reject(new Error("URL no simulada en fetchFalso: " + url));
}

function esperar(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// jsdom no implementa confirm/prompt/alert por defecto (window.confirm/prompt no están
// definidos) — se controlan mediante un objeto mutable para poder simular distintas
// respuestas del "usuario" en distintos puntos del mismo test.
const dialogos = { confirmar: true, promptValor: "nuevaClave123" };

function instalarNavegador(window) {
  window.fetch = fetchFalso;
  window.confirm = () => dialogos.confirmar;
  window.prompt = () => dialogos.promptValor;
  window.alert = () => {};
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: (() => {
      const almacen = new Map();
      return {
        getItem: (k) => (almacen.has(k) ? almacen.get(k) : null),
        setItem: (k, v) => almacen.set(k, String(v)),
        removeItem: (k) => almacen.delete(k),
      };
    })(),
  });
}

async function main() {
  const dom = await JSDOM.fromFile(path.join(DIR, "admin.html"), {
    runScripts: "dangerously",
    resources: "usable",
    url: "file://" + DIR + "/admin.html",
    beforeParse: instalarNavegador,
  });

  await new Promise((resolve) => dom.window.addEventListener("load", resolve));
  const { window } = dom;

  const resultados = [];
  function check(nombre, cond) {
    resultados.push({ nombre, ok: !!cond });
  }

  function oculto(id) {
    return window.document.getElementById(id).classList.contains("oculto");
  }

  check("Panel de acceso visible al inicio", !oculto("panel-acceso"));
  check("Panel de usuarios oculto al inicio", oculto("panel-usuarios"));

  // --- Contraseña incorrecta ---
  window.document.getElementById("admin-password").value = "clave-mala";
  window.document.getElementById("btn-entrar").dispatchEvent(new window.Event("click"));
  await esperar();
  check("Contraseña incorrecta muestra error", window.document.getElementById("acceso-error").textContent.includes("incorrecta"));
  check("Panel de usuarios sigue oculto tras contraseña incorrecta", oculto("panel-usuarios"));

  // --- Contraseña correcta ---
  window.document.getElementById("admin-password").value = ADMIN_PASSWORD_VALIDA;
  window.document.getElementById("btn-entrar").dispatchEvent(new window.Event("click"));
  await esperar();
  check("Panel de usuarios visible tras contraseña correcta", !oculto("panel-usuarios"));
  check("Tabla tiene 2 filas (2 usuarios)", window.document.querySelectorAll("#cuerpo-tabla tr").length === 2);
  check(
    "Contraseña quedó guardada en sessionStorage",
    window.sessionStorage.getItem("mac-bright-admin-password") === ADMIN_PASSWORD_VALIDA
  );

  function filaDe(email) {
    return [...window.document.querySelectorAll("#cuerpo-tabla tr")].find((tr) => tr.textContent.includes(email));
  }

  check("Ana aparece como Pendiente", filaDe("ana@example.com").textContent.includes("Pendiente"));
  check("Bruno aparece como Activo", filaDe("bruno@example.com").textContent.includes("Activo"));

  // --- Activar a Ana ---
  const botonActivarAna = [...filaDe("ana@example.com").querySelectorAll("button")].find((b) => b.textContent === "Activar");
  botonActivarAna.dispatchEvent(new window.Event("click"));
  await esperar();
  check("Ana pasa a Activo tras activar", filaDe("ana@example.com").textContent.includes("Activo"));
  check("usuariosDB refleja el cambio", usuariosDB.find((u) => u.email === "ana@example.com").activo === true);

  // --- Desactivar a Bruno ---
  const botonDesactivarBruno = [...filaDe("bruno@example.com").querySelectorAll("button")].find((b) => b.textContent === "Desactivar");
  botonDesactivarBruno.dispatchEvent(new window.Event("click"));
  await esperar();
  check("Bruno pasa a Pendiente tras desactivar", filaDe("bruno@example.com").textContent.includes("Pendiente"));

  // --- Resetear contraseña de Ana ---
  const botonReset = [...filaDe("ana@example.com").querySelectorAll("button")].find((b) => b.textContent === "Resetear contraseña");
  botonReset.dispatchEvent(new window.Event("click"));
  await esperar();
  check(
    "Resetear contraseña actualiza el password en el servidor simulado",
    usuariosDB.find((u) => u.email === "ana@example.com").passwordReseteada === "nuevaClave123"
  );

  // --- Eliminar a Bruno: cancelar primero, luego confirmar ---
  dialogos.confirmar = false;
  const botonEliminarBruno = [...filaDe("bruno@example.com").querySelectorAll("button")].find((b) => b.textContent === "Eliminar");
  botonEliminarBruno.dispatchEvent(new window.Event("click"));
  await esperar();
  check("Cancelar el confirm no elimina a Bruno", usuariosDB.some((u) => u.email === "bruno@example.com"));

  dialogos.confirmar = true;
  botonEliminarBruno.dispatchEvent(new window.Event("click"));
  await esperar();
  check("Confirmar elimina a Bruno del servidor simulado", !usuariosDB.some((u) => u.email === "bruno@example.com"));
  check("Tabla ahora tiene 1 fila", window.document.querySelectorAll("#cuerpo-tabla tr").length === 1);

  // --- Salir ---
  window.document.getElementById("btn-salir").dispatchEvent(new window.Event("click"));
  check("Salir regresa al panel de acceso", !oculto("panel-acceso"));
  check("Salir oculta el panel de usuarios", oculto("panel-usuarios"));
  check("Salir borra la contraseña de sessionStorage", window.sessionStorage.getItem("mac-bright-admin-password") === null);

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
