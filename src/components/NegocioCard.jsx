
import React from "react";

const iconoUbicacion = "📍";
const iconoFavorito = "❤️";
const iconoNoFavorito = "🤍";

const NegocioCard = ({ negocio, favoritos, alternarFavorito, onClick }) => {
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
    icono_categoria,
    url_pedidosya,
    imagen,
  } = negocio;

  const esFavorito = favoritos.includes(nombre);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4 cursor-pointer flex flex-col justify-between"
      onClick={onClick}
    >
      <img
        src={imagen || "/icons/shop_placeholder.png"}
        alt={nombre}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      <h2 className="text-lg font-bold text-gray-800">{nombre}</h2>
      <p className="text-sm text-gray-600">
        {iconoUbicacion} {direccion || "Dirección no disponible"}
      </p>

      {distancia && (
        <p className="text-sm text-gray-500 mt-1">📏 {distancia.toFixed(1)} km</p>
      )}

      <p className="text-sm text-gray-600 mt-1">
        🏷️ {categoria || "Categoría no especificada"}
      </p>

      {rating && (
        <p className="text-sm text-yellow-600 mt-1">
          ⭐ {rating} ({reseñas || 0} reseñas)
        </p>
      )}

      {precio && (
        <p className="text-sm text-green-600 mt-1">💵 {precio}</p>
      )}

      {metodos_pago && metodos_pago.length > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          💳 Acepta: {metodos_pago.join(", ")}
        </p>
      )}

      {delivery && (
        <p className="text-sm text-blue-500 mt-1">
          🚚 Disponible en {delivery}
        </p>
      )}

      {url_pedidosya && (
        <a
          href={url_pedidosya}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 mt-2 underline"
          onClick={(e) => e.stopPropagation()}
        >
          Ver en PedidosYa
        </a>
      )}

      <div className="mt-3 flex justify-between items-center">
        <button
          className="text-sm text-rose-500"
          onClick={(e) => {
            e.stopPropagation();
            alternarFavorito(nombre);
          }}
        >
          {esFavorito ? iconoFavorito + " Quitar de favoritos" : iconoNoFavorito + " Agregar a favoritos"}
        </button>
        <span className="text-xs text-gray-400 italic">Haz clic para más info</span>
      </div>
    </div>
  );
};

export default NegocioCard;
