import React from "react";
import CatalogoProductos from "../organisms/CatalogoProductos.jsx";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import Presentacion from "../organisms/Presentacion.jsx";
import FormularioSugerencias from "../organisms/FormularioSugerencias.jsx";
import { useTienda } from "../../context/TiendaContext.jsx";
export default function Inicio() {
  const { productos } = useTienda();
  return (
    <PlantillaPagina>
      <main className="main">
        <Presentacion />
        <FormularioSugerencias />
        <section className="container is-max-desktop px-4 my-5">
          <h2 className="title is-5">Tienda</h2>
          <CatalogoProductos productos={productos.slice(0, 3)} />
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
