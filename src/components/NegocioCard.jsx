import React from "react";

const NegocioCard = ({ negocio, favoritos, alternarFavorito, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-4 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {negocio.imagen && (
        <img
          src={negocio.imagen}
          alt={negocio.nombre}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}
      <h3 className="font-semibold text-lg">{negocio.nombre}</h3>
      <p className="text-sm text-gray-600">📍 {negocio.direccion || "Dirección no disponible"}</p>
      <p className="text-sm text-gray-500">💰 ⭐ {negocio.rating || "Sin calificación"} ({negocio.reseñas || 0} reseñas)</p>
      <p className="text-sm text-gray-500">{negocio.rangoPrecio}</p>
      <p className="text-sm text-gray-500">{negocio.categoria}</p>
      <a
        href={negocio.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-600 text-sm mt-2 inline-block hover:underline"
      >
        Ver en Google Maps
      </a>
      <button
        onClick={(e) => {
          e.stopPropagation();
          alternarFavorito(negocio.nombre);
        }}
        className={`mt-2 text-sm px-3 py-1 rounded-full ${
          favoritos.includes(negocio.nombre)
            ? "bg-red-100 text-red-500"
            : "bg-rose-100 text-rose-500 hover:bg-rose-200"
        }`}
      >
        {favoritos.includes(negocio.nombre)
          ? "❤️ Favorito"
          : "🤍 Agregar a favoritos"}
      </button>
    </div>
  );
};

export default NegocioCard;
