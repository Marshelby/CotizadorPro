
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
    if (!ubicacionUsuario) return;

    const contenedor = document.getElementById("mapa");
    if (contenedor && contenedor._leaflet_id) {
      contenedor._leaflet_id = null;
    }

    const map = L.map("mapa").setView([ubicacionUsuario.lat, ubicacionUsuario.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng], { icon: iconoUsuario })
      .addTo(map)
      .bindPopup("Estás aquí").openPopup();

    negocios.forEach((negocio) => {
      if (negocio.latitud && negocio.longitud) {
        const popupContent =
          "<strong>" + negocio.nombre + "</strong><br/>" +
          (negocio.direccion || "Dirección no disponible") +
          (favoritos.includes(negocio.nombre) ? "<br/>❤️ Favorito" : "");

        L.marker([negocio.latitud, negocio.longitud], { icon: iconoNegocio })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    return () => {
      map.remove();
    };
  }, [negocios, ubicacionUsuario, favoritos]);

  return (
    <div id="mapa" className="w-full h-[500px] rounded-xl shadow my-4" />
  );
};

export default MapaConUsuarioYTiendas;
