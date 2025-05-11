import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";
import datosSimulados from "../public/data/pedidosya_datos_quilpue.json";

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

      const texto = busqueda.toLowerCase();

      const filtrados = datosSimulados.filter((negocio) =>
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
      <h1 className="text-3xl font-bold mb-6">CotizadorPro</h1>
      <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold"
          onClick={() => setMostrarMapa(true)}
        >
          Ver en Mapa
        </button>
        <input
          type="text"
          className="text-black px-4 py-2 rounded-full w-72"
          placeholder="¿Qué estás buscando?"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
        <button
          onClick={handleBuscar}
          className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold"
        >
          Buscar
        </button>
        <button
          onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
          className="bg-white text-black px-4 py-2 rounded-full font-bold"
        >
          {mostrarSoloFavoritos ? "Ver Todos" : "❤️ Ver Favoritos"}
        </button>
      </div>

      {busquedaHecha && listaVisible.length === 0 && (
        <div className="text-center text-white mt-10 text-lg font-semibold">
          No se encontraron resultados. Intenta con otras palabras.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listaVisible.map((tienda, i) => (
          <div
            key={i}
            className="bg-white text-black p-4 rounded-xl shadow-md relative"
          >
            <h2 className="text-xl font-bold mb-2">{tienda.nombre}</h2>
            <p className="text-sm capitalize">
              Tipo: {tienda.tipoDetectado || "Otro"}
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
