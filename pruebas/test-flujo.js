const { JSDOM } = require("jsdom");
const path = require("path");

const DIR = path.join(__dirname, "..");

async function main() {
  const dom = await JSDOM.fromFile(path.join(DIR, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    url: "file://" + DIR + "/index.html",
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

  window.document.getElementById("btn-continuar").dispatchEvent(new window.Event("click"));
  check("Menu visible tras Continuar", esVisible("pantalla-menu"));
  check("Menu tiene 5 categorias renderizadas", window.document.querySelectorAll(".item-categoria").length === 5);

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

  const primeraTarjeta = window.document.querySelector(".tarjeta-look");
  const imgSrc = primeraTarjeta.querySelector("img").src;
  check("Miniatura usa img.youtube.com", imgSrc.includes("img.youtube.com/vi/"));

  primeraTarjeta.dispatchEvent(new window.Event("click"));
  check("Detalle visible tras click en tarjeta", esVisible("pantalla-detalle"));
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

  window.document.querySelector('.boton-atras[data-atras="pantalla-menu"]').dispatchEvent(new window.Event("click"));
  check("Atras en Galeria regresa a Menu", esVisible("pantalla-menu"));

  // Consistencia de datos (util cuando alguien edita data.js a mano)
  const categorias = window.eval("CATEGORIAS");
  const looks = window.eval("LOOKS");

  check("5 categorias en data.js", categorias.length === 5);
  categorias.forEach((cat) => {
    const looksDeCategoria = looks.filter((l) => l.categoria === cat.id);
    check(`Categoria '${cat.id}' tiene 3 looks`, looksDeCategoria.length === 3);
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
