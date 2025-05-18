import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [negociosSimulados, setNegociosSimulados] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [busquedaHecha, setBusquedaHecha] = useState(false);

  useEffect(() => {
    fetch("/data/pedidosya_datos_quilpue.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Datos cargados:", data);
        setNegociosSimulados(data);
      })
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
    <div className="min-h-screen">
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold text-gray-800">CotizadorPro</h1>
        <p className="text-sm text-gray-500">Busca y compara negocios cerca de ti</p>
      </div>
 px-4">
      {resultadosFiltrados.length > 0 && mostrarMapa && (
        <MapaConUsuarioYTiendas
          negocios={resultadosFiltrados}
          favoritos={favoritos}
          ubicacionUsuario={ubicacionUsuario}
          alternarFavorito={alternarFavorito}
        />
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
                No se encontraron resultados para tu búsqueda. Intenta con otras palabras como <strong>"sushi"</strong>, <strong>"pan"</strong> o <strong>"pizza"</strong>.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}