import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconoUsuario = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const iconoNegocio = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function VolarAMiUbicacion({ ubicacion }) {
  const map = useMap();
  if (ubicacion) {
    map.setView(ubicacion, 15);
  }
  return null;
}

export default function MapaConUsuarioYTiendas({ ubicacion, negocios }) {
  return (
    <div className="flex justify-center mt-4 mb-4">
      <MapContainer
        center={ubicacion || [-33.0472, -71.6127]}
        zoom={15}
        style={{ height: "300px", width: "90%", maxWidth: "700px", borderRadius: "12px", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ubicacion && <Marker position={ubicacion} icon={iconoUsuario}>
          <Popup>Estás aquí</Popup>
        </Marker>}
        {negocios.map((negocio, index) => {
          const { latitud, longitud } = negocio;
          if (latitud && longitud) {
            const popupContent = `
              <strong>${negocio.nombre || "Negocio sin nombre"}</strong><br/>
              ${negocio.direccion || "Sin dirección"}<br/>
              Categoría: ${negocio.categoria || "Desconocida"}<br/>
              ${negocio.telefono ? `Teléfono: ${negocio.telefono}<br/>` : ""}
              ${negocio.rating ? `⭐ ${negocio.rating} (${negocio.reseñas || "sin reseñas"})<br/>` : ""}
            `;
            return (
              <Marker key={index} position={[latitud, longitud]} icon={iconoNegocio}>
                <Popup>
                  <div dangerouslySetInnerHTML={{ __html: popupContent }} />
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        <VolarAMiUbicacion ubicacion={ubicacion} />
      </MapContainer>
    </div>
  );
}