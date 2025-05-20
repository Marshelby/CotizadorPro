import React, { useEffect, useRef } from "react";
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
  negocioSeleccionado = null,
}) => {
  const mapRef = useRef(null);
  const markerMapRef = useRef({});
  const markersLayerRef = useRef(null);

  // Inicializar el mapa una sola vez
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("mapa").setView([-33.0472, -71.6127], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
    }

    const map = mapRef.current;

    if (ubicacionUsuario) {
      const { lat, lng } = ubicacionUsuario;
      L.marker([lat, lng], { icon: iconoUsuario })
        .addTo(map)
        .bindPopup("Estás aquí").openPopup();
      map.setView([lat, lng], 14);
    }
  }, [ubicacionUsuario]);

  // Cargar o actualizar marcadores de negocios
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }

    const markerMap = {};
    const layerGroup = L.layerGroup();

    negocios.forEach((negocio) => {
      if (negocio.latitud && negocio.longitud) {
        const popupContent =
          "<strong>" + negocio.nombre + "</strong><br/>" +
          (negocio.direccion || "Dirección no disponible") +
          "<br/>" +
          (favoritos.includes(negocio.nombre) ? "❤️ Favorito" : "");

        const marker = L.marker([negocio.latitud, negocio.longitud], {
          icon: iconoNegocio,
        })
          .bindPopup(popupContent)
          .addTo(layerGroup);

        markerMap[negocio.nombre] = marker;
      }
    });

    markerMapRef.current = markerMap;
    markersLayerRef.current = layerGroup;
    layerGroup.addTo(map);
  }, [negocios, favoritos]);

  // Centrar en negocio seleccionado
  useEffect(() => {
    const map = mapRef.current;
    const markerMap = markerMapRef.current;

    if (
      map &&
      negocioSeleccionado &&
      markerMap[negocioSeleccionado.nombre]
    ) {
      const marker = markerMap[negocioSeleccionado.nombre];
      marker.openPopup();
      map.setView(marker.getLatLng(), 16);
    }
  }, [negocioSeleccionado]);

  return (
    <div
      id="mapa"
      style={{
        width: "700px",
        height: "300px",
        borderRadius: "12px",
        border: "2px solid black",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        margin: "0 auto",
      }}
    />
  );
};

export default MapaConUsuarioYTiendas;
