import React, { useEffect, useState } from "react";
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

const MapaConUsuarioYTiendas = ({ negocios = [], ubicacionUsuario }) => {
  const [ubicacionInterna, setUbicacionInterna] = useState(null);

  useEffect(() => {
    if (!ubicacionUsuario && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUbicacionInterna({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Ubicación denegada o error:", err);
        }
      );
    }
  }, [ubicacionUsuario]);

  useEffect(() => {
    const ubicacionFinal = ubicacionUsuario || ubicacionInterna;
    if (!ubicacionFinal || negocios.length === 0) return;

    const contenedor = document.getElementById("mapa-tiendas");
    if (!contenedor) return;

    const map = L.map("mapa-tiendas").setView(
      [ubicacionFinal.lat, ubicacionFinal.lng],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([ubicacionFinal.lat, ubicacionFinal.lng], {
      icon: iconoUsuario,
    })
      .addTo(map)
      .bindPopup("Estás aquí");

    negocios.forEach((negocio) => {
      if (negocio.latitud && negocio.longitud) {
        L.marker([negocio.latitud, negocio.longitud], { icon: iconoNegocio })
          .addTo(map)
          .bindPopup(
            `<strong>${negocio.nombre}</strong><br/>${
              negocio.direccion || "Sin dirección"
            }`
          );
      }
    });

    return () => {
      map.remove();
    };
  }, [negocios, ubicacionUsuario, ubicacionInterna]);

  return (
    <div
      id="mapa-tiendas"
      className="mx-auto my-4 w-1/2 rounded-xl border border-gray-300 shadow-md"
      style={{ height: "400px", minHeight: "400px" }}
    ></div>
  );
};

export default MapaConUsuarioYTiendas;