import React from "react";

export default function PiePagina() { 
  return (
    // bg-light y border-top separan visualmente el pie del resto del contenido
    <footer className="bg-light text-center py-4 mt-auto border-top">
      <div className="container">
        <p className="mb-1 fw-medium">Pie de página</p>
        
        {/* text-muted le da ese tono grisáceo sutil típico de los derechos de autor */}
        <p className="mb-0 small text-muted">
          © 2026 - Todos los derechos reservados | <strong className="text-dark">Subdirección del kizazo</strong>
        </p>
      </div>
    </footer>
  ); 
}