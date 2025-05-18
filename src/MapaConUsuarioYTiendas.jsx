
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
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapaConUsuarioYTiendas({ negocios }) {
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const map = L.map("mapa").setView([latitude, longitude], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.marker([latitude, longitude], { icon: iconoUsuario }).addTo(map)
        .bindPopup("Estás aquí")
        .openPopup();

      negocios.forEach((negocio) => {
        if (negocio.location && negocio.location.lat && negocio.location.lng) {
          L.marker([negocio.location.lat, negocio.location.lng], { icon: iconoNegocio })
            .addTo(map)
            .bindPopup(\`
              <b>\${negocio.nombre}</b><br/>
              \${negocio.direccion || "Sin dirección"}<br/>
              <a href="https://www.google.com/maps/search/?api=1&query=\${negocio.location.lat},\${negocio.location.lng}" target="_blank">Ver en Google Maps</a>
            \`);
        }
      });
    });
  }, [negocios]);

  return <div id="mapa" style={{ height: "500px", width: "100%" }}></div>;
}

export default MapaConUsuarioYTiendas;
