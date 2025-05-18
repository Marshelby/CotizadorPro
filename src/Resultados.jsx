import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";
import { clasificarBusqueda } from "./utils/clasificadorBusqueda";

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [negocios, setNegocios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

  useEffect(() => {
    fetch("/data/locales_google.json")
      .then((res) => res.json())
      .then((data) => setNegocios(data))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  const obtenerUbicacion = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          reject(error);
        }
      );
    });
  };

  const manejarBusqueda = async () => {
    if (!busqueda.trim()) return;
    try {
      const categorias = clasificarBusqueda(busqueda);
      const negociosFiltrados = negocios.filter((n) =>
        categorias.includes(n.categoria)
      );

      const ubicacion = await obtenerUbicacion();
      setUbicacionUsuario(ubicacion);
      setMostrarMapa(true);
      setBusquedaHecha(true);
      setResultados(negociosFiltrados);
    } catch (error) {
      console.error("Error al procesar la búsqueda:", error);
      setResultados([]);
    }
  };

  const alternarFavorito = (nombre) => {
    setFavoritos((prev) =>
      prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
    );
  };

  const resultadosFiltrados = verFavoritos
    ? resultados.filter((neg) => favoritos.includes(neg.nombre))
    : resultados;

  useEffect(() => {
    const manejarEnter = (e) => {
      if (e.key === "Enter") manejarBusqueda();
    };
    window.addEventListener("keydown", manejarEnter);
    return () => window.removeEventListener("keydown", manejarEnter);
  }, [busqueda]);

  return (
    <div className="min-h-screen px-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png" alt="bot" className="w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800">CotizadorPro</h1>
        </div>
        <p className="text-sm text-gray-500">Busca y compara negocios según tu necesidad</p>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Ej: quiero pan, sushi, completos..."
          className="w-full p-3 rounded-full border border-gray-300 shadow"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={manejarBusqueda}
          className="px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600"
        >
          Buscar
        </button>
        <button
          onClick={() => setMostrarMapa((prev) => !prev)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full shadow hover:bg-blue-200"
        >
          {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
        </button>
      </div>

      {resultadosFiltrados.length > 0 && mostrarMapa && (
        <>
          <MapaConUsuarioYTiendas
            negocios={resultadosFiltrados}
            favoritos={favoritos}
            ubicacionUsuario={ubicacionUsuario}
            alternarFavorito={alternarFavorito}
          />
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => setVerFavoritos(false)}
              className="px-4 py-2 bg-gray-200 rounded-full shadow hover:bg-gray-300"
            >
              Ver todos
            </button>
            <button
              onClick={() => setVerFavoritos(true)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-full shadow hover:bg-red-200"
            >
              Ver favoritos
            </button>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {resultadosFiltrados.map((negocio, index) => (
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
            <button
              onClick={() => alternarFavorito(negocio.nombre)}
              className={`mt-2 text-sm px-3 py-1 rounded-full ${
                favoritos.includes(negocio.nombre)
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {favoritos.includes(negocio.nombre)
                ? "❤️ Favorito"
                : "🤍 Agregar a favoritos"}
            </button>
          </div>
        ))}
      </div>

      {busquedaHecha && resultadosFiltrados.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No se encontraron resultados para tu búsqueda.
        </div>
      )}
    </div>
  );
}