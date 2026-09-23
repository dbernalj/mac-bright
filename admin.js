// El sitio y la API se sirven juntos desde Vercel (incluido macbright.club): ahi alcanza una ruta relativa.
// Desde GitHub Pages o localhost hay que llamar a la URL completa de la API.
const HOSTS_CON_API_PROPIA = ["macbright.club", "www.macbright.club"];
const API_BASE_URL =
  HOSTS_CON_API_PROPIA.includes(location.hostname) || location.hostname.endsWith(".vercel.app")
    ? "/api"
    : "https://mac-bright.vercel.app/api";
const CLAVE_SESSION_ADMIN = "mac-bright-admin-password";

function formatearFecha(texto) {
  if (!texto) return "";
  return texto.replace("T", " ").slice(0, 16);
}

async function pedirUsuarios(claveAdmin) {
  const respuesta = await fetch(`${API_BASE_URL}/admin/usuarios`, {
    headers: { "X-Admin-Password": claveAdmin },
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    const error = new Error(datos.error || "No se pudo cargar la lista de usuarios.");
    error.status = respuesta.status;
    throw error;
  }
  return datos.usuarios;
}

async function actualizarUsuario(id, cambios) {
  const claveAdmin = sessionStorage.getItem(CLAVE_SESSION_ADMIN);
  const respuesta = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-Admin-Password": claveAdmin },
    body: JSON.stringify(cambios),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo actualizar el usuario.");
}

async function eliminarUsuario(id) {
  const claveAdmin = sessionStorage.getItem(CLAVE_SESSION_ADMIN);
  const respuesta = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Password": claveAdmin },
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo eliminar el usuario.");
}

function renderTabla(usuarios) {
  const cuerpo = document.getElementById("cuerpo-tabla");
  const vacia = document.getElementById("tabla-vacia");
  cuerpo.innerHTML = "";

  vacia.classList.toggle("oculto", usuarios.length > 0);

  usuarios.forEach((usuario) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td>${usuario.plan}</td>
      <td>${usuario.metodo_pago}</td>
      <td>${formatearFecha(usuario.creado_en)}</td>
      <td><span class="estado ${usuario.activo ? "estado-activo" : "estado-pendiente"}">${usuario.activo ? "Activo" : "Pendiente"}</span></td>
    `;

    const celdaAcciones = document.createElement("td");
    celdaAcciones.className = "celda-acciones";

    const btnActivar = document.createElement("button");
    btnActivar.className = "boton-accion";
    btnActivar.textContent = usuario.activo ? "Desactivar" : "Activar";
    btnActivar.addEventListener("click", () => alternarActivo(usuario));
    celdaAcciones.appendChild(btnActivar);

    const btnReset = document.createElement("button");
    btnReset.className = "boton-accion";
    btnReset.textContent = "Resetear contraseña";
    btnReset.addEventListener("click", () => resetearPasswordUsuario(usuario));
    celdaAcciones.appendChild(btnReset);

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "boton-accion boton-peligro";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarUsuarioConfirmando(usuario));
    celdaAcciones.appendChild(btnEliminar);

    fila.appendChild(celdaAcciones);
    cuerpo.appendChild(fila);
  });
}

async function cargarYRenderizar() {
  const claveAdmin = sessionStorage.getItem(CLAVE_SESSION_ADMIN);
  const elementoError = document.getElementById("usuarios-error");
  elementoError.textContent = "";
  try {
    const usuarios = await pedirUsuarios(claveAdmin);
    renderTabla(usuarios);
  } catch (err) {
    if (err.status === 401) {
      salir();
      document.getElementById("acceso-error").textContent = "Contraseña de administrador incorrecta.";
      return;
    }
    elementoError.textContent = err.message;
  }
}

async function alternarActivo(usuario) {
  try {
    await actualizarUsuario(usuario.id, { activo: !usuario.activo });
    await cargarYRenderizar();
  } catch (err) {
    document.getElementById("usuarios-error").textContent = err.message;
  }
}

async function resetearPasswordUsuario(usuario) {
  const nueva = window.prompt(`Nueva contraseña para ${usuario.email} (mínimo 6 caracteres):`);
  if (nueva === null) return;
  if (nueva.length < 6) {
    window.alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }
  try {
    await actualizarUsuario(usuario.id, { password: nueva });
    window.alert(`Contraseña actualizada para ${usuario.email}.`);
  } catch (err) {
    document.getElementById("usuarios-error").textContent = err.message;
  }
}

async function eliminarUsuarioConfirmando(usuario) {
  const confirmado = window.confirm(`¿Eliminar la cuenta de ${usuario.nombre} (${usuario.email})? Esto no se puede deshacer.`);
  if (!confirmado) return;
  try {
    await eliminarUsuario(usuario.id);
    await cargarYRenderizar();
  } catch (err) {
    document.getElementById("usuarios-error").textContent = err.message;
  }
}

function mostrarPanelUsuarios() {
  document.getElementById("panel-acceso").classList.add("oculto");
  document.getElementById("panel-usuarios").classList.remove("oculto");
}

function salir() {
  sessionStorage.removeItem(CLAVE_SESSION_ADMIN);
  document.getElementById("panel-usuarios").classList.add("oculto");
  document.getElementById("panel-acceso").classList.remove("oculto");
  document.getElementById("cuerpo-tabla").innerHTML = "";
}

async function entrar() {
  const boton = document.getElementById("btn-entrar");
  const elementoError = document.getElementById("acceso-error");
  const password = document.getElementById("admin-password").value;
  elementoError.textContent = "";

  if (!password) {
    elementoError.textContent = "Ingresa la contraseña de administrador.";
    return;
  }

  boton.disabled = true;
  try {
    const usuarios = await pedirUsuarios(password);
    sessionStorage.setItem(CLAVE_SESSION_ADMIN, password);
    mostrarPanelUsuarios();
    renderTabla(usuarios);
  } catch (err) {
    elementoError.textContent = err.status === 401 ? "Contraseña de administrador incorrecta." : err.message;
  } finally {
    boton.disabled = false;
  }
}

document.getElementById("btn-entrar").addEventListener("click", entrar);
document.getElementById("admin-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") entrar();
});
document.getElementById("btn-recargar").addEventListener("click", cargarYRenderizar);
document.getElementById("btn-salir").addEventListener("click", salir);

if (sessionStorage.getItem(CLAVE_SESSION_ADMIN)) {
  mostrarPanelUsuarios();
  cargarYRenderizar();
}
