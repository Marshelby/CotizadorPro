
import React from "react";

const NegocioModal = ({ negocio, onClose, favoritos, alternarFavorito }) => {
  if (!negocio) return null;

  const {
    nombre,
    direccion,
    categoria,
    rating,
    reseñas,
    precio,
    distancia,
    metodos_pago,
    delivery,
    url_pedidosya,
    url_googlemaps,
    horarios,
    imagen,
  } = negocio;

  const esFavorito = favoritos.includes(nombre);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <img
          src={imagen || "/icons/shop_placeholder.png"}
          alt={nombre}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{nombre}</h2>

        <p className="text-sm text-gray-600 mb-1">📍 {direccion || "Dirección no disponible"}</p>
        {distancia && (
          <p className="text-sm text-gray-500 mb-1">📏 Distancia: {distancia.toFixed(1)} km</p>
        )}
        {horarios && (
          <p className="text-sm text-gray-600 mb-1">🕐 Horarios: {horarios}</p>
        )}
        {precio && (
          <p className="text-sm text-green-600 mb-1">💸 {precio}</p>
        )}
        {rating && (
          <p className="text-sm text-yellow-600 mb-1">
            ⭐ {rating} ({reseñas || 0} reseñas)
          </p>
        )}
        {metodos_pago && metodos_pago.length > 0 && (
          <p className="text-sm text-gray-500 mb-1">
            💳 Métodos de pago: {metodos_pago.join(", ")}
          </p>
        )}
        <p className="text-sm text-gray-600 mb-1">🏷️ Categoría: {categoria}</p>
        {delivery && (
          <p className="text-sm text-blue-500 mb-1">🚚 Disponible en {delivery}</p>
        )}

        <div className="mt-4 flex justify-between items-center">
          {url_googlemaps && (
            <a
              href={url_googlemaps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline"
            >
              Ver en Google Maps
            </a>
          )}
          {url_pedidosya && (
            <a
              href={url_pedidosya}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline"
            >
              Ver en PedidosYa
            </a>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="text-sm text-rose-500"
            onClick={(e) => {
              e.stopPropagation();
              alternarFavorito(nombre);
            }}
          >
            {esFavorito ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NegocioModal;
