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

export default function MapaConUsuarioYTiendas({ usuario, negocios, favoritos }) {
  useEffect(() => {
    // Elimina cualquier mapa previo
    if (document.querySelector("#mapa")?._leaflet_id) {
      document.querySelector("#mapa")._leaflet_id = null;
    }

    const mapa = L.map("mapa").setView([usuario.lat, usuario.lng], 14);

    // Fondo oscuro
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);

    // Agrega al usuario
    L.marker([usuario.lat, usuario.lng], { icon: iconoUsuario })
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
        .bindPopup(`<strong>${negocio.nombre}</strong><br/>Tipo: ${negocio.tipoDetectado}`);
      marker.addTo(grupo);
    });

    grupo.addTo(mapa);

    if (grupo.getLayers().length > 0) {
      mapa.fitBounds(grupo.getBounds().pad(0.3));
    }

    return () => mapa.remove();
  }, [usuario, negocios, favoritos]);

  return (
    <div
      id="mapa"
      style={{
        height: "500px",
        marginTop: "60px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
      }}
    />
  );
}
