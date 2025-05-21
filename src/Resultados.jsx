
import React, { useState, useEffect } from "react";
import MapaReactLeaflet from "./components/MapaReactLeaflet";
import { clasificarBusqueda } from "./utils/clasificadorBusqueda";
import NegocioCard from "./components/NegocioCard";
import NegocioModal from "./components/NegocioModal";
import BuscadorBarra from "./components/BuscadorBarra";
import HeaderCotizador from "./components/HeaderCotizador";

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
          const base = match
            ? { ...local, latitud: match.lat, longitud: match.lng }
            : local;

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
              imagen: "/imgs/panaderia.jpg",
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

  const alternarFavorito = (nombre) => {
    setFavoritos((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre]
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

  const manejarBusqueda = async () => {
    if (!busqueda.trim()) return;
    try {
      const filtrados = negocios;
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

  const mostrarSinResultados =
    verFavoritos && resultadosFiltrados.length === 0;

  return (
    <div className="min-h-screen px-4">
      <HeaderCotizador />

      <hr className="my-8 w-1/2 mx-auto border-t border-gray-300 opacity-60 transition-all duration-500" />

      <BuscadorBarra
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onBuscar={manejarBusqueda}
        mostrarMapa={mostrarMapa}
        setMostrarMapa={setMostrarMapa}
      />

      <p className="text-xs text-gray-400 text-center mt-1">
        Puedes buscar por productos, locales o categorías.
      </p>

      {mostrarMapa && (
        <>
          <MapaReactLeaflet
            negocios={resultadosFiltrados}
            favoritos={favoritos}
            ubicacionUsuario={ubicacionUsuario}
            negocioSeleccionado={negocioSeleccionado}
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
            negocioSeleccionado={negocioSeleccionado}
            onClick={() => setNegocioSeleccionado(negocio)}
          />
        ))}
      </div>

      {negocioSeleccionado && (
        <NegocioModal
          negocio={negocioSeleccionado}
          favoritos={favoritos}
          alternarFavorito={alternarFavorito}
          negocioSeleccionado={negocioSeleccionado}
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
