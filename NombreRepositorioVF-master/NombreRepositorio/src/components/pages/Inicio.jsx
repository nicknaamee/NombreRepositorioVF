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
      <main className="container my-5">
        <Presentacion />
        
        <hr className="my-5 text-muted" />
        
        <FormularioSugerencias />
        
        <hr className="my-5 text-muted" />
        
        <section className="text-center mb-5">
          <h2 className="h3 fw-bold mb-4">Productos Destacados</h2>
          
          {/* Grilla Responsiva: 1 columna en celular, 3 en PC */}
          <div className="row row-cols-1 row-cols-md-3 g-4 text-start">
            {productos.slice(0, 3).map((producto) => (
              <div className="col" key={producto.codigo}>
                <FichaProducto producto={producto} />
              </div>
            ))}
          </div>
          
          <div className="mt-5">
            <a href="tienda.html" className="btn btn-outline-primary btn-lg fw-bold px-4 rounded-pill shadow-sm">
              Ver todos los productos &rarr;
            </a>
          </div>
        </section>
      </main>

      {/* Botón flotante del basurero */}
      <a
        href="buzonsugerencias.html"
        className="btn btn-danger position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: "60px", height: "60px", fontSize: "1.5rem", zIndex: 1050 }}
        title="Ver basurero de sugerencias"
      >
        🗑️
      </a>
    </PlantillaPagina>
  );
}