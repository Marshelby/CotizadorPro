const stringSimilarity = require("string-similarity");

export default function handler(req, res) {
  // 🛡️ Habilitar CORS para permitir solicitudes desde cualquier dominio
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejo de preflight CORS
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const { busqueda, negocios } = JSON.parse(body);

      if (!busqueda || !negocios) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
      }

      const resultados = negocios.filter((n) => {
        const campos = [n.nombre, n.producto, n.tipo].join(" ").toLowerCase();
        return campos.includes(busqueda.toLowerCase()) ||
               stringSimilarity.compareTwoStrings(busqueda.toLowerCase(), campos) > 0.4;
      });

      res.status(200).json({ resultados });
    } catch (err) {
      console.error("❌ Error en /api/clasificar:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
}
