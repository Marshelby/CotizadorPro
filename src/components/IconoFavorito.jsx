import React from "react";
import { Heart, HeartOff } from "lucide-react";

export default function IconoFavorito({ activo = false, onClick }) {
  const Icono = activo ? Heart : HeartOff;

  return (
    <button onClick={onClick} className="transition transform hover:scale-125">
      <Icono className={activo ? "text-rose-500" : "text-gray-400"} />
    </button>
  );
}
