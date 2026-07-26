// Generado a partir de definiciones/02-menu.md, 03-galeria.md y 04-detalle.md
// Para cambiar contenido: edita el .md correspondiente y pide regenerar este archivo.

const CATEGORIAS = [
  { id: "ojos", nombre: "Ojos", icono: "👁️" },
  { id: "labios", nombre: "Labios", icono: "💋" },
  { id: "pestanas", nombre: "Pestañas", icono: "👀" },
  { id: "mejillas", nombre: "Mejillas", icono: "🐿️" },
  { id: "cejas", nombre: "Cejas", icono: "🖊️" },
];

const LOOKS = [
  { id: "ojos-1", categoria: "ojos", nombre: "Look elegante con sombras", videoId: "McEWLLVGlgw", materiales: "Sombras neutras, brocha difuminadora, delineador líquido." },
  { id: "ojos-2", categoria: "ojos", nombre: "Ojos encapotados", videoId: "Rk47nBXWViI", materiales: "Sombra oscura, delineador, rizador de pestañas." },
  { id: "ojos-3", categoria: "ojos", nombre: "Look natural del día", videoId: "bWGhom5jUXs", materiales: "Sombra clara, delineador suave, máscara de pestañas." },

  { id: "labios-1", categoria: "labios", nombre: "Labios perfectos clásico", videoId: "AFRi-TU1iHM", materiales: "Lápiz delineador para labios, labial mate." },
  { id: "labios-2", categoria: "labios", nombre: "Lip combo con gloss", videoId: "fe_xvldKIpk", materiales: "Lápiz labial, labial líquido, gloss." },
  { id: "labios-3", categoria: "labios", nombre: "Según la forma de tus labios", videoId: "o0Z0oNEGQVI", materiales: "Delineador, labial, corrector para contornear." },

  { id: "pestanas-1", categoria: "pestanas", nombre: "Rímel básico", videoId: "MAM3pGFlhKk", materiales: "Rímel, rizador de pestañas." },
  { id: "pestanas-2", categoria: "pestanas", nombre: "Pestañas naturales largas", videoId: "UMzKuHkTOEM", materiales: "Rímel de fibras, rizador de pestañas, primer." },
  { id: "pestanas-3", categoria: "pestanas", nombre: "Pestañas individuales", videoId: "CYt9qj_megM", materiales: "Pestañas postizas individuales, pegamento, pinza." },

  { id: "mejillas-1", categoria: "mejillas", nombre: "Rubor básico", videoId: "8Ex8OHGuTJM", materiales: "Rubor en polvo, brocha para rubor." },
  { id: "mejillas-2", categoria: "mejillas", nombre: "Según tu tipo de cara", videoId: "BBQxrHq3y-I", materiales: "Rubor, brocha angulada, espejo." },
  { id: "mejillas-3", categoria: "mejillas", nombre: "Técnicas y estilos de blush", videoId: "_lFMIC8RgrA", materiales: "Rubor en crema y en polvo, brocha, esponja." },

  { id: "cejas-1", categoria: "cejas", nombre: "Look natural del día", videoId: "W-jJH767E1w", materiales: "Lápiz para cejas, gel fijador." },
  { id: "cejas-2", categoria: "cejas", nombre: "Delinear y rellenar", videoId: "QHmLQPBfVEE", materiales: "Lápiz, sombra para cejas, brocha angulada." },
  { id: "cejas-3", categoria: "cejas", nombre: "Técnica con lápiz", videoId: "0_2TH633vO8", materiales: "Lápiz para cejas, cepillo espiral." },
];

function getCategoria(categoriaId) {
  return CATEGORIAS.find((c) => c.id === categoriaId);
}

function getLooksPorCategoria(categoriaId) {
  return LOOKS.filter((l) => l.categoria === categoriaId);
}

function getLook(lookId) {
  return LOOKS.find((l) => l.id === lookId);
}

function miniaturaUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}
