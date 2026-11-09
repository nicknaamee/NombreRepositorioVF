import React, { useState } from "react";
import { useTienda } from "../../services/contexto.jsx";
import Imagen from "../atoms/Imagen.jsx";
import Boton from "../atoms/Boton.jsx";
import { agregar, pesos } from "../../services/carrito.js";

export default function FichaProducto({ producto, detalle = false }) {
  const { usuario } = useTienda();
  const [mensajeCarrito, setMensajeCarrito] = useState("");
  const [esError, setEsError] = useState(false); // Para darle color rojo o verde al texto

  const urlDetalle = "tienda.html?producto=" + encodeURIComponent(producto.codigo);

  return (
    // 2. Usamos el componente Card de Bootstrap. 'h-100' hace que todas las tarjetas midan lo mismo.
    <article className={`card shadow-sm ${detalle ? 'w-100 border-0' : 'h-100'}`}>
      {producto.imagen ? (
        <Imagen 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="card-img-top" 
          style={{ objectFit: "cover", height: detalle ? "400px" : "200px" }} 
        />
      ) : (
        <div 
          className="card-img-top bg-light d-flex align-items-center justify-content-center border-bottom" 
          style={{ height: detalle ? "400px" : "200px" }}
          aria-label="Producto sin foto"
        >
          <span className="fs-1">{producto.categoria === "Papel" ? "🧻" : "📦"}</span>
          <p className="text-muted ms-2 mb-0 fw-bold">Imaginación.jpg</p>
        </div>
      )}

      {/* 4. CUERPO DE LA TARJETA (Usa flexbox para alinear contenido) */}
      <div className="card-body d-flex flex-column">
        
        {/* Título */}
        <h3 className="card-title h5 fw-bold mb-2">
          {detalle ? producto.nombre : <a href={urlDetalle} className="text-decoration-none text-dark">{producto.nombre}</a>}
        </h3>
        
        {/* Categoría y Precio */}
        <h6 className="card-subtitle mb-3 text-muted d-flex justify-content-between">
          <span>{producto.categoria}</span> 
          <span className="text-primary fw-bold">{pesos(producto.precio)}</span>
        </h6>

        {/* Descripción (Solo visible cuando se hace clic para ver detalles) */}
        {detalle && (
          <p className="card-text">
            {producto.descripcion || "El practicante olvidó ponerle descripción a esto. ."}
          </p>
        )}

        {/* 5. CONTROLES INFERIORES (El mt-auto los empuja siempre hacia abajo) */}
        <div className="mt-auto pt-3 border-top">
          <p className={`fw-semibold text-center mb-3 ${producto.stock ? "text-success" : "text-danger"}`}>
            {producto.stock ? `${producto.stock} unidades en bodega` : "Agotado (no llore u.u)"}
          </p>

          {/* Botón de compra (Oculto para vendedores) */}
          {usuario?.rol !== "Vendedor" && (
            <>
              <Boton
                className={`btn w-100 ${producto.stock ? "btn-primary" : "btn-secondary"}`}
                disabled={!producto.stock}
                onClick={() => {
                  try {
                    agregar(producto);
                    setMensajeCarrito("¡A la bolsa, mi rey! 🛒");
                    setEsError(false);
                    // Efecto visual: Ocultamos el mensaje de éxito después de 2.5 segundos
                    setTimeout(() => setMensajeCarrito(""), 2500);
                  } catch (error) {
                    setMensajeCarrito(error.message);
                    setEsError(true);
                  }
                }}
              >
                {producto.stock ? "toma ya" : "Ya fue"}
              </Boton>
              
              {/* Texto de aviso dinámico */}
              <div style={{ minHeight: "24px" }}>
                {mensajeCarrito && (
                  <p role="status" className={`small mt-2 text-center fw-bold ${esError ? "text-danger" : "text-success"}`}>
                    {mensajeCarrito}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </article>
  );
}