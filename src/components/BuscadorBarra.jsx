import React from "react";

export default function BuscadorBarra({
  busqueda,
  setBusqueda,
  onBuscar,
  mostrarMapa,
  setMostrarMapa,
}) {
  return (
    <div className="max-w-4xl mx-auto mb-2 flex items-center justify-between gap-4">
      <input
        type="text"
        placeholder="Ej: quiero pan, sushi, completos..."
        className="w-full p-3 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg transition duration-300"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <button
        onClick={onBuscar}
        className="px-5 py-2 bg-sky-500 text-white rounded-full shadow hover:bg-sky-600"
      >
        Buscar
      </button>
      <button
        onClick={() => setMostrarMapa((prev) => !prev)}
        className="px-4 py-2 border rounded-full shadow"
      >
        {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
      </button>
    </div>
  );
}
