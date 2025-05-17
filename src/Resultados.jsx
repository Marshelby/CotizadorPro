
import React, { useState, useEffect } from "react";
import negocios from "./data/locales_google.json";

const Resultados = () => {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    // Cargar datos y convertir estructura si es necesario
    const adaptados = negocios.map((n, i) => ({
      id: i,
      nombre: n.nombre || "Sin nombre",
      direccion: n.direccion || "Dirección no disponible",
      categoria: n.categoria || n.categoria_tienda || "Sin categoría",
      rating: n.rating || "Sin calificación",
      reseñas: n.reseñas || "0",
      rangoPrecio: n.rangoPrecio || "No informado",
      servicios: n.servicios || [],
      imagen: n.imagen || "",
      url: n.url || "#"
    }));

    setLista(adaptados);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resultados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((negocio) => (
          <div
            key={negocio.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all"
          >
            {negocio.imagen && (
              <img
                src={negocio.imagen}
                alt={negocio.nombre}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{negocio.nombre}</h3>
            <p className="text-sm text-gray-600">{negocio.direccion}</p>
            <p className="text-sm text-gray-500">
              ⭐ {negocio.rating} ({negocio.reseñas} reseñas)
            </p>
            <p className="text-sm text-gray-500">
              {negocio.rangoPrecio}
            </p>
            <p className="text-sm text-gray-500">
              {negocio.categoria}
            </p>
            <a
              href={negocio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm mt-2 inline-block"
            >
              Ver en Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resultados;
