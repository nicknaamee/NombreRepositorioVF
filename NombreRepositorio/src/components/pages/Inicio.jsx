import React from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Presentacion from "../organisms/Presentacion.jsx";
import FormularioSugerencias from "../organisms/FormularioSugerencias.jsx";
import { useTienda } from "../../services/contexto.jsx";
import FichaProducto from "../molecules/FichaProducto.jsx";
export default function Inicio() {
  const { productos } = useTienda();
  return (
    <PlantillaPagina>
      <main className="main">
        <Presentacion />
        <FormularioSugerencias />
        <section className="zona-tienda">
          <h2 className="title is-5">Tienda</h2>
          <div className="rejilla">
            {productos.slice(0, 3).map((p) => (
              <FichaProducto key={p.codigo} producto={p} />
            ))}
          </div>
          <a href="tienda.html">Ver productos</a>
        </section>
      </main>
      <a
        href="buzonsugerencias.html"
        className="button is-danger is-light boton-flotante"
        title="Ver basurero"
      >
        🗑️
      </a>
    </PlantillaPagina>
  );
}
