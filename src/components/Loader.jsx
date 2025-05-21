import React from "react";

export default function Loader({ mensaje = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10 text-blue-500 animate-pulse">
      <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}
