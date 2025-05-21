import { useState, useEffect } from "react";

export function useNegocios() {
  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resLocales, resCoords] = await Promise.all([
          fetch("/data/locales_google.json"),
          fetch("/data/coordenadas_por_url.json"),
        ]);
        const locales = await resLocales.json();
        const coordenadas = await resCoords.json();

        const fusionados = locales.map((local, i) => {
          const match = coordenadas.find((c) => c.nombre === local.nombre);
          const base = match
            ? { ...local, latitud: match.lat, longitud: match.lng }
            : local;

          if (i < 3) {
            return {
              ...base,
              direccion: base.direccion || "Av. Siempre Viva 123",
              categoria: base.categoria || "Panadería",
              rating: 4.5,
              reseñas: 120,
              precio: "$1.000 - $5.000",
              metodos_pago: ["Efectivo", "Débito", "Crédito"],
              delivery: "PedidosYa",
              url_pedidosya: "https://www.pedidosya.cl/",
              url_googlemaps: "https://maps.google.com/",
              horarios: "Lunes a sábado de 9:00 a 21:00",
              imagen: "/imgs/panaderia.jpg",
            };
          }

          return base;
        });

        setNegocios(fusionados);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, []);

  return negocios;
}
