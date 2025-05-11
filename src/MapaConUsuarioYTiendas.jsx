import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function MapaConUsuarioYTiendas({
  usuario,
  tiendas,
  favoritos,
  mostrarSoloFavoritos,
  setMostrarSoloFavoritos,
  setTiendaSeleccionada,
  onSeleccionar,
  onCerrar,
}) {
  const mapaRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (!usuario) return;

      const map = new google.maps.Map(mapaRef.current, {
        center: usuario,
        zoom: 14,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#212121" }] },
          { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ color: "#757575" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#2c2c2c" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#8a8a8a" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#3d3d3d" }],
          },
        ],
      });

      // Marcador del usuario
      new google.maps.Marker({
        position: usuario,
        map,
        title: "Tú estás aquí",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#00f",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });

      // Marcadores de tiendas
      tiendas.forEach((tienda) => {
        if (!tienda.lat || !tienda.lng) return;

        const esFavorito = favoritos.some((f) => f.nombre === tienda.nombre);

        const marker = new google.maps.Marker({
          position: { lat: tienda.lat, lng: tienda.lng },
          map,
          title: tienda.nombre,
          icon: esFavorito
            ? "https://cdn-icons-png.flaticon.com/512/833/833472.png"
            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        marker.addListener("click", () => {
          setTiendaSeleccionada(tienda);
          onSeleccionar(tienda);
        });
      });
    });
  }, [usuario, tiendas, favoritos]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapaRef} className="w-full h-full" />
      <button
        onClick={onCerrar}
        className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-60 rounded-full px-4 py-2 hover:bg-opacity-80 z-10"
      >
        ×
      </button>
    </div>
  );
}
