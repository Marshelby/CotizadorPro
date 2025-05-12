import React from "react";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconoUsuario = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconoNegocio = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1587/1587577.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const iconoFavorito = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

export default function MapaConUsuarioYTiendas({ ubicacionUsuario, negocios, favoritos }) {
  useEffect(() => {
    if (!ubicacionUsuario) return;

    if (document.querySelector("#mapa")?._leaflet_id) {
      document.querySelector("#mapa")._leaflet_id = null;
    }

    const mapa = L.map("mapa").setView([ubicacionUsuario.lat, ubicacionUsuario.lng], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapa);

    L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng], { icon: iconoUsuario })
      .addTo(mapa)
      .bindPopup("Tú estás aquí");

    const grupo = L.featureGroup();

    negocios.forEach((negocio) => {
      const lat = negocio.lat || negocio.latitud || 0;
      const lng = negocio.lng || negocio.longitud || 0;
      if (!lat || !lng) return;

      const esFavorito = favoritos.some((f) => f.nombre === negocio.nombre);
      const icono = esFavorito ? iconoFavorito : iconoNegocio;

      const marker = L.marker([lat, lng], { icon: icono })
        .bindPopup(`<strong>${negocio.nombre}</strong><br/>Tipo: ${negocio.tipoDetectado || "Sin clasificar"}`);
      marker.addTo(grupo);
    });

    grupo.addTo(mapa);

    if (grupo.getLayers().length > 0) {
      mapa.fitBounds(grupo.getBounds().pad(0.3));
    }

    return () => mapa.remove();
  }, [ubicacionUsuario, negocios, favoritos]);

  return (
    <div
      id="mapa"
      className="w-full transition-all duration-500"
      style={{
        height: window.innerWidth < 768 ? "300px" : "500px",
        marginTop: "40px",
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
      }}
    />
  );
}
