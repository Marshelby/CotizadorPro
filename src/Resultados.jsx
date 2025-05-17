
import React, { useEffect, useState } from "react";
import negocios from "./data/locales_google.json";
import { clasificarBusqueda } from "./utils/clasificadorBusqueda";

const Resultados = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    if (busqueda.trim() === "") {
      setFiltrados([]);
      return;
    }

    const categoriasDetectadas = clasificarBusqueda(busqueda);
    const resultados = negocios.filter((negocio) =>
      categoriasDetectadas.includes(negocio.categoria)
    );

    setFiltrados(resultados);
  }, [busqueda]);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
            alt="avatar"
            className="w-12 h-12"
          />
          <input
            type="text"
            placeholder="Ej: quiero pan, sushi, completos..."
            className="w-full p-3 rounded-full border border-gray-300 shadow"
            value={busqueda}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((negocio, index) => (
            <div
              key={index}
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
              <p className="text-sm text-gray-600">
                {negocio.direccion || "Dirección no disponible"}
              </p>
              <p className="text-sm text-gray-500">
                ⭐ {negocio.rating || "Sin calificación"} (
                {negocio.reseñas || 0} reseñas)
              </p>
              <p className="text-sm text-gray-500">{negocio.rangoPrecio}</p>
              <p className="text-sm text-gray-500">{negocio.categoria}</p>
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
      ) : busqueda.length > 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No se encontraron resultados para tu búsqueda.
        </p>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Ingresa una palabra para comenzar.
        </p>
      )}
    </div>
  );
};

export default Resultados;
