{resultadosFiltrados.length === 0 && (
  <div className="flex flex-col items-center mt-10 animate-fadeIn">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25c1.25 0 2.25-.625 2.25-1.5s-1-1.5-2.25-1.5-2.25.625-2.25 1.5 1 1.5 2.25 1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
    </svg>
    <p className="text-gray-500 text-base">
      No se encontraron resultados para tu búsqueda. Intenta con otras palabras como <strong>"sushi"</strong>, <strong>"pan"</strong> o <strong>"pizza"</strong>.
    </p>
  </div>
)}