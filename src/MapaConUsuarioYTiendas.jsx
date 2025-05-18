
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconoUsuario = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconoNegocio = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapaConUsuarioYTiendas = ({ negocios = [], ubicacionUsuario, favoritos = [], alternarFavorito = () => {} }) => {
  useEffect(() => {
    if (!ubicacionUsuario || negocios.length === 0) return;

    const timeout = setTimeout(() => {
      const contenedor = document.getElementById("mapa");
      if (!contenedor) return;
      if (contenedor._leaflet_id) contenedor._leaflet_id = null;

      const map = L.map("mapa").setView([ubicacionUsuario.lat, ubicacionUsuario.lng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng], { icon: iconoUsuario })
        .addTo(map)
        .bindPopup("Estás aquí").openPopup();

      negocios.forEach((negocio) => {
        if (negocio.latitud && negocio.longitud) {
          const popupContent = `<strong>${negocio.nombre}</strong><br/>${negocio.direccion || "Dirección no disponible"}<br/>
          <a href="https://www.google.com/maps?q=${negocio.latitud},${negocio.longitud}" target="_blank">Ver en Google Maps</a>`;

          L.marker([negocio.latitud, negocio.longitud], { icon: iconoNegocio })
            .addTo(map)
            .bindPopup(popupContent);
        }
      });

      return () => map.remove();
    }, 100);

    return () => clearTimeout(timeout);
  }, [negocios, ubicacionUsuario, favoritos]);

  return (
    <div
      id="mapa"
      style={{ width: "50%", height: "500px", margin: "1rem auto" }}
      className="rounded-xl shadow"
    />
  );
};

export default MapaConUsuarioYTiendas;
