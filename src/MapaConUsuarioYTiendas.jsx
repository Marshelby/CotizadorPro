
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

const MapaConUsuarioYTiendas = ({ negocios = [], ubicacionUsuario, onSeleccionarNegocio }) => {
  useEffect(() => {
    if (!ubicacionUsuario || negocios.length === 0) return;

    const contenedor = document.getElementById("mapa-tiendas");
    if (!contenedor) return;

    const map = L.map("mapa-tiendas").setView(
      [ubicacionUsuario.lat, ubicacionUsuario.lng],
      15
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
        const marker = L.marker([negocio.latitud, negocio.longitud], { icon: iconoNegocio })
          .addTo(map)
          .on("click", () => onSeleccionarNegocio(negocio));

        marker.bindPopup(`<strong>${negocio.nombre}</strong><br/>${negocio.direccion || "Sin dirección"}`);
      }
    });

    return () => {
      map.remove();
    };
  }, [negocios, ubicacionUsuario, onSeleccionarNegocio]);

  return (
    <div
      id="mapa-tiendas"
      className="mx-auto my-4 w-full max-w-4xl rounded-xl border border-gray-300 shadow-md"
      style={{ height: "400px", minHeight: "400px" }}
    ></div>
  );
};

export default MapaConUsuarioYTiendas;
