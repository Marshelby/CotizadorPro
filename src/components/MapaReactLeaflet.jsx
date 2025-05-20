import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
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

const CentrarEnNegocio = ({ negocio }) => {
  const map = useMap();

  useEffect(() => {
    if (negocio && negocio.latitud && negocio.longitud) {
      map.setView([negocio.latitud, negocio.longitud], 16);
    }
  }, [negocio, map]);

  return null;
};

const MapaReactLeaflet = ({
  negocios = [],
  ubicacionUsuario,
  favoritos = [],
  negocioSeleccionado = null,
}) => {
  const posicionInicial = ubicacionUsuario
    ? [ubicacionUsuario.lat, ubicacionUsuario.lng]
    : [-33.0472, -71.6127];

  return (
    <MapContainer
      center={posicionInicial}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        width: "700px",
        height: "300px",
        borderRadius: "12px",
        border: "2px solid black",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        margin: "0 auto",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {ubicacionUsuario && (
        <Marker
          position={[ubicacionUsuario.lat, ubicacionUsuario.lng]}
          icon={iconoUsuario}
        >
          <Popup>Estás aquí</Popup>
        </Marker>
      )}

      {negocios.map((negocio, idx) => (
        <Marker
          key={idx}
          position={[negocio.latitud, negocio.longitud]}
          icon={iconoNegocio}
        >
          <Popup>
            <strong>{negocio.nombre}</strong>
            <br />
            {negocio.direccion || "Dirección no disponible"}
            <br />
            {favoritos.includes(negocio.nombre) ? "❤️ Favorito" : ""}
          </Popup>
        </Marker>
      ))}

      {negocioSeleccionado && <CentrarEnNegocio negocio={negocioSeleccionado} />}
    </MapContainer>
  );
};

export default MapaReactLeaflet;
