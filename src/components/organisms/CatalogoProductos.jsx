import React from "react";
import FichaProducto from "../molecules/FichaProducto.jsx";

export default function CatalogoProductos({ productos }) {
  return (
    <div className="columns is-multiline mt-3 mb-3">
      {productos.map((producto) => (
        <div
          key={producto.codigo}
          className="column is-half-tablet is-one-third-desktop"
        >
          <FichaProducto producto={producto} />
        </div>
      ))}
    </div>
  );
}
