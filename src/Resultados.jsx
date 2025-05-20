
import React, { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";
import { clasificarBusqueda } from "./utils/clasificadorBusqueda";
import NegocioCard from "./components/NegocioCard";
import NegocioModal from "./components/NegocioModal";

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

        const fusionados = locales.map((local, i) => {
          const match = coordenadas.find((c) => c.nombre === local.nombre);
          const base = match ? { ...local, latitud: match.lat, longitud: match.lng } : local;

          // Inyectar datos falsos a los primeros 3 locales
          if (i < 3) {
            return {
              ...base,
              direccion: base.direccion || "Av. Siempre Viva 123",
              categoria: base.categoria || "Panadería",
              rating: 4.5,
              reseñas: 120,
              precio: "$1.000 - $5.000",
              metodos_pago: ["Efectivo", "Débito", "Crédito"],
              delivery: "PedidosYa",
              url_pedidosya: "https://www.pedidosya.cl/",
              url_googlemaps: "https://maps.google.com/",
              horarios: "Lunes a sábado de 9:00 a 21:00",
              imagen: "/imgs/panaderia.jpg"
            };
          }

          return base;
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

  const mostrarSinResultados =
    verFavoritos && resultadosFiltrados.length === 0;

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

      {mostrarMapa && (
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

      {mostrarSinResultados && (
        <div className="text-center text-gray-500 mt-10">
          No tienes favoritos aún. ¡Marca tus locales preferidos!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-6">
        {resultadosFiltrados.map((negocio, index) => (
          <NegocioCard
            key={index}
            negocio={negocio}
            favoritos={favoritos}
            alternarFavorito={alternarFavorito}
            onClick={() => setNegocioSeleccionado(negocio)}
          />
        ))}
      </div>

      {negocioSeleccionado && (
        <NegocioModal
          negocio={negocioSeleccionado}
          favoritos={favoritos}
          alternarFavorito={alternarFavorito}
          onClose={() => setNegocioSeleccionado(null)}
        />
      )}

      {busquedaHecha && resultadosFiltrados.length === 0 && !verFavoritos && (
        <div className="text-center text-gray-500 mt-10">
          No se encontraron resultados para tu búsqueda.
        </div>
      )}
    </div>
  );
}
