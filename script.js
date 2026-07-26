const estado = {
  categoriaId: null,
  lookId: null,
};

function mostrarPantalla(id) {
  document.querySelectorAll(".pantalla-vista").forEach((el) => {
    el.classList.toggle("activa", el.id === id);
  });
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

function abrirGaleria(categoriaId) {
  estado.categoriaId = categoriaId;

  const categoria = getCategoria(categoriaId);
  document.getElementById("titulo-galeria").textContent = categoria.nombre;

  const grid = document.getElementById("grid-galeria");
  grid.innerHTML = "";

  getLooksPorCategoria(categoriaId).forEach((look) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-look";
    tarjeta.innerHTML = `
      <img src="${miniaturaUrl(look.videoId)}" alt="${look.nombre}" />
      <div class="nombre-look">${look.nombre}</div>
    `;
    tarjeta.addEventListener("click", () => abrirDetalle(look.id));
    grid.appendChild(tarjeta);
  });

  mostrarPantalla("pantalla-galeria");
}

function detenerVideo() {
  // Quitar el iframe (no solo ocultarlo) para que el video/audio se detenga de verdad.
  document.getElementById("contenedor-video").innerHTML = "";
}

function abrirDetalle(lookId) {
  const look = getLook(lookId);
  estado.lookId = lookId;
  estado.categoriaId = look.categoria;

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

document.getElementById("btn-registrarse").addEventListener("click", () => mostrarPantalla("pantalla-menu"));
document.getElementById("btn-continuar").addEventListener("click", () => mostrarPantalla("pantalla-menu"));

document.getElementById("buscador").addEventListener("input", (e) => renderCategorias(e.target.value));

document.querySelectorAll(".boton-atras[data-atras]").forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(boton.dataset.atras));
});

document.getElementById("btn-atras-detalle").addEventListener("click", () => {
  detenerVideo();
  abrirGaleria(estado.categoriaId);
});

document.getElementById("btn-ver-video").addEventListener("click", verVideo);

renderCategorias();
