const { getDB } = require("../../lib/db");
const { aplicarCORS } = require("../../lib/cors");
const { esAdminValido } = require("../../lib/admin-auth");

module.exports = async function handler(peticion, respuesta) {
  aplicarCORS(peticion, respuesta);
  if (peticion.method === "OPTIONS") return respuesta.status(204).end();
  if (peticion.method !== "GET") return respuesta.status(405).json({ error: "Método no permitido." });
  if (!esAdminValido(peticion)) {
    return respuesta.status(401).json({ error: "Contraseña de administrador incorrecta." });
  }

  try {
    const db = getDB();
    const resultado = await db.execute(
      "SELECT id, nombre, email, plan, metodo_pago, creado_en, activo FROM usuarios ORDER BY creado_en DESC"
    );
    const usuarios = resultado.rows.map((fila) => ({ ...fila, activo: !!fila.activo }));
    return respuesta.status(200).json({ usuarios });
  } catch (err) {
    console.error("Error en /api/admin/usuarios:", err);
    return respuesta.status(500).json({ error: "Error inesperado del servidor." });
  }
};
