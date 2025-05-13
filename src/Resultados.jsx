import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";
import negociosSimulados from "../public/data/pedidosya_datos_quilpue.json";
import { detectarTipoBusqueda, filtrarPorTipo } from "./motorBusqueda";

const iconoPorTipo = {
  panadería: "🍞",
  botillería: "🍷",
  supermercado: "🛒",
  sanguchería: "🌭",
  otro: "🏪",
};

const colorPorTipo = {
  panadería: "bg-yellow-200",
  botillería: "bg-red-200",
  supermercado: "bg-blue-200",
  sanguchería: "bg-green-200",
  otro: "bg-gray-200",
};

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

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
      const tipoDetectado = detectarTipoBusqueda(busqueda);
      const negociosFiltrados = filtrarPorTipo(tipoDetectado, negociosSimulados);

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
      setUbicacionUsuario(ubicacion);
      setMostrarMapa(true);
      setBusquedaHecha(true);

      const tipoDetectado = detectarTipoBusqueda(busqueda);
      const negociosFiltrados = filtrarPorTipo(tipoDetectado, negociosSimulados);
      setResultados(negociosFiltrados);
    } catch (error) {
      console.error("Error al buscar lugares:", error);
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
    <div className="min-h-screen bg-white text-center px-4">
      <h1 className="text-4xl font-bold mt-8 flex justify-center items-center gap-2">
        <span role="img" aria-label="robot">🤖</span>
        <span className="text-gray-900">Cotizador</span>
        <span className="text-pink-500">Pro</span>
      </h1>
      <p className="text-gray-700 mt-2 text-lg">
        Encuentra lo que buscas cerca de ti — comida, bebida o lo que necesites ✨
      </p>

      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Ej: quiero un completo, sushi, pan..."
          className="rounded-full px-6 py-3 w-full max-w-lg text-center border border-pink-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
        />
        <button
          onClick={manejarBusqueda}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          Buscar
        </button>
        <button
          onClick={() => setVerFavoritos(!verFavoritos)}
          className={`flex items-center gap-2 border px-6 py-3 rounded-full shadow transition ${
            verFavoritos ? "border-pink-300 bg-pink-50" : "border-pink-100 bg-white"
          }`}
        >
          <span role="img" aria-label="corazon">💗</span> Ver Favoritos
        </button>
        <button
          onClick={() => setMostrarMapa((prev) => !prev)}
          className="mt-2 px-6 py-2 text-sm bg-gray-100 border border-gray-300 rounded-full shadow hover:bg-gray-200 transition"
        >
          {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
        </button>
      </div>

      {mostrarMapa && (
        <div className="mt-10 max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl shadow-md p-4">
          <p className="text-sm text-gray-500 mb-2">Zona de resultados en el mapa</p>
          <MapaConUsuarioYTiendas
            negocios={resultadosFiltrados}
            favoritos={favoritos}
            ubicacionUsuario={ubicacionUsuario}
            alternarFavorito={alternarFavorito}
          />
        </div>
      )}

      {busquedaHecha && (
        <>
{resultadosFiltrados.length === 0 && (
            <div className="flex flex-col items-center mt-10 animate-fadeIn">
  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25c1.25 0 2.25-.625 2.25-1.5s-1-1.5-2.25-1.5-2.25.625-2.25 1.5 1 1.5 2.25 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
  </svg>
  <p className="text-gray-500 text-base">
    No se encontraron resultados para tu búsqueda. Intenta con otras palabras o prueba escribir por ejemplo: <strong>"Quiero sushi"</strong>, <strong>"Busco completos"</strong> o <strong>"Dónde venden pizza"</strong>.
  </p>
</div>
              No se encontraron resultados para tu búsqueda. Intenta con otras palabras o prueba escribir por ejemplo: <strong>"Quiero sushi"</strong>, <strong>"Busco completos"</strong> o <strong>"Dónde venden pizza"</strong>.
            </p>
          )}