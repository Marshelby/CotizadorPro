// utils/motorBusqueda.js

const DICCIONARIO = {
  completos: ["completo", "italiano", "vienesa", "hot dog"],
  hamburguesas: ["hamburguesa", "burger", "cheeseburger"],
  sushi: ["sushi", "roll", "japonés"],
  pizzas: ["pizza", "pizzería", "mozarella"],
  empanadas: ["empanada", "empanadas"],
  postres: ["postre", "torta", "pastel", "kuchen", "dulce"],
  helados: ["helado", "ice cream"],
  pollo: ["pollo", "broaster", "frito", "asado"],
  panaderia: ["pan", "panadería", "marraqueta", "hallulla", "baguette"],
  cafeteria: ["café", "cafetería", "desayuno", "latte"],
  ensaladas: ["ensalada", "vegano", "vegetariano"],
  jugos: ["jugo", "licuado", "natural"],
  comida_china: ["china", "arroz chaufan", "chino"],
  comida_mexicana: ["mexicana", "burrito", "taco", "nachos"],
  comida_peruana: ["peruana", "ceviche", "pollo a la brasa"],
  poke: ["poke", "bowls"],
  wraps: ["wrap", "envoltura"],
  sandwiches: ["sándwich", "churrasco", "lomito", "barros"],
  comida_venezolana: ["venezolana", "arepa", "tequeño", "pabellón"],
};

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

function detectarTipoBusqueda(texto) {
  const limpio = normalizar(texto);
  for (const [categoria, palabras] of Object.entries(DICCIONARIO)) {
    if (palabras.some(p => limpio.includes(p))) {
      return categoria;
    }
  }
  return null;
}

function filtrarPorTipo(tipo, negocios) {
  if (!tipo) return [];
  return negocios.filter(neg =>
    (neg.categorias_principales || []).some(cat =>
      cat.toLowerCase().includes(tipo.replace("_", " "))
    )
  );
}

module.exports = {
  detectarTipoBusqueda,
  filtrarPorTipo,
  DICCIONARIO
};