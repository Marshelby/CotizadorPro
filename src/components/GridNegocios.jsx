import React from "react";
import NegocioCard from "./NegocioCard";

export default function GridNegocios({
  negocios = [],
  favoritos = [],
  alternarFavorito,
  setNegocioSeleccionado,
  negocioSeleccionado,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-6">
      {negocios.map((negocio, index) => (
        <NegocioCard
          key={index}
          negocio={negocio}
          favoritos={favoritos}
          alternarFavorito={alternarFavorito}
          negocioSeleccionado={negocioSeleccionado}
          onClick={() => setNegocioSeleccionado(negocio)}
        />
      ))}
    </div>
  );
}
