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
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resLocales, resCoords] = await Promise.all([
          fetch("/data/locales_google.json"),
          fetch("/data/coordenadas_por_url.json"),
        ]);
        const locales = await resLocales.json();
        const coordenadas = await resCoords.json();

        const fusionados = locales.map((local) => {
          const match = coordenadas.find((c) => c.nombre === local.nombre);
          return match ? { ...local, latitud: match.lat, longitud: match.lng } : local;
        });

        setNegocios(fusionados);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      }
    };
    cargarDatos();
  }, []);

  const obtenerUbicacion = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
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
      const filtrados = negocios.filter((n) => categorias.includes(n.categoria));
      const ubicacion = await obtenerUbicacion();
      setUbicacionUsuario(ubicacion);
      setResultados(filtrados);
      setMostrarMapa(true);
      setBusquedaHecha(true);
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
    ? resultados.filter((n) => favoritos.includes(n.nombre))
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
      <div className="text-center mb-6 mt-[100px] max-w-2xl mx-auto bg-gradient-to-b from-[#f9fafb] to-white shadow-lg shadow-gray-300 py-6 rounded-xl animate-fade-up">
        <img src="/icons/bot.svg" alt="bot" className="w-20 h-20 mx-auto mb-1 animate-fade-in" />
        <h1 className="text-4xl font-extrabold text-gray-800 font-[Rubik] mb-1">
          Cotizador<span className="text-sky-500">Pro</span>
        </h1>
        <p className="text-xs text-gray-500 italic tracking-wide">Cotiza, compara y encuentra lo que necesitas.</p>
      </div>

      <hr className="my-8 w-1/2 mx-auto border-t border-gray-300 opacity-60 transition-all duration-500" />

      <div className="max-w-4xl mx-auto mb-2 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Ej: quiero pan, sushi, completos..."
          className="w-full p-3 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg transition duration-300"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={manejarBusqueda}
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

      <p className="text-xs text-gray-400 text-center mt-1">
        Puedes buscar por productos, locales o categorías.
      </p>

      {resultadosFiltrados.length > 0 && mostrarMapa && (
        <>
          <MapaConUsuarioYTiendas
            negocios={resultadosFiltrados}
            favoritos={favoritos}
            ubicacionUsuario={ubicacionUsuario}
            alternarFavorito={alternarFavorito}
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setVerFavoritos(false)}
              className="px-4 py-2 bg-slate-500 text-white rounded-full shadow hover:bg-slate-600 flex items-center gap-2"
            >
              📋 Ver todos
            </button>
            <button
              onClick={() => setVerFavoritos(true)}
              className="px-4 py-2 bg-rose-400 text-white rounded-full shadow hover:bg-rose-500 flex items-center gap-2"
            >
              ❤️ Ver favoritos
            </button>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-6">
        {resultadosFiltrados.map((negocio, index) => (
          <div
            key={index}
            onClick={() => setNegocioSeleccionado(negocio)}
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
        ))}
      </div>

      {negocioSeleccionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setNegocioSeleccionado(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full animate-scale-fade"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={negocioSeleccionado.imagen} alt={negocioSeleccionado.nombre} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-bold mb-2">{negocioSeleccionado.nombre}</h2>
            <p className="text-sm text-gray-600">📍 {negocioSeleccionado.direccion}</p>
            <p className="text-sm text-gray-500">💰 ⭐ {negocioSeleccionado.rating || "Sin calificación"} ({negocioSeleccionado.reseñas || 0} reseñas)</p>
            <p className="text-sm text-gray-500">{negocioSeleccionado.rangoPrecio}</p>
            <p className="text-sm text-gray-500">{negocioSeleccionado.categoria}</p>
            <a href={negocioSeleccionado.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 text-sm inline-block mt-2 hover:underline">
              Ver en Google Maps
            </a>
            <button
              onClick={() => alternarFavorito(negocioSeleccionado.nombre)}
              className={`mt-2 text-sm px-3 py-1 rounded-full ${
                favoritos.includes(negocioSeleccionado.nombre)
                  ? "bg-red-100 text-red-500"
                  : "bg-rose-100 text-rose-500 hover:bg-rose-200"
              }`}
            >
              {favoritos.includes(negocioSeleccionado.nombre)
                ? "❤️ Favorito"
                : "🤍 Agregar a favoritos"}
            </button>
          </div>
        </div>
      )}

      {busquedaHecha && resultadosFiltrados.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No se encontraron resultados para tu búsqueda.
        </div>
      )}
    </div>
  );
}
