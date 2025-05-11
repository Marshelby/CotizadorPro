import React, { useState, useEffect } from "react";
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
      console.log("Iniciando búsqueda con:", busqueda);
      const coords = await obtenerUbicacion();
      setUbicacionUsuario(coords);
      console.log("Ubicación obtenida:", coords);

      const res = await fetch("/api/clasificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: busqueda }),
      });

      const filtrados = await res.json();
      console.log("Resultados filtrados:", filtrados);
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
            {mostrar
