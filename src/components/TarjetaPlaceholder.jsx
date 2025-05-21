import React from "react";

export default function TarjetaPlaceholder() {
  return (
    <div className="rounded-xl p-4 border shadow animate-pulse bg-white">
      <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
