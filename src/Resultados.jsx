import { useState, useEffect } from "react";
import MapaConUsuarioYTiendas from "./MapaConUsuarioYTiendas";

export default function Resultados() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [busquedaHecha, setBusquedaHecha] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

  const imagenPorTipo = {
    sanguchería: "/img/sangucheria.png",
    panadería: "/img/panaderia.png",
    supermercado: "/img/supermercado.png",
    botillería: "/img/botilleria.png",
    bar: "/img/bar.png",
    pizza: "/img/pizza.png",
    sushi: "/img/sushi.png",
    pollo: "/img/pollo.png",
    cafe: "/img/cafe.png",
    latina: "/img/latina.png",
    franquicia: "/img/franquicia.png",
    pasteleria: "/img/pasteleria.png",
    helado: "/img/helado.png",
    waffle: "/img/waffle.png",
    otro: "/img/generic.png",
  };

  const iconoPorTipo = {
    sanguchería: "🦪",
    panadería: "🍞",
    supermercado: "🛒",
    botillería: "🍾",
    bar: "🍺",
    pizza: "🍕",
    sushi: "🍣",
    pollo: "🍗",
    cafe: "☕",
    latina: "🌮",
    franquicia: "🏢",
    pasteleria: "🍰",
    helado: "🍦",
    waffle: "🧇",
    otro: "🏬",
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (tiendaSeleccionada) {
          setTiendaSeleccionada(null);
        } else {
          setMostrarMapa(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tiendaSeleccionada]);

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

      const res = await fetch("https://cotizadorprobackend.vercel.app/api/clasificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: busqueda }),
      });

      const filtrados = await res.json();
      setResultados(Array.isArray(filtrados) ? filtrados : []);
      setBusquedaHecha(true);
    } catch (err) {
      console.error("Error al buscar lugares:", err);
    }
  };

  const handleOrdenar = (criterio) => {
    const lista = mostrarSoloFavoritos ? favoritos : resultados;
    const ordenados = [...lista];
    if (criterio === "precio") {
      ordenados.sort((a, b) => (a.precioPromedio || 9999) - (b.precioPromedio || 9999));
    } else if (criterio === "distancia") {
      ordenados.sort((a, b) => (a.distancia || 9999) - (b.distancia || 9999));
    }
    mostrarSoloFavoritos ? setFavoritos(ordenados) : setResultados(ordenados);
  };

  const alternarFavorito = (tienda) => {
    const yaEsFavorito = favoritos.some((fav) => fav.nombre === tienda.nombre);
    if (yaEsFavorito) {
      setFavoritos(favoritos.filter((fav) => fav.nombre !== tienda.nombre));
    } else {
      setFavoritos([...favoritos, tienda]);
    }
  };

  const listaVisible = mostrarSoloFavoritos ? favoritos : resultados;
  const tarjetaBase = "bg-white/90 text-black";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6 pb-96 font-urbanist">
      <div className="transition-all duration-500 flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold font-rubik mb-4">
          <span className="text-pink-500 mr-2">🤖</span>CotizadorPro
        </h1>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full font-poppins"
            onClick={() => setMostrarMapa(true)}
          >
            Ver en Mapa
          </button>
          <input
            type="text"
            className="px-4 py-2 rounded-full text-black w-72 font-medium"
            placeholder="quiero un completo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          />
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full font-poppins"
            onClick={handleBuscar}
          >
            Buscar
          </button>
          {busquedaHecha && listaVisible.length > 0 && (
            <>
              <button
                onClick={() => handleOrdenar("precio")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full font-poppins"
              >
                Ordenar por Precio
              </button>
              <button
                onClick={() => handleOrdenar("distancia")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full font-poppins"
              >
                Ordenar por Distancia
              </button>
            </>
          )}
          <button
            onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
            className="bg-white text-black font-bold py-2 px-6 rounded-full font-poppins border border-gray-300"
          >
            {mostrarSoloFavoritos ? "Ver Todos" : "❤️ Ver Favoritos"}
          </button>
        </div>
      </div>

      {listaVisible.length === 0 && busquedaHecha && (
        <div className="text-center text-white mt-10 text-lg font-semibold">
          No se encontraron resultados. Intenta con otras palabras.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaVisible.map((tienda, index) => (
          <div
            key={index}
            onClick={() => setTiendaSeleccionada(tienda)}
            className={`cursor-pointer p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${tarjetaBase}`}
          >
            <button
              className="absolute top-2 right-2 text-pink-500 text-xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                alternarFavorito(tienda);
              }}
            >
              {favoritos.some((fav) => fav.nombre === tienda.nombre) ? "❤️" : "🤍"}
            </button>
            <h2 className="text-xl font-semibold font-poppins mb-1">
              {iconoPorTipo[tienda.tipoDetectado] || "🏬"} {tienda.nombre}
            </h2>
            <p className="text-sm font-medium mb-2">{tienda.direccion}</p>
            <p className="text-sm font-medium mb-2">Tipo: {tienda.tipoDetectado}</p>
            <p className="text-sm font-medium mb-2">Precio promedio: ${tienda.precioPromedio}</p>
            <p className="text-sm font-medium mb-2">Delivery: {tienda.delivery ? "Sí" : "No"}</p>
            <a
              href={tienda.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 hover:underline font-semibold"
            >
              Ver en Google Maps
            </a>
          </div>
        ))}
      </div>

      {mostrarMapa && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="w-[450px] h-[500px] bg-white relative rounded-xl shadow-xl overflow-hidden pt-12">
            <MapaConUsuarioYTiendas
              usuario={ubicacionUsuario}
              tiendas={listaVisible}
              favoritos={favoritos}
              mostrarSoloFavoritos={mostrarSoloFavoritos}
              setMostrarSoloFavoritos={setMostrarSoloFavoritos}
              setTiendaSeleccionada={setTiendaSeleccionada}
              onSeleccionar={setTiendaSeleccionada}
              onCerrar={() => setMostrarMapa(false)}
            />
          </div>
        </div>
      )}

      {tiendaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl shadow-xl p-6 w-[90%] max-w-lg relative font-urbanist ${tarjetaBase}`}
          >
            <img
              src={imagenPorTipo[tiendaSeleccionada.tipoDetectado] || imagenPorTipo.otro}
              alt="Imagen del negocio"
              className="w-16 h-16 object-contain rounded-md border border-gray-300 shadow-md mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold font-poppins mb-2 text-center">
              {iconoPorTipo[tiendaSeleccionada.tipoDetectado] || "🏬"} {tiendaSeleccionada.nombre}
            </h2>
            <p className="font-urbanist font-medium mb-1">📍 {tiendaSeleccionada.direccion}</p>
            <p className="font-urbanist font-medium mb-1">🛒 Productos:</p>
            <ul className="list-disc list-inside ml-4 mb-2 font-urbanist font-medium">
              {(tiendaSeleccionada.productos || []).map((prod, i) => (
                <li key={i}>{prod}</li>
              ))}
            </ul>
            <p className="font-urbanist font-medium mb-1">💸 Precio promedio: ${tiendaSeleccionada.precioPromedio}</p>
            <p className="font-urbanist font-medium mb-3">🚚 Delivery: {tiendaSeleccionada.delivery ? "Sí" : "No"}</p>
            <a
              href={tiendaSeleccionada.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 font-bold underline block mb-4"
            >
              Ver en Google Maps
            </a>
            <button
              onClick={() => setTiendaSeleccionada(null)}
              className="absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
