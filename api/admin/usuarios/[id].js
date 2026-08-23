const bcrypt = require("bcryptjs");
const { getDB } = require("../../../lib/db");
const { aplicarCORS } = require("../../../lib/cors");
const { esAdminValido } = require("../../../lib/admin-auth");

module.exports = async function handler(peticion, respuesta) {
  aplicarCORS(peticion, respuesta);
  if (peticion.method === "OPTIONS") return respuesta.status(204).end();
  if (!esAdminValido(peticion)) {
    return respuesta.status(401).json({ error: "Contraseña de administrador incorrecta." });
  }

  const id = peticion.query.id;
  const db = getDB();

  try {
    if (peticion.method === "PATCH") {
      const { activo, password } = peticion.body || {};

      if (typeof activo === "boolean") {
        await db.execute({ sql: "UPDATE usuarios SET activo = ? WHERE id = ?", args: [activo ? 1 : 0, id] });
        return respuesta.status(200).json({ ok: true });
      }

      if (typeof password === "string" && password.length >= 6) {
        const hash = await bcrypt.hash(password, 10);
        await db.execute({ sql: "UPDATE usuarios SET password_hash = ? WHERE id = ?", args: [hash, id] });
        return respuesta.status(200).json({ ok: true });
      }

      return respuesta.status(400).json({ error: "Nada para actualizar: envía 'activo' (boolean) o 'password' (min. 6 caracteres)." });
    }

    if (peticion.method === "DELETE") {
      await db.execute({ sql: "DELETE FROM usuarios WHERE id = ?", args: [id] });
      return respuesta.status(200).json({ ok: true });
    }

    return respuesta.status(405).json({ error: "Método no permitido." });
  } catch (err) {
    console.error("Error en /api/admin/usuarios/[id]:", err);
    return respuesta.status(500).json({ error: "Error inesperado del servidor." });
  }
};
