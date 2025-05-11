const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");

const DICCIONARIO = {
  sanguchería: ["completo", "vienesa", "lomito", "sándwich", "sandwich", "hamburguesa", "burger", "hot dog"],
  panadería: ["pan", "panadería", "marraqueta", "hallulla", "baguette", "molde", "bollito"],
  supermercado: ["supermercado", "lider", "santa isabel", "tottus", "acuenta", "unimarc"],
  botillería: ["botillería", "licores", "cerveza", "alcohol", "vino", "ron", "pisco", "whisky"],
  bar: ["bar", "pub", "cervecería", "tragos", "mojito", "mohito", "happy hour"],
  pizza: ["pizza", "pepperoni", "napolitana", "mozarella"],
  sushi: ["sushi", "sashimi", "maki", "nigiri", "japonés", "japonesa"],
  pollo: ["pollo", "broaster", "nuggets", "frito", "brasa"],
  cafe: ["café", "coffee", "starbucks", "capuchino", "espresso"],
  latina: ["empanada", "humita", "pastel de choclo", "porotos", "cazuela", "comida chilena", "comida peruana", "comida casera"],
  franquicia: ["kfc", "doggis", "juan maestro", "domino", "mcdonalds", "burger king", "dunkin", "papa johns", "subway"],
  pasteleria: ["pastel", "kuchen", "torta", "brownie", "postre", "galleta", "dulce"],
  helado: ["helado", "gelato", "paleta", "nieve"],
  waffle: ["waffle", "goffre"]
};

const TODAS_LAS_CLAVES = Object.values(DICCIONARIO).flat();

function detectarClaves(fraseUsuario) {
  const palabras = fraseUsuario.toLowerCase().split(/\s+/);
  const clavesDetectadas = new Set();

  for (const palabra of palabras) {
    const coincidencias = stringSimilarity.findBestMatch(palabra, TODAS_LAS_CLAVES).ratings
      .filter(r => r.rating >= 0.8)
      .sort((a, b) => b.rating - a.rating)
      .map(r => r.target);

    if (coincidencias.length > 0) {
      clavesDetectadas.add(coincidencias[0]);
    }
  }
  return Array.from(clavesDetectadas);
}

function clasificar(fraseUsuario) {
  const rutaJSON = path.join(__dirname, "../Bot_PedidosYa/pedidosya_datos_quilpue.json");
  const jsonData = JSON.parse(fs.readFileSync(rutaJSON, "utf-8"));
  const claves = detectarClaves(fraseUsuario);

  const tiposDetectados = new Set();
  claves.forEach((clave) => {
    for (const [tipo, palabras] of Object.entries(DICCIONARIO)) {
      if (palabras.includes(clave)) {
        tiposDetectados.add(tipo);
      }
    }
  });

  const resultados = jsonData.filter((negocio) => {
    const texto = (
      negocio.nombre + " " +
      (negocio.descripcion || "") + " " +
      (negocio.categorias || []).join(" ") + " " +
      (negocio.tags || []).join(" ")
    ).toLowerCase();

    return (
      claves.some((clave) => texto.includes(clave)) ||
      tiposDetectados.has(negocio.tipoDetectado)
    );
  });

  console.log("📝 Frase recibida:", fraseUsuario);
  console.log("🔑 Claves detectadas:", claves);
  console.log("📦 Tipos sugeridos:", Array.from(tiposDetectados));
  console.log("✅ Resultados encontrados:", resultados.length);

  return resultados;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { texto } = req.body;
      const resultado = clasificar(texto);
      res.status(200).json(resultado);
    } catch (err) {
      console.error("❌ Error en clasificador:", err);
      res.status(500).json({ error: "Error al clasificar" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
