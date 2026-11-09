import React from "react";
import PlantillaPagina from "../templates/PlantillaPagina.jsx";
import FichaProducto from "../molecules/FichaProducto.jsx";
import { useTienda } from "../../services/contexto.jsx";

export default function Tienda() {
  const { productos, cargando } = useTienda();
  
  // 1. Nombres descriptivos y extracción de parámetros
  const parametrosUrl = new URLSearchParams(location.search);
  const codigoBuscado = parametrosUrl.get("producto");

  // Buscamos si el producto específico existe en nuestro catálogo
  const productoEncontrado = productos.find((producto) => producto.codigo === codigoBuscado);

  // 2. EARLY RETURN A: Estado de carga
  if (cargando) {
    return (
      <PlantillaPagina titulo="Tienda">
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="fs-5 fw-bold">Revisando la bodega (paciencia)...</p>
        </div>
      </PlantillaPagina>
    );
  }

  // 3. EARLY RETURN B: VISTA DE DETALLE (Si el usuario hizo clic en un producto)
  if (codigoBuscado) {
    return (
      <PlantillaPagina titulo={productoEncontrado ? productoEncontrado.nombre : "No encontrado"}>
        <main className="container my-5">
          <div className="mb-4">
            <a href="tienda.html" className="btn btn-outline-secondary">
              &larr; Volver a la vitrina
            </a>
          </div>
          
          {productoEncontrado ? (
            <div className="d-flex justify-content-center">
              <FichaProducto producto={productoEncontrado} detalle={true} />
            </div>
          ) : (
            <div className="alert alert-danger text-center shadow-sm p-5">
              <h2 className="h4 mb-3">¡fue!</h2>
              <p className="fs-5">se agoto.</p>
            </div>
          )}
        </main>
      </PlantillaPagina>
    );
  }

  // 4. FLUJO PRINCIPAL: VISTA DEL CATÁLOGO COMPLETO 
  return (
    <PlantillaPagina titulo="Nuestros Productos">
      <main className="container my-5">
        <div className="text-center mb-5">
          <h2 className="h3 fw-bold border-bottom pb-2 d-inline-block">Catálogo del Kizazo</h2>
        </div>
        
        {productos.length > 0 ? (
          // Sistema de Grilla de Bootstrap: 
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            {productos.map((producto) => (
              <div className="col" key={producto.codigo}>
                <FichaProducto producto={producto} />
              </div>
            ))}
          </div>
            ) : (
          <div className="text-center py-5">
            <img 
              src="https://i.pinimg.com/736x/39/98/ec/3998ecef0fd9b44e81b5442be9a0705e.jpg" 
              alt="No hay productos" 
              className="img-fluid mb-4 rounded shadow-sm" 
              style={{ maxWidth: "300px" }} 
            />
            <p className="text-muted fs-4">Nos saquearon, no hay productos disponibles por ahora u.u</p>
          </div>
        )}
      </main>
    </PlantillaPagina>
  );
}