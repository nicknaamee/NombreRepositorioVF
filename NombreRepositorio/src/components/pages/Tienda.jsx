import React from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import FichaProducto from "../molecules/FichaProducto.jsx";
import { useTienda } from "../../services/contexto.jsx";
export default function Tienda() {
  const { productos, cargando } = useTienda(),
    codigo = new URLSearchParams(location.search).get("producto");
  const p = productos.find((x) => x.codigo === codigo);
  return (
    <PlantillaPagina titulo="Tienda">
      <main className="zona-tienda">
        <h2 className="title is-4">
          {codigo ? "Detalle del producto" : "Productos"}
        </h2>
        {cargando ? (
          <p>Cargando productos…</p>
        ) : codigo ? (
          <>
            {p ? (
              <FichaProducto producto={p} detalle />
            ) : (
              <p>Producto no disponible.</p>
            )}
            <a href="tienda.html">Volver a productos</a>
          </>
        ) : productos.length ? (
          <div className="rejilla">
            {productos.map((x) => (
              <FichaProducto key={x.codigo} producto={x} />
            ))}
          </div>
        ) : (
          <p>No hay productos.</p>
        )}
      </main>
    </PlantillaPagina>
  );
}
