
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

const MapaConUsuarioYTiendas = ({ negocios, ubicacionUsuario }) => {
  useEffect(() => {
    if (!ubicacionUsuario || negocios.length === 0) return;

    const map = L.map("mapa-tiendas").setView(
      [ubicacionUsuario.lat, ubicacionUsuario.lng],
      14
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng], {
      icon: iconoUsuario,
    })
      .addTo(map)
      .bindPopup("Estás aquí");

    negocios.forEach((negocio) => {
      if (negocio.latitud && negocio.longitud) {
        const marker = L.marker([negocio.latitud, negocio.longitud], {
          icon: iconoNegocio,
        }).addTo(map);

        marker.bindPopup(
          `<strong>${negocio.nombre}</strong><br/>${negocio.direccion || "Sin dirección"}`
        );
      }
    });

    return () => {
      map.remove();
    };
  }, [negocios, ubicacionUsuario]);

  return (
    <div
      id="mapa-tiendas"
      style={{
        height: "400px",
        width: "100%",
        marginTop: "1rem",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default MapaConUsuarioYTiendas;
