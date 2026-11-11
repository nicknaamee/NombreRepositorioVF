import React from "react";
import CatalogoProductos from "../organisms/CatalogoProductos.jsx";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import FichaProducto from "../molecules/FichaProducto.jsx";
import { useTienda } from "../../context/TiendaContext.jsx";
export default function Tienda() {
  const { productos, cargando } = useTienda(),
    codigo = new URLSearchParams(location.search).get("producto");
  const p = productos.find((x) => x.codigo === codigo);
  return (
    <PlantillaPagina titulo="Tienda">
      <main className="container is-max-desktop px-4 my-5">
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
          <CatalogoProductos productos={productos} />
        ) : (
          <p>No hay productos.</p>
        )}
      </main>
    </PlantillaPagina>
  );
}
