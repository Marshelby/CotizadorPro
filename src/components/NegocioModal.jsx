import React from "react";

const NegocioModal = ({ negocio, favoritos, alternarFavorito, onClose }) => {
  if (!negocio) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full animate-scale-fade"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={negocio.imagen}
          alt={negocio.nombre}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{negocio.nombre}</h2>
        <p className="text-sm text-gray-600">📍 {negocio.direccion}</p>
        <p className="text-sm text-gray-500">💰 ⭐ {negocio.rating || "Sin calificación"} ({negocio.reseñas || 0} reseñas)</p>
        <p className="text-sm text-gray-500">{negocio.rangoPrecio}</p>
        <p className="text-sm text-gray-500">{negocio.categoria}</p>
        <a
          href={negocio.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 text-sm inline-block mt-2 hover:underline"
        >
          Ver en Google Maps
        </a>
        <button
          onClick={() => alternarFavorito(negocio.nombre)}
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
    </div>
  );
};

export default NegocioModal;
