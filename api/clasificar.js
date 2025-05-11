const clasificador = require("./clasificador.cjs");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const parsed = JSON.parse(body);
      const resultados = clasificador.clasificar(parsed.texto);
      res.status(200).json(resultados);
    });
  } catch (err) {
    console.error("❌ Error en /api/clasificar:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
