import React from "react";

export default function BotoneraFiltros({ verFavoritos, setVerFavoritos }) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={() => setVerFavoritos(false)}
        className={`px-4 py-2 rounded-full shadow flex items-center gap-2 ${
          !verFavoritos
            ? "bg-slate-700 text-white hover:bg-slate-800"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        📋 Ver todos
      </button>
      <button
        onClick={() => setVerFavoritos(true)}
        className={`px-4 py-2 rounded-full shadow flex items-center gap-2 ${
          verFavoritos
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        ❤️ Ver favoritos
      </button>
    </div>
  );
}
