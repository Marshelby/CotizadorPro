import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [busquedaHecha, setBusquedaHecha] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

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

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;

    try {
      const coords = await obtenerUbicacion();
      setUbicacionUsuario(coords);

      const res = await fetch("/data/pedidosya_datos_quilpue.json");
      const data = await res.json();

      const texto = busqueda.toLowerCase();

      const filtrados = data.filter((negocio) =>
        negocio.nombre?.toLowerCase().includes(texto) ||
        negocio.tipoDetectado?.toLowerCase().includes(texto)
      );

      setResultados(filtrados);
      setBusquedaHecha(true);
    } catch (err) {
      console.error("Error al buscar lugares:", err);
    }
  };

  const listaVisible = mostrarSoloFavoritos ? favoritos : resultados;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6 pb-96 font-urbanist">
      {/* CABECERA MODERNA Y CENTRADA */}
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-4 mb-10">
        <h1 className="text-5xl font-bold text-white font-rubik tracking-tight drop-shadow-md">
          🤖 Cotizador<span className="text-pink-500">Pro</span>
        </h1>
        <p className="text-lg text-white/80 font-light">
          Encuentra lo que buscas cerca de ti — comida, bebida o lo que necesites ✨
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full px-4 sm:px-0">
          <input
            type="text"
            className="flex-1 px-5 py-3 rounded-full text-black text-lg shadow-md"
            placeholder="Ej: quiero un completo, sushi, pan..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          />
          <button
            onClick={handleBuscar}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Buscar
          </button>
          <button
            onClick={() => setMostrarMapa(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition"
          >
            Ver en Mapa
          </button>
          <button
            onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
            className="bg-white text-black font-semibold px-6 py-3 rounded-full transition"
          >
            {mostrarSoloFavoritos ? "Ver Todos" : "❤️ Ver Favoritos"}
          </button>
        </div>
      </div>

      {/* MENSAJE SI NO HAY RESULTADOS */}
      {busquedaHecha && listaVisible.length === 0 && (
        <div className="text-center text-white mt-10 text-lg font-semibold">
          No se encontraron resultados. Intenta con otras palabras.
        </div>
      )}

      {/* RESULTADOS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listaVisible.map((tienda, i) => (
          <div
            key={i}
            className="bg-white/90 text-black p-4 rounded-xl shadow-md relative"
          >
            <h2 className="text-xl font-bold mb-2">{tienda.nombre}</h2>
            <p className="text-sm capitalize">
              Tipo: {tienda.tipoDetectado || "otro"}
            </p>
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() =>
                favoritos.some((f) => f.nombre === tienda.nombre)
                  ? setFavoritos(favoritos.filter((f) => f.nombre !== tienda.nombre))
                  : setFavoritos([...favoritos, tienda])
              }
            >
              {favoritos.some((f) => f.nombre === tienda.nombre) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>

      {/* MAPA */}
      {mostrarMapa && ubicacionUsuario && (
        <MapaConUsuarioYTiendas
          usuario={ubicacionUsuario}
          negocios={listaVisible}
          favoritos={favoritos}
        />
      )}
    </div>
  );
}
