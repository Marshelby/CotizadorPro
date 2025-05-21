import React from "react";

export default function HeaderCotizador() {
  return (
    <div className="text-center mb-6 mt-[100px] max-w-2xl mx-auto bg-gradient-to-b from-[#f9fafb] to-white shadow-lg shadow-gray-300 py-6 rounded-xl animate-fade-up">
      <img
        src="/icons/bot.svg"
        alt="bot"
        className="w-20 h-20 mx-auto mb-1 animate-fade-in"
      />
      <h1 className="text-4xl font-extrabold text-gray-800 font-[Rubik] mb-1">
        Cotizador<span className="text-sky-500">Pro</span>
      </h1>
      <p className="text-xs text-gray-500 italic tracking-wide">
        Cotiza, compara y encuentra lo que necesitas.
      </p>
    </div>
  );
}
