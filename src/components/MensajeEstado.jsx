import React from "react";

export default function MensajeEstado({ tipo = "info", mensaje }) {
  const estilos = {
    info: "text-gray-500",
    error: "text-red-500",
    loading: "text-blue-500 animate-pulse",
    empty: "text-gray-400 italic",
  };

  const iconos = {
    info: "ℹ️",
    error: "❌",
    loading: "⏳",
    empty: "🔍",
  };

  return (
    <div className={`text-center mt-10 ${estilos[tipo] || estilos.info}`}>
      <div className="text-2xl">{iconos[tipo] || "ℹ️"}</div>
      <p className="mt-2">{mensaje}</p>
    </div>
  );
}
