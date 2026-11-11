import React from "react";
export default function TarjetaSugerencia({ texto }) {
  return (
    <div className="box mt-3 tarjeta-sugerencia">
      <p>🗑️ {texto}</p>
    </div>
  );
}
