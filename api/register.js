const bcrypt = require("bcryptjs");
const { getDB } = require("../lib/db");
const { aplicarCORS } = require("../lib/cors");

module.exports = async function handler(peticion, respuesta) {
  aplicarCORS(peticion, respuesta);
  if (peticion.method === "OPTIONS") return respuesta.status(204).end();
  if (peticion.method !== "POST") return respuesta.status(405).json({ error: "Método no permitido." });

  try {
    const { nombre, email, password, plan, metodoPago } = peticion.body || {};

    if (!nombre || !email || !password || !plan || !metodoPago) {
      return respuesta.status(400).json({ error: "Faltan datos obligatorios." });
    }
    if (String(password).length < 6) {
      return respuesta.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const db = getDB();

    const existente = await db.execute({
      sql: "SELECT id FROM usuarios WHERE email = ?",
      args: [emailNormalizado],
    });
    if (existente.rows.length > 0) {
      return respuesta.status(409).json({ error: "Ese email ya está registrado." });
    }

    const hash = await bcrypt.hash(password, 10);

    let resultado;
    try {
      resultado = await db.execute({
        sql: `INSERT INTO usuarios (nombre, email, password_hash, plan, metodo_pago)
              VALUES (?, ?, ?, ?, ?)
              RETURNING id, nombre, email, plan, metodo_pago, creado_en, activo`,
        args: [String(nombre).trim(), emailNormalizado, hash, plan, metodoPago],
      });
    } catch (errorInsert) {
      // Red de seguridad ante una condición de carrera entre el SELECT de arriba y este INSERT:
      // la restricción UNIQUE de la tabla es la fuente de verdad real.
      if (String(errorInsert.message || "").includes("UNIQUE")) {
        return respuesta.status(409).json({ error: "Ese email ya está registrado." });
      }
      throw errorInsert;
    }

    const fila = resultado.rows[0];
    return respuesta.status(201).json({ usuario: { ...fila, activo: !!fila.activo } });
  } catch (err) {
    console.error("Error en /api/register:", err);
    return respuesta.status(500).json({ error: "Error inesperado del servidor. Intenta de nuevo." });
  }
};
