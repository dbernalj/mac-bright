// Generado a partir de definiciones/02-menu.md, 03-galeria.md, 04-detalle.md, 05-registro.md y 06-ocasiones.md
// Para cambiar contenido: edita el .md correspondiente y pide regenerar este archivo.

const CATEGORIAS = [
  { id: "ojos", nombre: "Ojos", icono: "👁️" },
  { id: "labios", nombre: "Labios", icono: "💋" },
  { id: "pestanas", nombre: "Pestañas", icono: "👀" },
  { id: "mejillas", nombre: "Mejillas", icono: "😊" },
  { id: "cejas", nombre: "Cejas", icono: "🖊️" },
];

const OCASIONES = [
  { id: "colegio", nombre: "Colegio / Universidad", icono: "🎒" },
  { id: "fiesta", nombre: "Fiesta / Noche", icono: "🎉" },
  { id: "adolescente", nombre: "Adolescente", icono: "🌱" },
  { id: "evento", nombre: "Evento especial", icono: "👑" },
];

const PLANES = [
  { id: "mensual", nombre: "Plan Mensual", precioTexto: "$9.900 COP / mes" },
];

const METODOS_PAGO = [
  { id: "nequi", nombre: "Nequi" },
  { id: "bre-b", nombre: "Bre-B" },
  { id: "transferencia", nombre: "Transferencia bancaria" },
  { id: "efectivo", nombre: "Efectivo" },
];

const LOOKS = [
  { id: "ojos-1", categoria: "ojos", nombre: "Look elegante con sombras", videoId: "McEWLLVGlgw", materiales: "Sombras neutras, brocha difuminadora, delineador líquido.", gratis: true, ocasion: ["colegio", "fiesta"] },
  { id: "ojos-2", categoria: "ojos", nombre: "Ojos encapotados", videoId: "Rk47nBXWViI", materiales: "Sombra oscura, delineador, rizador de pestañas.", gratis: false, ocasion: ["evento", "colegio"] },
  { id: "ojos-3", categoria: "ojos", nombre: "Look natural del día", videoId: "bWGhom5jUXs", materiales: "Sombra clara, delineador suave, máscara de pestañas.", gratis: false, ocasion: ["colegio", "adolescente"] },

  { id: "labios-1", categoria: "labios", nombre: "Labios perfectos clásico", videoId: "AFRi-TU1iHM", materiales: "Lápiz delineador para labios, labial mate.", gratis: true, ocasion: ["colegio", "fiesta"] },
  { id: "labios-2", categoria: "labios", nombre: "Lip combo con gloss", videoId: "fe_xvldKIpk", materiales: "Lápiz labial, labial líquido, gloss.", gratis: false, ocasion: ["adolescente", "fiesta"] },
  { id: "labios-3", categoria: "labios", nombre: "Según la forma de tus labios", videoId: "o0Z0oNEGQVI", materiales: "Delineador, labial, corrector para contornear.", gratis: false, ocasion: ["adolescente", "evento"] },

  { id: "pestanas-1", categoria: "pestanas", nombre: "Rímel básico", videoId: "MAM3pGFlhKk", materiales: "Rímel, rizador de pestañas.", gratis: true, ocasion: ["colegio", "adolescente"] },
  { id: "pestanas-2", categoria: "pestanas", nombre: "Pestañas naturales largas", videoId: "UMzKuHkTOEM", materiales: "Rímel de fibras, rizador de pestañas, primer.", gratis: false, ocasion: ["colegio", "evento"] },
  { id: "pestanas-3", categoria: "pestanas", nombre: "Pestañas individuales", videoId: "CYt9qj_megM", materiales: "Pestañas postizas individuales, pegamento, pinza.", gratis: false, ocasion: ["fiesta", "evento"] },

  { id: "mejillas-1", categoria: "mejillas", nombre: "Rubor básico", videoId: "8Ex8OHGuTJM", materiales: "Rubor en polvo, brocha para rubor.", gratis: true, ocasion: ["colegio", "adolescente"] },
  { id: "mejillas-2", categoria: "mejillas", nombre: "Rubor según tu tipo de cara", videoId: "BBQxrHq3y-I", materiales: "Rubor, brocha angulada, espejo.", gratis: false, ocasion: ["adolescente"] },
  { id: "mejillas-3", categoria: "mejillas", nombre: "Técnicas y estilos de blush", videoId: "_lFMIC8RgrA", materiales: "Rubor en crema y en polvo, brocha, esponja.", gratis: false, ocasion: ["fiesta", "adolescente"] },

  { id: "cejas-1", categoria: "cejas", nombre: "Look natural del día", videoId: "W-jJH767E1w", materiales: "Lápiz para cejas, gel fijador.", gratis: true, ocasion: ["colegio", "adolescente"] },
  { id: "cejas-2", categoria: "cejas", nombre: "Delinear y rellenar", videoId: "QHmLQPBfVEE", materiales: "Lápiz, sombra para cejas, brocha angulada.", gratis: false, ocasion: ["fiesta", "evento"] },
  { id: "cejas-3", categoria: "cejas", nombre: "Técnica con lápiz", videoId: "0_2TH633vO8", materiales: "Lápiz para cejas, cepillo espiral.", gratis: false, ocasion: ["adolescente", "colegio"] },
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

function getOcasion(ocasionId) {
  return OCASIONES.find((o) => o.id === ocasionId);
}

function getLooksPorOcasion(ocasionId) {
  return LOOKS.filter((l) => l.ocasion.includes(ocasionId));
}

function esLookGratis(lookId) {
  const look = getLook(lookId);
  return !!look && look.gratis === true;
}

function miniaturaUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function embedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}
