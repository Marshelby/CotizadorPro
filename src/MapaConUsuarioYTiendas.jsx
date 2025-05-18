import React, { useEffect, useRef, useState } from "react";
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
  const mapaRef = useRef(null);

  useEffect(() => {
    if (!ubicacionUsuario && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUbicacionInterna({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => {
          console.error("Ubicación denegada o error:", err);
        }
      );
    }
  }, [ubicacionUsuario]);

  useEffect(() => {
    const ubicacionFinal = ubicacionUsuario || ubicacionInterna;
    if (!ubicacionFinal || negocios.length === 0) return;

    const map = L.map("mapa-tiendas").setView(
      [ubicacionFinal.lat, ubicacionFinal.lng],
      14
    );
    mapaRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marcadorUsuario = L.marker([ubicacionFinal.lat, ubicacionFinal.lng], {
      icon: iconoUsuario,
    }).addTo(map);
    marcadorUsuario.bindPopup("Estás aquí");

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

  useEffect(() => {
    if (mapaRef.current && ubicacionUsuario) {
      mapaRef.current.flyTo([ubicacionUsuario.lat, ubicacionUsuario.lng], 14);
    }
  }, [ubicacionUsuario]);

  return (
    <div
      id="mapa-tiendas"
      style={{
        height: "400px",
        width: "50%",
        margin: "1rem auto",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default MapaConUsuarioYTiendas;