import React, { useState } from "react";
import { useTienda } from "../../context/TiendaContext.jsx";
import Imagen from "../atoms/Imagen.jsx";
import Boton from "../atoms/Boton.jsx";
import { agregar, pesos } from "../../services/carrito.js";
export default function FichaProducto({ producto: p, detalle = false }) {
  const { usuario } = useTienda();
  const [aviso, setAviso] = useState("");
  const url = "tienda.html?producto=" + encodeURIComponent(p.codigo);
  return (
    <article className="box ficha">
      {p.imagen ? (
        <Imagen src={p.imagen} alt={p.nombre} className="foto-producto" />
      ) : (
        <div
          className="is-flex is-align-items-center is-justify-content-center has-background-white-ter has-text-grey is-size-2 sin-foto"
          aria-label="Producto sin foto"
        >
          {p.categoria === "Papel" ? "▤" : "□"}
        </div>
      )}
      <h3 className="title is-5">
        {detalle ? p.nombre : <a href={url}>{p.nombre}</a>}
      </h3>
      <p>
        {p.categoria} · {pesos(p.precio)}
      </p>
      {detalle && <p>{p.descripcion || "Sin descripción."}</p>}
      <p>{p.stock ? p.stock + " disponibles" : "Agotado"}</p>
      {usuario?.rol !== "Vendedor" && (
        <Boton
          disabled={!p.stock}
          onClick={() => {
            try {
              agregar(p);
              setAviso("Añadido al carrito.");
            } catch (e) {
              setAviso(e.message);
            }
          }}
        >
          Añadir al carrito
        </Boton>
      )}
      <p role="status" className="help">
        {aviso}
      </p>
    </article>
  );
}
