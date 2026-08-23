const ORIGENES_PERMITIDOS = [
  "https://dbernalj.github.io",
  "http://localhost:8765",
];

function aplicarCORS(peticion, respuesta) {
  const origen = peticion.headers.origin;
  if (ORIGENES_PERMITIDOS.includes(origen)) {
    respuesta.setHeader("Access-Control-Allow-Origin", origen);
  }
  respuesta.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  respuesta.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = { aplicarCORS };
