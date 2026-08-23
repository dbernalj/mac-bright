const API_BASE_URL = "https://mac-bright-api.vercel.app/api"; // ajustar tras el primer deploy en Vercel
const CLAVE_STORAGE_USUARIO = "mac-bright-usuario";

const estado = {
  categoriaId: null,
  ocasionId: null,
  origenGaleria: "categoria", // "categoria" | "ocasion" — de dónde vino la Galería actual
  lookId: null,
  usuario: null, // { id, nombre, email, plan, metodo_pago } cuando hay sesión iniciada
  premium: false,
  planSeleccionadoId: PLANES[0].id,
  metodoPagoId: "nequi",
};

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla-vista").forEach((el) => {
    el.classList.toggle("activa", el.id === id);
  });
}

function lookDesbloqueado(lookId) {
  return estado.premium || esLookGratis(lookId);
}

function guardarSesion(usuario) {
  estado.usuario = usuario;
  estado.premium = true; // toda cuenta registrada/logueada tiene la suscripción activa en este prototipo
  localStorage.setItem(CLAVE_STORAGE_USUARIO, JSON.stringify(usuario));
}

function restaurarSesion() {
  const guardado = localStorage.getItem(CLAVE_STORAGE_USUARIO);
  if (!guardado) return false;
  try {
    estado.usuario = JSON.parse(guardado);
    estado.premium = true;
    return true;
  } catch {
    localStorage.removeItem(CLAVE_STORAGE_USUARIO);
    return false;
  }
}

function renderCategorias(filtro = "") {
  const contenedor = document.getElementById("lista-categorias");
  contenedor.innerHTML = "";

  const filtroNormalizado = filtro.trim().toLowerCase();
  const categoriasFiltradas = CATEGORIAS.filter((c) =>
    c.nombre.toLowerCase().includes(filtroNormalizado)
  );

  categoriasFiltradas.forEach((categoria) => {
    const item = document.createElement("div");
    item.className = "item-categoria";
    item.innerHTML = `
      <span class="icono">${categoria.icono}</span>
      <span class="nombre">${categoria.nombre}</span>
    `;
    item.addEventListener("click", () => abrirGaleria(categoria.id));
    contenedor.appendChild(item);
  });
}

function renderOcasiones() {
  const contenedor = document.getElementById("lista-ocasiones");
  contenedor.innerHTML = "";

  OCASIONES.forEach((ocasion) => {
    const chip = document.createElement("div");
    chip.className = "chip-ocasion";
    chip.innerHTML = `
      <span class="icono">${ocasion.icono}</span>
      <span class="nombre">${ocasion.nombre}</span>
    `;
    chip.addEventListener("click", () => abrirGaleriaPorOcasion(ocasion.id));
    contenedor.appendChild(chip);
  });
}

function pintarGridLooks(looks) {
  const grid = document.getElementById("grid-galeria");
  grid.innerHTML = "";

  looks.forEach((look) => {
    const bloqueado = !lookDesbloqueado(look.id);
    const tarjeta = document.createElement("div");
    tarjeta.className = bloqueado ? "tarjeta-look tarjeta-bloqueada" : "tarjeta-look";
    tarjeta.innerHTML = `
      <div class="miniatura-look">
        <img src="${miniaturaUrl(look.videoId)}" alt="${look.nombre}" />
        ${bloqueado ? '<span class="candado-look">🔒</span>' : ""}
      </div>
      <div class="nombre-look">${look.nombre}</div>
    `;
    tarjeta.addEventListener("click", () => {
      if (bloqueado) {
        abrirRegistro("Este look es exclusivo para suscriptores. Regístrate para verlo.");
      } else {
        abrirDetalle(look.id);
      }
    });
    grid.appendChild(tarjeta);
  });
}

function abrirGaleria(categoriaId) {
  estado.categoriaId = categoriaId;
  estado.ocasionId = null;
  estado.origenGaleria = "categoria";

  const categoria = getCategoria(categoriaId);
  document.getElementById("titulo-galeria").textContent = categoria.nombre;

  pintarGridLooks(getLooksPorCategoria(categoriaId));

  mostrarPantalla("pantalla-galeria");
}

function abrirGaleriaPorOcasion(ocasionId) {
  estado.ocasionId = ocasionId;
  estado.categoriaId = null;
  estado.origenGaleria = "ocasion";

  const ocasion = getOcasion(ocasionId);
  document.getElementById("titulo-galeria").textContent = ocasion.nombre;

  pintarGridLooks(getLooksPorOcasion(ocasionId));

  mostrarPantalla("pantalla-galeria");
}

function detenerVideo() {
  // Quitar el iframe (no solo ocultarlo) para que el video/audio se detenga de verdad.
  document.getElementById("contenedor-video").innerHTML = "";
}

function abrirDetalle(lookId) {
  const look = getLook(lookId);
  estado.lookId = lookId;

  document.getElementById("foto-grande").src = miniaturaUrl(look.videoId);
  document.getElementById("titulo-look").textContent = look.nombre;
  document.getElementById("texto-materiales").textContent = look.materiales;
  detenerVideo();

  mostrarPantalla("pantalla-detalle");
}

function verVideo() {
  const look = getLook(estado.lookId);
  const contenedor = document.getElementById("contenedor-video");
  contenedor.innerHTML = `<iframe src="${embedUrl(look.videoId)}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function renderPlanes() {
  const contenedor = document.getElementById("lista-planes");
  contenedor.innerHTML = "";

  PLANES.forEach((plan) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = plan.id === estado.planSeleccionadoId ? "tarjeta-plan seleccionada" : "tarjeta-plan";
    tarjeta.innerHTML = `
      <div class="nombre-plan">${plan.nombre}</div>
      <div class="precio-plan">${plan.precioTexto}</div>
    `;
    tarjeta.addEventListener("click", () => {
      estado.planSeleccionadoId = plan.id;
      renderPlanes();
    });
    contenedor.appendChild(tarjeta);
  });
}

function renderMetodosPago() {
  const contenedor = document.getElementById("lista-metodos-pago");
  contenedor.innerHTML = "";

  METODOS_PAGO.forEach((metodo) => {
    const chip = document.createElement("div");
    chip.className = metodo.id === estado.metodoPagoId ? "chip-metodo-pago seleccionado" : "chip-metodo-pago";
    chip.textContent = metodo.nombre;
    chip.addEventListener("click", () => {
      estado.metodoPagoId = metodo.id;
      renderMetodosPago();
    });
    contenedor.appendChild(chip);
  });
}

function abrirRegistro(mensaje = "") {
  document.getElementById("mensaje-registro").textContent = mensaje;
  document.getElementById("registro-error").textContent = "";
  mostrarPantalla("pantalla-registro");
}

async function confirmarRegistro() {
  const boton = document.getElementById("btn-confirmar-pago");
  const elementoError = document.getElementById("registro-error");
  elementoError.textContent = "";

  const nombre = document.getElementById("registro-nombre").value.trim();
  const email = document.getElementById("registro-email").value.trim();
  const password = document.getElementById("registro-password").value;

  if (!nombre || !email || !password || !estado.planSeleccionadoId || !estado.metodoPagoId) {
    elementoError.textContent = "Completa nombre, email, contraseña, plan y método de pago.";
    return;
  }

  boton.disabled = true;
  const textoOriginal = boton.textContent;
  boton.textContent = "Creando cuenta...";

  try {
    const respuesta = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        password,
        plan: estado.planSeleccionadoId,
        metodoPago: estado.metodoPagoId,
      }),
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      elementoError.textContent = datos.error || "No se pudo crear la cuenta. Intenta de nuevo.";
      return;
    }

    guardarSesion(datos.usuario);
    mostrarPantalla("pantalla-menu");
  } catch (err) {
    console.error("Error de red en confirmarRegistro:", err);
    elementoError.textContent = "No hay conexión con el servidor. Intenta de nuevo.";
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

async function iniciarSesion() {
  const boton = document.getElementById("btn-iniciar-sesion");
  const elementoError = document.getElementById("login-error");
  elementoError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    elementoError.textContent = "Ingresa tu email y contraseña.";
    return;
  }

  boton.disabled = true;
  const textoOriginal = boton.textContent;
  boton.textContent = "Entrando...";

  try {
    const respuesta = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      elementoError.textContent = datos.error || "No se pudo iniciar sesión.";
      return;
    }

    guardarSesion(datos.usuario);
    mostrarPantalla("pantalla-menu");
  } catch (err) {
    console.error("Error de red en iniciarSesion:", err);
    elementoError.textContent = "No hay conexión con el servidor. Intenta de nuevo.";
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

document.getElementById("btn-iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn-registrarse").addEventListener("click", () => abrirRegistro());
document.getElementById("btn-continuar").addEventListener("click", () => mostrarPantalla("pantalla-menu"));

document.getElementById("buscador").addEventListener("input", (e) => renderCategorias(e.target.value));

document.querySelectorAll(".boton-atras[data-atras]").forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(boton.dataset.atras));
});

document.getElementById("btn-atras-detalle").addEventListener("click", () => {
  detenerVideo();
  if (estado.origenGaleria === "ocasion") {
    abrirGaleriaPorOcasion(estado.ocasionId);
  } else {
    abrirGaleria(estado.categoriaId);
  }
});

document.getElementById("btn-ver-video").addEventListener("click", verVideo);
document.getElementById("btn-confirmar-pago").addEventListener("click", confirmarRegistro);

renderCategorias();
renderOcasiones();
renderPlanes();
renderMetodosPago();
if (restaurarSesion()) {
  mostrarPantalla("pantalla-menu");
}
