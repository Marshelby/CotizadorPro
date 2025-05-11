import React, { useEffect, useState } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";
import negociosSimulados from "../public/data/pedidosya_datos_quilpue.json";

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [verSoloFavoritos, setVerSoloFavoritos] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacionUsuario({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("No pudimos obtener tu ubicación 😢")
    );
  }, []);

  const handleBuscar = () => {
    const texto = busqueda.toLowerCase();
    const filtrados = negociosSimulados.filter((n) =>
      n.nombre?.toLowerCase().includes(texto) ||
      n.tipoDetectado?.toLowerCase().includes(texto)
    );
    setResultados(filtrados);
    setMostrarMapa(true);
    setVerSoloFavoritos(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  const toggleFavorito = (negocio) => {
    const existe = favoritos.find((f) => f.nombre === negocio.nombre);
    if (existe) {
      setFavoritos(favoritos.filter((f) => f.nombre !== negocio.nombre));
    } else {
      setFavoritos([...favoritos, negocio]);
    }
  };

  const mostrarTodos = () => {
    if (busqueda.trim()) {
      handleBuscar();
    } else {
      setResultados(negociosSimulados.slice(0, 30));
    }
    setMostrarMapa(true);
    setVerSoloFavoritos(false);
  };

  const mostrarSoloFavoritos = () => {
    const soloFavoritos = favoritos.map((f) => ({ ...f }));
    setResultados(soloFavoritos);
    setMostrarMapa(true);
    setVerSoloFavoritos(true);
  };

  const negociosAMostrar = verSoloFavoritos ? favoritos : resultados;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 text-white">
      <h1 className="text-4xl font-bold mb-2 text-center">
        🤖 <span className="text-gray-800">Cotizador</span><span className="text-pink-500">Pro</span>
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        Encuentra lo que buscas cerca de ti — comida, bebida o lo que necesites ✨
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-3xl mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: quiero un completo, sushi, pan..."
          className="flex-1 rounded-full px-5 py-3 text-black border border-pink-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button onClick={handleBuscar} className="bg-pink-500 hover:bg-pink-600 px-5 py-3 rounded-full">
          Buscar
        </button>
        <button onClick={mostrarSoloFavoritos} className="bg-white text-pink-500 px-5 py-3 rounded-full border border-pink-300 hover:bg-pink-50">
          💗 Ver Favoritos
        </button>
      </div>

      {mostrarMapa && ubicacionUsuario && (
        <div className="w-full max-w-5xl mb-6">
          <MapaConUsuarioYTiendas
            usuario={ubicacionUsuario}
            negocios={negociosAMostrar}
            favoritos={favoritos}
          />
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={mostrarTodos} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full shadow hover:bg-gray-300">
              Ver todos
            </button>
            <button onClick={mostrarSoloFavoritos} className="bg-pink-100 text-pink-800 px-6 py-2 rounded-full shadow hover:bg-pink-200">
              Ver favoritos
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mt-6">
        {negociosAMostrar.length === 0 && (
          <p className="text-gray-800 text-lg mt-6 text-center max-w-xl">
            No se encontraron resultados para tu búsqueda. Intenta con otras palabras o usa “Ver todos”.
          </p>
        )}

        {negociosAMostrar.map((negocio) => (
          <div key={negocio.nombre} className="bg-white text-black rounded-2xl shadow p-5 w-72">
            <h2 className="text-xl font-bold">{negocio.nombre}</h2>
            <p className="text-gray-700">Tipo: {negocio.tipoDetectado}</p>
            <button onClick={() => toggleFavorito(negocio)} className="text-pink-500 mt-2 text-xl">
              {favoritos.find((f) => f.nombre === negocio.nombre) ? "💖" : "🤍"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
