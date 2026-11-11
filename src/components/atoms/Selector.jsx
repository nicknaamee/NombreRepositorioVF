import React from "react";

export default function Selector({ opciones = [], className = "", ...props }) {
  return (
    <div className={`select is-fullwidth ${className}`.trim()}>
      <select {...props}>
        <option value="">Selecciona</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}
