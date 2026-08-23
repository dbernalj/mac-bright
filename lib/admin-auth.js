function esAdminValido(peticion) {
  const clave = peticion.headers["x-admin-password"];
  return !!clave && !!process.env.ADMIN_PASSWORD && clave === process.env.ADMIN_PASSWORD;
}

module.exports = { esAdminValido };
