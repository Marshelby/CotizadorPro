# CotizadorPro

CotizadorPro es una aplicación React + Node.js desplegada en Vercel que permite buscar productos por cercanía y precio, mostrando resultados en un mapa y permitiendo marcar favoritos.

## Estructura del Proyecto

- `/src`: Todo el frontend (React + Vite)
- `/api`: Función backend en Node que clasifica búsquedas
- `vercel.json`: Configuración para rutas y despliegue en Vercel

## Uso

1. Escribe lo que buscas (ej: "quiero pan").
2. Otorga permisos de ubicación.
3. Visualiza negocios cercanos ordenados por precio o distancia.
4. Marca favoritos ❤️ y revísalos en el mapa.

## Tecnologías

- React
- Vite
- TailwindCSS
- Google Maps API
- Node.js (Serverless)
- Vercel

---

## Despliegue

El sitio se despliega automáticamente en cada push a `main` desde GitHub gracias a la integración con Vercel.
