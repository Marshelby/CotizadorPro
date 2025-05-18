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

const MapaConUsuarioYTiendas = ({
  negocios = [],
  ubicacionUsuario,
  favoritos = [],
  alternarFavorito = () => {},
}) => {
  useEffect(() => {
    const contenedor = document.getElementById("mapa");
    if (contenedor && contenedor._leaflet_id) {
      contenedor._leaflet_id = null;
    }

    const map = L.map("mapa").setView([-33.0472, -71.6127], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (ubicacionUsuario) {
      const { lat, lng } = ubicacionUsuario;
      L.marker([lat, lng], { icon: iconoUsuario }).addTo(map)
        .bindPopup("Estás aquí").openPopup();
      map.setView([lat, lng], 14);
    }

    negocios.forEach((negocio) => {
      if (negocio.latitud && negocio.longitud) {
        const popupContent =
          "<strong>" + negocio.nombre + "</strong><br/>" +
          (negocio.direccion || "Dirección no disponible") +
          "<br/>" + (favoritos.includes(negocio.nombre)
            ? "❤️ Favorito"
            : "");

        L.marker([negocio.latitud, negocio.longitud], { icon: iconoNegocio })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    return () => {
      map.remove();
    };
  }, [negocios, ubicacionUsuario]);

  return (
    <div
      id="mapa"
      style={{
        width: "500px",
        height: "300px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        margin: "0 auto",
      }}
    />
  );
};

export default MapaConUsuarioYTiendas;