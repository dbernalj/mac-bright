const bcrypt = require("bcryptjs");
const { getDB } = require("../lib/db");
const { aplicarCORS } = require("../lib/cors");

const ERROR_CREDENCIALES = { error: "Email o contraseña incorrectos." };

module.exports = async function handler(peticion, respuesta) {
  aplicarCORS(peticion, respuesta);
  if (peticion.method === "OPTIONS") return respuesta.status(204).end();
  if (peticion.method !== "POST") return respuesta.status(405).json({ error: "Método no permitido." });

  try {
    const { email, password } = peticion.body || {};
    if (!email || !password) {
      return respuesta.status(401).json(ERROR_CREDENCIALES);
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const db = getDB();

    const resultado = await db.execute({
      sql: "SELECT id, nombre, email, password_hash, plan, metodo_pago, creado_en, activo FROM usuarios WHERE email = ?",
      args: [emailNormalizado],
    });

    const fila = resultado.rows[0];
    if (!fila) {
      return respuesta.status(401).json(ERROR_CREDENCIALES); // no revela si el email existe o no
    }

    const coincide = await bcrypt.compare(password, fila.password_hash);
    if (!coincide) {
      return respuesta.status(401).json(ERROR_CREDENCIALES); // mismo mensaje que "email no existe"
    }

    const { password_hash, ...usuario } = fila;
    return respuesta.status(200).json({ usuario: { ...usuario, activo: !!usuario.activo } });
  } catch (err) {
    console.error("Error en /api/login:", err);
    return respuesta.status(500).json({ error: "Error inesperado del servidor. Intenta de nuevo." });
  }
};
